// Approximate visitor location from Vercel's IP geolocation headers.
// Used by statement.html to add city / area to client sign-in records.
export function GET(request) {
  const h = request.headers;
  const dec = (v) => { try { return v ? decodeURIComponent(v) : null; } catch (e) { return v || null; } };
  const num = (v) => { const n = parseFloat(v); return Number.isFinite(n) ? n : null; };
  const geo = {
    city: dec(h.get('x-vercel-ip-city')),
    region: dec(h.get('x-vercel-ip-country-region')),
    country: dec(h.get('x-vercel-ip-country')),
    postal_code: dec(h.get('x-vercel-ip-postal-code')),
    latitude: num(h.get('x-vercel-ip-latitude')),
    longitude: num(h.get('x-vercel-ip-longitude')),
    timezone: dec(h.get('x-vercel-ip-timezone')),
  };
  return new Response(JSON.stringify(geo), {
    headers: { 'content-type': 'application/json', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex' },
  });
}
