#!/usr/bin/env node
/**
 * indéva studio — sitemap builder (single source of truth)
 * Lives in the repo root. Run by .github/workflows/auto-generate.yml: node build-sitemap.cjs
 *
 * Includes only canonical, indexable URLs:
 *   - core pages, location pages, /projects and every project page
 *   - every insights/<slug>/index.html
 * Excludes:
 *   - any path that is a redirect source in vercel.json (consolidated / renamed URLs)
 *   - any page carrying <meta name="robots" content="noindex">
 * URLs have no trailing slash, matching vercel.json "trailingSlash": false.
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ORIGIN = 'https://www.indevastudio.com';

const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const redirected = new Set((vercel.redirects || []).map(r => r.source.replace(/\/$/, '')));

const CORE = [
  ['/', '1.0'], ['/about', '0.8'], ['/services', '0.9'], ['/projects', '0.9'],
  ['/contact', '0.7'], ['/furniture', '0.6'], ['/insights', '0.8'],
  ['/delhi', '0.9'], ['/south-delhi-interior-designer', '0.9'], ['/gurgaon', '0.9'],
  ['/noida', '0.8'], ['/sonipat', '0.8'],
];

function read(p) { try { return fs.readFileSync(p, 'utf8'); } catch { return null; } }
function isNoindex(html) { return /<meta\s+name=["']robots["'][^>]*noindex/i.test(html); }
function dateOf(html) {
  const m = html.match(/"dateModified"\s*:\s*"(\d{4}-\d{2}-\d{2})/) || html.match(/"datePublished"\s*:\s*"(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}
function entry(loc, priority, lastmod) {
  return ['  <url>', `    <loc>${ORIGIN}${loc === '/' ? '/' : loc}</loc>`,
    lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
    `    <priority>${priority}</priority>`, '  </url>'].filter(Boolean).join('\n');
}

const out = [];
const seen = new Set();
function add(loc, pri, file) {
  if (seen.has(loc) || redirected.has(loc)) return;
  if (file) { const h = read(file); if (!h || isNoindex(h)) return; }
  seen.add(loc); out.push(entry(loc, pri, file ? dateOf(read(file)) : null));
}

CORE.forEach(([loc, pri]) => add(loc, pri, null));

// Project case studies are flat files (project-<slug>.html) served at
// /projects/<slug> through rewrites in vercel.json.
for (const r of (vercel.rewrites || [])) {
  const m = r.destination.match(/^\/project-([a-z0-9-]+)\.html$/);
  if (m && r.source === `/projects/${m[1]}`) add(r.source, '0.8', path.join(ROOT, `project-${m[1]}.html`));
}

const insDir = path.join(ROOT, 'insights');
let blogs = 0;
if (fs.existsSync(insDir)) {
  for (const slug of fs.readdirSync(insDir).sort()) {
    const f = path.join(insDir, slug, 'index.html');
    if (!fs.existsSync(f)) continue;
    const before = out.length;
    add(`/insights/${slug}`, '0.6', f);
    if (out.length > before) blogs++;
  }
}

const xml = ['<?xml version="1.0" encoding="UTF-8"?>',
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">', ...out, '</urlset>', ''].join('\n');
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
console.log(`sitemap.xml written — ${out.length} URLs (${blogs} insights); skipped redirected + noindex pages`);
