#!/usr/bin/env node
/**
 * indéva studio — sitemap builder (single source of truth)
 * Run from the repo root: node build-sitemap.cjs
 * Run by .github/workflows/auto-generate.yml and seo-build.yml.
 *
 * Writes a sitemap index plus one sitemap per content type:
 *   sitemap.xml            -> index of the four files below
 *   sitemap-pages.xml      -> home and core pages
 *   sitemap-locations.xml  -> city / area landing pages
 *   sitemap-projects.xml   -> /projects and every project page
 *   sitemap-insights.xml   -> /insights and every indexable article
 *
 * A URL is listed only if it is canonical, indexable and live:
 *   - its file exists
 *   - it is not a redirect source in vercel.json
 *   - it has no X-Robots-Tag noindex rule in vercel.json and no robots noindex meta
 *   - its own <link rel="canonical"> points at itself
 * URLs are absolute https://www, lowercase paths, no trailing slash.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ORIGIN = 'https://www.indevastudio.com';
const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const strip = s => (s.length > 1 ? s.replace(/\/+$/, '') : s);
const redirected = new Set((vercel.redirects || []).map(r => strip(r.source)));
const noindexHeader = new Set((vercel.headers || [])
  .filter(h => (h.headers || []).some(x => /^x-robots-tag$/i.test(x.key) && /noindex/i.test(x.value)))
  .map(h => strip(h.source)));
const rewrites = new Map((vercel.rewrites || []).map(r => [strip(r.source), r.destination.replace(/^\//, '')]));

const read = f => { try { return fs.readFileSync(path.join(ROOT, f), 'utf8'); } catch { return null; } };
const isNoindexMeta = html => /<meta\s+name=["']robots["'][^>]*noindex/i.test(html);
const canonicalOf = html => ((html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)/i) || [])[1] || '');
const lastmodOf = html => ((html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/) ||
                            html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/) || [])[1] || null);

const skipped = [];
function entry(loc, file, priority) {
  if (redirected.has(loc) || noindexHeader.has(loc)) return null;
  if (loc !== loc.toLowerCase()) { skipped.push(`${loc} (uppercase)`); return null; }
  const html = read(file);
  if (!html) { skipped.push(`${loc} (no file ${file})`); return null; }
  if (isNoindexMeta(html)) return null;
  const want = ORIGIN + (loc === '/' ? '/' : loc);
  if (canonicalOf(html) !== want) { skipped.push(`${loc} (canonical is ${canonicalOf(html) || 'missing'})`); return null; }
  return { loc: want, lastmod: lastmodOf(html), priority };
}

const groups = { pages: [], locations: [], projects: [], insights: [] };
const push = (g, e) => e && groups[g].push(e);

[['/', 'index.html', '1.0'], ['/about', 'about.html', '0.8'], ['/services', 'services.html', '0.9'],
 ['/process', 'process.html', '0.6'], ['/philosophy', 'philosophy.html', '0.5'], ['/furniture', 'furniture.html', '0.6'],
 ['/vendors', 'vendors.html', '0.5'], ['/contact', 'contact.html', '0.7']]
  .forEach(([loc, f, p]) => push('pages', entry(loc, f, p)));

[['/delhi', '0.9'], ['/south-delhi-interior-designer', '0.9'], ['/gurgaon', '0.9'], ['/noida', '0.8'], ['/sonipat', '0.8']]
  .forEach(([loc, p]) => push('locations', entry(loc, `${loc.slice(1)}.html`, p)));

push('projects', entry('/projects', rewrites.get('/projects') || 'projects.html', '0.9'));
for (const [src, dest] of rewrites) {
  if (src.startsWith('/projects/')) push('projects', entry(src, dest, '0.8'));
}

push('insights', entry('/insights', 'insights/index.html', '0.8'));
const insDir = path.join(ROOT, 'insights');
for (const slug of fs.existsSync(insDir) ? fs.readdirSync(insDir).sort() : []) {
  if (!fs.existsSync(path.join(insDir, slug, 'index.html'))) continue;
  push('insights', entry(`/insights/${slug}`, `insights/${slug}/index.html`, '0.6'));
}

const xmlUrlset = list => ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
  ...list.map(e => ['  <url>', `    <loc>${e.loc}</loc>`, e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
    `    <priority>${e.priority}</priority>`, '  </url>'].filter(Boolean).join('\n')),
  '</urlset>', ''].join('\n');

const index = [];
for (const [name, list] of Object.entries(groups)) {
  const file = `sitemap-${name}.xml`;
  fs.writeFileSync(path.join(ROOT, file), xmlUrlset(list));
  const newest = list.map(e => e.lastmod).filter(Boolean).sort().pop();
  index.push(['  <sitemap>', `    <loc>${ORIGIN}/${file}</loc>`, newest ? `    <lastmod>${newest}</lastmod>` : null, '  </sitemap>'].filter(Boolean).join('\n'));
  console.log(`  ${file.padEnd(24)} ${list.length} URLs`);
}
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), ['<?xml version="1.0" encoding="UTF-8"?>',
  '<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...index, '</sitemapindex>', ''].join('\n'));
const total = Object.values(groups).reduce((n, l) => n + l.length, 0);
console.log(`sitemap.xml (index) written — ${total} URLs in ${index.length} sitemaps`);
if (skipped.length) console.log('  skipped (fix these if they should be indexed):\n   - ' + skipped.join('\n   - '));
