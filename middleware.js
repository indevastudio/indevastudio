// Vercel Routing Middleware — locks the client cost-builder pages behind an access code.
//
// Each client's code is their registered mobile number; the studio code opens every page.
// Codes live in the Vercel environment variable COST_BUILDER_CODES (JSON), e.g.
//   {"bansal":"98xxxxxxxx","chawla":"...","studio":"INDEVA"}
// Share a page as:  https://www.indevastudio.com/bansal-residence-narela-cost-builder?code=98xxxxxxxx
// After the first visit the code is remembered in a cookie for 90 days.

export const config = {
  matcher: [
    '/ashok-3bhk-dda-cost-builder', '/ashok-3bhk-dda-cost-builder.html',
    '/3-BHK-DDA-Mr.%20Ashok%20Cost%20builder', '/3-BHK-DDA-Mr.%20Ashok%20Cost%20builder.html',
    '/bansal-residence-narela-cost-builder', '/bansal-residence-narela-cost-builder.html',
    '/chawla-residence-shalimar-bagh-cost-builder', '/chawla-residence-shalimar-bagh-cost-builder.html',
    '/deepanshi-cost-builder', '/deepanshi-cost-builder.html',
    '/Deepanshi_Cost_Builder', '/Deepanshi_Cost_Builder.html',
    '/godrej-meridien-cost-builder', '/godrej-meridien-cost-builder.html',
    '/kunal-arora-sobha-city-cost-builder', '/kunal-arora-sobha-city-cost-builder.html',
    '/nitin-jain-cost-builder', '/nitin-jain-cost-builder.html',
    '/riyasat-ali-kureni-cost-builder', '/riyasat-ali-kureni-cost-builder.html',
    '/Sahil_Mann_Cost_Builder', '/Sahil_Mann_Cost_Builder.html',
    '/tools/:path*',
  ],
};

// Page (lower-cased, without .html) -> client key in COST_BUILDER_CODES.
const PAGES = {
  'ashok-3bhk-dda-cost-builder': 'ashok',
  '3-bhk-dda-mr. ashok cost builder': 'ashok',
  'bansal-residence-narela-cost-builder': 'bansal',
  'chawla-residence-shalimar-bagh-cost-builder': 'chawla',
  'deepanshi-cost-builder': 'deepanshi',
  'deepanshi_cost_builder': 'deepanshi',
  'godrej-meridien-cost-builder': 'godrej',
  'kunal-arora-sobha-city-cost-builder': 'kunal',
  'nitin-jain-cost-builder': 'nitin',
  'riyasat-ali-kureni-cost-builder': 'riyasat',
  'sahil_mann_cost_builder': 'sahil',
  'tools/sahil-mann/sahil_mann_cost_builder': 'sahil',
};

const COOKIE_DAYS = 90;

function pageKey(pathname) {
  let p = pathname;
  try { p = decodeURIComponent(pathname); } catch (e) { /* keep raw */ }
  return p.replace(/^\/+/, '').replace(/\/+$/, '').replace(/\.html$/i, '').toLowerCase();
}

function readCodes() {
  try { return JSON.parse(process.env.COST_BUILDER_CODES || '{}'); } catch (e) { return {}; }
}

function getCookie(request, name) {
  const header = request.headers.get('cookie') || '';
  for (const part of header.split(';')) {
    const i = part.indexOf('=');
    if (i > -1 && part.slice(0, i).trim() === name) return decodeURIComponent(part.slice(i + 1).trim());
  }
  return '';
}

function safeEqual(a, b) {
  a = String(a || ''); b = String(b || '');
  if (!a || !b || a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Codes are compared after normalising: a mobile number matches with or without
// +91, spaces or dashes (last 10 digits); word codes ignore case and spaces.
function norm(x) {
  const s = String(x || '').trim().toUpperCase();
  const digits = s.replace(/\D/g, '');
  if (digits.length >= 10 && /^[\d\s+\-().]+$/.test(s)) return digits.slice(-10);
  return s.replace(/\s+/g, '');
}

function isValid(code, client, codes) {
  const c = norm(code);
  return safeEqual(c, norm(codes[client])) || safeEqual(c, norm(codes.studio));
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function gatePage(action, wrong) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Client access — Indéva Studio</title>
<style>
:root{--bg:#FAF9F6;--ink:#1d1b18;--mute:#6b655c;--gold:#8B5E34;--line:#e4ded4}
*{box-sizing:border-box}body{margin:0;min-height:100vh;display:grid;place-items:center;background:var(--bg);color:var(--ink);font-family:"Plus Jakarta Sans",system-ui,-apple-system,"Segoe UI",sans-serif;padding:24px}
.card{width:100%;max-width:380px;border:1px solid var(--line);background:#fff;padding:36px 30px}
.logo{font-size:1.15rem;letter-spacing:.02em;margin:0 0 26px}
h1{font-weight:400;font-size:1.35rem;margin:0 0 8px}p{color:var(--mute);font-size:.88rem;line-height:1.6;margin:0 0 22px}
label{display:block;font-size:.72rem;letter-spacing:.14em;text-transform:uppercase;color:var(--mute);margin-bottom:8px}
input{width:100%;font:inherit;font-size:1.05rem;letter-spacing:.06em;padding:12px 14px;border:1px solid var(--line);background:var(--bg);color:var(--ink)}
input:focus{outline:2px solid var(--gold);outline-offset:1px}
button{margin-top:16px;width:100%;font:inherit;font-size:.78rem;letter-spacing:.16em;text-transform:uppercase;padding:14px;border:0;background:var(--gold);color:#fff;cursor:pointer}
.err{color:#b3402e;font-size:.84rem;margin:12px 0 0}
.foot{margin-top:22px;font-size:.78rem}.foot a{color:var(--gold)}
</style></head><body>
<main class="card">
<p class="logo">indéva studio</p>
<h1>Your project estimate</h1>
<p>This page is private. Enter your registered mobile number to open it.</p>
<form method="post" action="${escapeHtml(action)}">
<label for="code">Mobile number</label>
<input id="code" name="code" type="text" inputmode="tel" autocomplete="tel" placeholder="98xxx xxxxx" spellcheck="false" required autofocus>
<button type="submit">Open estimate</button>
${wrong ? '<p class="err" role="alert">That code didn’t match. Please check it and try again.</p>' : ''}
</form>
<p class="foot">No code? Message us on <a href="https://wa.me/919717881083">WhatsApp</a> or email <a href="mailto:hello@indevastudio.com">hello@indevastudio.com</a>.</p>
</main></body></html>`;
  return new Response(html, {
    status: wrong ? 401 : 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'private, no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}

function passThrough() {
  return new Response(null, {
    headers: { 'x-middleware-next': '1', 'cache-control': 'private, no-store', 'x-robots-tag': 'noindex, nofollow' },
  });
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const key = pageKey(url.pathname);
  const client = PAGES[key];
  if (!client) return undefined; // not a cost builder (e.g. other /tools/ files)

  const codes = readCodes();
  if (!codes[client] && !codes.studio) return gatePage(url.pathname, false); // fail closed if codes are not configured

  const cookieName = 'ivs_cb_' + client;
  const cookie = `${cookieName}=%CODE%; Path=/; Max-Age=${COOKIE_DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`;

  // Code submitted via the form.
  if (request.method === 'POST') {
    let code = '';
    try { code = String((await request.formData()).get('code') || ''); } catch (e) { /* ignore */ }
    if (!isValid(code, client, codes)) return gatePage(url.pathname, true);
    return new Response(null, {
      status: 303,
      headers: { location: url.pathname, 'set-cookie': cookie.replace('%CODE%', encodeURIComponent(norm(code))), 'cache-control': 'no-store' },
    });
  }

  // Code in the shared link (?code=XXXX): remember it and drop it from the address bar.
  const qp = url.searchParams.get('code');
  if (qp !== null) {
    if (!isValid(qp, client, codes)) return gatePage(url.pathname, true);
    url.searchParams.delete('code');
    return new Response(null, {
      status: 303,
      headers: { location: url.pathname + (url.search || ''), 'set-cookie': cookie.replace('%CODE%', encodeURIComponent(norm(qp))), 'cache-control': 'no-store' },
    });
  }

  if (isValid(getCookie(request, cookieName), client, codes)) return passThrough();
  return gatePage(url.pathname, false);
}
