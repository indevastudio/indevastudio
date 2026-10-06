#!/usr/bin/env node
/**
 * indéva studio — site-wide SEO consistency pass (safe to run any number of times)
 *
 * Run from the repo root:  node scripts/seo-apply.cjs
 * Run by .github/workflows/seo-build.yml and after every auto-published blog post.
 *
 * Reads vercel.json (redirects + X-Robots-Tag noindex rules) and, across every
 * served HTML file:
 *   1. canonical / og:url / JSON-LD URLs: absolute https://www, no trailing slash
 *   2. internal links: https://www, no trailing slash, /#section -> /section,
 *      and links to redirected URLs point straight at the final URL (no hops)
 *   3. Instagram handle -> @indeva.studio
 *   4. insight articles: exactly one <h1> (extra <h1>s in the body become <h2>)
 *   5. /insights listing: drops cards for redirected / noindex articles and adds
 *      a card for every indexable article that has none (no orphan pages);
 *      insights.html is kept identical as a fallback copy
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const ORIGIN = 'https://www.indevastudio.com';
const rel = p => path.join(ROOT, p);

const vercel = JSON.parse(fs.readFileSync(rel('vercel.json'), 'utf8'));
const strip = s => (s.length > 1 ? s.replace(/\/+$/, '') : s);
const redirectMap = new Map((vercel.redirects || [])
  .filter(r => !r.source.includes(':'))
  .map(r => [strip(r.source), strip(r.destination)]));
const finalUrl = p => { const seen = new Set(); while (redirectMap.has(p) && !seen.has(p)) { seen.add(p); p = redirectMap.get(p); } return p; };
const noindex = new Set((vercel.headers || [])
  .filter(h => (h.headers || []).some(x => /^x-robots-tag$/i.test(x.key) && /noindex/i.test(x.value)))
  .map(h => strip(h.source)));

const SECTION = { home: '/', about: '/about', services: '/services', process: '/process', projects: '/projects',
  philosophy: '/philosophy', blog: '/insights', insights: '/insights', vendors: '/vendors', furniture: '/furniture', contact: '/contact' };

// ── files to process ─────────────────────────────────────────────
const GENERATED = new Set(['index.html', 'about.html', 'services.html', 'process.html', 'philosophy.html', 'contact.html', 'furniture.html', 'vendors.html']);
const PRIVATE = /cost[-_]builder/i;
const files = [];
for (const f of fs.readdirSync(ROOT)) {
  if (f.endsWith('.html') && !GENERATED.has(f) && !PRIVATE.test(f) && !/^pshow/.test(f)) files.push(f);
}
const insDir = rel('insights');
for (const slug of fs.existsSync(insDir) ? fs.readdirSync(insDir) : []) {
  const f = path.join('insights', slug, 'index.html');
  if (!fs.existsSync(rel(f))) continue;
  if (redirectMap.has(`/insights/${slug}`)) continue;          // never served
  files.push(f);
}
if (fs.existsSync(rel('insights/index.html'))) files.push('insights/index.html');

// ── URL normalisation ───────────────────────────────────────────
function normInternal(url, hasOwnContactId) {
  let u = url;
  const abs = /^(?:https?:)?\/\/(?:www\.)?indevastudio\.com/i;
  const isAbs = abs.test(u);
  if (isAbs) u = u.replace(abs, '') || '/';
  if (!isAbs && !u.startsWith('/')) {
    if (u === '#contact' && !hasOwnContactId) return '/contact';
    return url;                                                 // relative / external / mailto / in-page anchor
  }
  const m = u.match(/^\/#([a-z]+)$/);                           // /#services -> /services
  if (m && SECTION[m[1]]) u = SECTION[m[1]];
  const [p, rest = ''] = u.split(/(?=[?#])/);
  let pathPart = strip(p) || '/';
  pathPart = finalUrl(pathPart);
  u = pathPart + rest;
  return isAbs ? ORIGIN + (u === '/' ? '/' : u) : u;
}
function canonUrl(url) {
  const m = url.match(/^(?:https?:)?\/\/(?:www\.)?indevastudio\.com(\/[^"]*)?$/i);
  if (!m) return url;
  const p = finalUrl(strip(m[1] || '/') || '/');
  return ORIGIN + (p === '/' ? '/' : p);
}

const stats = {};
const bump = k => (stats[k] = (stats[k] || 0) + 1);

for (const f of files) {
  const file = rel(f);
  let h = fs.readFileSync(file, 'utf8');
  const before = h;
  const hasOwnContactId = /\bid="contact"/.test(h);

  // 1. canonical, og:url, JSON-LD url / @id / item
  h = h.replace(/(<link\b[^>]*rel="canonical"[^>]*href=")([^"]+)(")/g, (_, a, u, b) => a + canonUrl(u) + b);
  h = h.replace(/(<meta\b[^>]*property="og:url"[^>]*content=")([^"]+)(")/g, (_, a, u, b) => a + canonUrl(u) + b);
  h = h.replace(/("(?:url|@id|item)"\s*:\s*")(https?:\/\/(?:www\.)?indevastudio\.com[^"]*)(")/g, (_, a, u, b) => a + canonUrl(u) + b);

  // 2. internal links
  h = h.replace(/(<a\b[^>]*?\shref=")([^"]+)(")/g, (_, a, u, b) => a + normInternal(u, hasOwnContactId) + b);

  // 3. Instagram handle
  h = h.replace(/instagram\.com\/indevastudio(?![\w.])/g, 'instagram.com/indeva.studio')
       .replace(/>@indevastudio</g, '>@indeva.studio<');

  // 4. one <h1> per article: body <h1>s become <h2>
  if (f.startsWith('insights/') && f !== 'insights/index.html') {
    const count = (h.match(/<h1\b/g) || []).length;
    if (count > 1) {
      h = h.replace(/(<main class="article-body">)([\s\S]*?)(<\/main>)/, (_, a, body, b) =>
        a + body.replace(/<h1(\b[^>]*)>([\s\S]*?)<\/h1>/g, '<h2$1>$2</h2>') + b);
      if ((h.match(/<h1\b/g) || []).length < count) bump('extra article <h1> demoted');
    }
  }
  if (h !== before) { fs.writeFileSync(file, h); bump('files updated'); }
}

// ── 5. /insights listing ─────────────────────────────────────────
const listing = rel('insights/index.html');
if (fs.existsSync(listing)) {
  let h = fs.readFileSync(listing, 'utf8');
  const cardRe = /[ \t]*<a class="blog-card" href="(?:https:\/\/www\.indevastudio\.com)?(\/insights\/[a-z0-9-]+)"[\s\S]*?<\/a>[ \t]*\n?/g;
  // drop cards for redirected / noindex articles, and duplicates
  const seen = new Set();
  h = h.replace(cardRe, (m, u) => {
    if (redirectMap.has(u) || noindex.has(u) || seen.has(u)) { bump('listing cards removed'); return ''; }
    seen.add(u); return m;
  });
  // add cards for indexable articles that have none
  const decode = s => s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");
  const enc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const add = [];
  for (const slug of fs.readdirSync(insDir)) {
    const u = `/insights/${slug}`, f = path.join(insDir, slug, 'index.html');
    if (!fs.existsSync(f) || seen.has(u) || redirectMap.has(u) || noindex.has(u)) continue;
    const p = fs.readFileSync(f, 'utf8');
    if (/<meta\s+name=["']robots["'][^>]*noindex/i.test(p)) continue;
    const g = re => (p.match(re) || [])[1] || '';
    const title = decode(g(/<h1[^>]*>([\s\S]*?)<\/h1>/).replace(/<[^>]+>/g, '').trim()) ||
                  decode(g(/<title>([\s\S]*?)<\/title>/).replace(/\s*[—|]\s*ind[ée]va.*$/i, '').trim());
    const desc = decode(g(/<meta name="description" content="([^"]*)"/));
    const img = g(/<meta property="og:image" content="([^"]*)"/);
    if (!title || !desc || !img) continue;
    add.push({ u, date: g(/"datePublished"\s*:\s*"([0-9-]{10})/) || '0000-00-00',
      html: `<a class="blog-card" href="${u}">
      <img src="${enc(img)}" alt="${enc(decode(g(/<img[^>]*alt="([^"]*)"/)) || title)}" class="blog-card-image" loading="lazy">
      <div class="blog-card-cat">${enc(decode(g(/class="article-cat"[^>]*>([^<]+)</) || 'insights').toLowerCase())}</div>
      <h2 class="blog-card-title">${enc(title)}</h2>
      <p class="blog-card-excerpt">${enc(desc)}</p>
      <div class="blog-card-read">read article ↗</div>
    </a>\n` });
  }
  if (add.length) {
    add.sort((a, b) => b.date.localeCompare(a.date));
    const all = [...h.matchAll(/<a class="blog-card"[\s\S]*?<\/a>[ \t]*\n?/g)];
    const insertAt = all.length ? all[all.length - 1].index + all[all.length - 1][0].length : -1;
    if (insertAt < 0) throw new Error('no blog-card list found in insights/index.html');
    h = h.slice(0, insertAt) + add.map(a => '    ' + a.html).join('') + h.slice(insertAt);
    stats['listing cards added'] = add.length;
  }
  fs.writeFileSync(listing, h);
  fs.writeFileSync(rel('insights.html'), h);   // identical fallback; .vercelignore normally hides it
}

console.log('seo-apply:', JSON.stringify(stats));
