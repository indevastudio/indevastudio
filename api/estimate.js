// Reads an uploaded floor plan with Claude and returns the rooms and their sizes.
// The BOQ itself is priced in the browser (cost-estimate.html) from the Indéva rate table.
// Auth: AI_GATEWAY_API_KEY (Vercel AI Gateway, preferred), else the Vercel OIDC token, else ANTHROPIC_API_KEY (direct).
// ESTIMATE_MODEL is optional.

export const config = { maxDuration: 60 };

const MAX_BYTES = 4 * 1024 * 1024;           // decoded file size limit
const hits = new Map();                       // best-effort per-IP limit (per warm instance)
const LIMIT = 6, WINDOW_MS = 60 * 60 * 1000;   // 6 plans per IP per hour

const ROOM_TYPES = ['living', 'dining', 'living_dining', 'kitchen', 'master_bedroom', 'bedroom', 'dress', 'toilet',
  'balcony', 'utility', 'lobby', 'passage', 'puja', 'study', 'store', 'servant_room', 'family_lounge', 'other'];

const TOOL = {
  name: 'record_floor_plan',
  description: 'Record the rooms read from a residential floor plan.',
  input_schema: {
    type: 'object',
    properties: {
      is_floor_plan: { type: 'boolean', description: 'false if the image is not a residential floor plan or is unreadable' },
      flat_label: { type: 'string', description: "Short label, e.g. '3 BHK apartment' or '2 BHK + study'" },
      carpet_area_sqft: { type: ['number', 'null'], description: 'Carpet area in sq.ft. if stated on the plan (convert sq.m × 10.764), else null' },
      rooms: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Room name as written on the plan' },
            type: { type: 'string', enum: ROOM_TYPES },
            length_mm: { type: 'number', description: 'Longer side in millimetres' },
            width_mm: { type: 'number', description: 'Shorter side in millimetres' },
            size_source: { type: 'string', enum: ['written', 'estimated'], description: "'written' if the size is printed on the plan, else 'estimated' from scale" },
          },
          required: ['name', 'type', 'length_mm', 'width_mm', 'size_source'],
        },
      },
      notes: { type: 'string', description: 'One or two short lines on anything unclear (e.g. sizes estimated, unreadable labels)' },
    },
    required: ['is_floor_plan', 'flat_label', 'rooms'],
  },
};

const PROMPT = `You are reading a residential floor plan for an interior design cost estimate in India.
List every room or space on the plan with its size. Rules:
- Convert all sizes to millimetres. Plans in India often write sizes in feet-inches (e.g. 12'6" x 10'0" = 3810 x 3048 mm) or in mm/m.
- Use the size written on the plan whenever there is one (size_source "written"); only estimate from scale if none is written ("estimated").
- type: master_bedroom for the largest bedroom or one labelled master; bedroom for other bedrooms (incl. guest/kids);
  living_dining when one room is labelled living/dining or drawing/dining; toilet for any bath/WC/toilet/powder room;
  dress for dress / walk-in wardrobe; utility for utility / wash area; lobby for entrance lobby / foyer.
- If the plan shows several flats or floors, read only the main one and say so in notes.
- Do not invent rooms that are not drawn. If the image is not a floor plan, set is_floor_plan false and rooms [].`;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status, headers: { 'content-type': 'application/json', 'cache-control': 'no-store', 'x-robots-tag': 'noindex' },
  });
}

export async function POST(request) {
  const origin = request.headers.get('origin') || '';
  if (origin && !/^https:\/\/(www\.)?indevastudio\.com$|\.vercel\.app$|^http:\/\/localhost(:\d+)?$/.test(origin)) {
    return json({ error: 'Not allowed.' }, 403);
  }
  const gwKey = process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN || request.headers.get('x-vercel-oidc-token');
  const key = gwKey || process.env.ANTHROPIC_API_KEY;
  if (!key) return json({ error: 'The estimator is not switched on yet. Please WhatsApp us your plan.' }, 503);

  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const now = Date.now();
  const rec = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  if (rec.length >= LIMIT) return json({ error: 'Too many plans from this connection. Please try again in an hour or WhatsApp us.' }, 429);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  const { file, mediaType, phone, website } = body || {};
  if (website) return json({ error: 'Bad request.' }, 400);                       // honeypot
  if (!/^[6-9]\d{9}$/.test(String(phone || '').replace(/\D/g, '').slice(-10))) return json({ error: 'Please enter a valid 10-digit mobile number.' }, 400);
  const okTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
  if (!file || !okTypes.includes(mediaType)) return json({ error: 'Please upload a JPG, PNG or PDF of your floor plan.' }, 400);
  if (file.length * 0.75 > MAX_BYTES) return json({ error: 'The file is too large. Please upload a plan under 4 MB.' }, 413);

  rec.push(now); hits.set(ip, rec);

  const content = mediaType === 'application/pdf'
    ? { type: 'document', source: { type: 'base64', media_type: mediaType, data: file } }
    : { type: 'image', source: { type: 'base64', media_type: mediaType, data: file } };

  try {
    const url = gwKey ? 'https://ai-gateway.vercel.sh/v1/messages' : 'https://api.anthropic.com/v1/messages';
    const headers = gwKey
      ? { authorization: 'Bearer ' + gwKey, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' }
      : { 'x-api-key': key, 'anthropic-version': '2023-06-01', 'content-type': 'application/json' };
    const r = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: process.env.ESTIMATE_MODEL || (gwKey ? 'anthropic/claude-sonnet-5' : 'claude-sonnet-5-5'),
        max_tokens: 3000,
        tools: [TOOL],
        tool_choice: { type: 'tool', name: TOOL.name },
        messages: [{ role: 'user', content: [content, { type: 'text', text: PROMPT }] }],
      }),
    });
    if (!r.ok) {
      console.error('anthropic', r.status, (await r.text()).slice(0, 500));
      return json({ error: 'We could not read the plan right now. Please try again in a minute.' }, 502);
    }
    const data = await r.json();
    const use = (data.content || []).find((c) => c.type === 'tool_use');
    if (!use) return json({ error: 'We could not read the plan. Please try a clearer image.' }, 422);
    const out = use.input;
    if (!out.is_floor_plan || !Array.isArray(out.rooms) || !out.rooms.length) {
      return json({ error: "This doesn't look like a floor plan we can read. Please upload a clear plan with room names and sizes." }, 422);
    }
    out.rooms = out.rooms
      .filter((x) => x && x.length_mm > 300 && x.width_mm > 300 && x.length_mm < 30000 && x.width_mm < 30000)
      .map((x) => ({ ...x, type: ROOM_TYPES.includes(x.type) ? x.type : 'other' }));
    return json(out);
  } catch (e) {
    console.error('estimate', e);
    return json({ error: 'Something went wrong reading the plan. Please try again.' }, 500);
  }
}
