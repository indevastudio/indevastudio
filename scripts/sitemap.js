#!/usr/bin/env node
/**
 * INDEVA STUDIO — SITEMAP GENERATOR
 * Scans actual insights/ HTML files (not just config) to build sitemap.xml
 * Only physically-present files appear in the sitemap — no dead links.
 * Run: node scripts/sitemap.js
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const INSIGHTS  = path.join(ROOT, 'insights');
const BASE      = 'https://www.indevastudio.com';
const today     = new Date().toISOString().split('T')[0];

const staticPages = [
  { loc: '/',          priority: '1.0', changefreq: 'weekly'  },
  { loc: '/about',     priority: '0.8', changefreq: 'monthly' },
  { loc: '/services',  priority: '0.8', changefreq: 'monthly' },
  { loc: '/projects',  priority: '0.8', changefreq: 'monthly' },
  { loc: '/insights/', priority: '0.9', changefreq: 'weekly'  },
  { loc: '/contact',   priority: '0.7', changefreq: 'monthly' },
  { loc: '/delhi',     priority: '0.7', changefreq: 'monthly' },
  { loc: '/gurgaon',   priority: '0.7', changefreq: 'monthly' },
  { loc: '/noida',     priority: '0.7', changefreq: 'monthly' },
  { loc: '/sonipat',   priority: '0.7', changefreq: 'monthly' },
];

const urlTag = ({ loc, priority, changefreq }) => `
  <url>
    <loc>${BASE}${loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

// Read only ACTUAL HTML files from insights/ — prevents dead sitemap entries
const blogSlugs = fs.existsSync(INSIGHTS)
  ? fs.readdirSync(INSIGHTS)
      .filter(f => f.endsWith('.html') && f !== 'index.html')
      .map(f => f.replace('.html',''))
  : [];

const blogUrls = blogSlugs.map(slug =>
  urlTag({ loc:`/insights/${slug}`, priority:'0.6', changefreq:'monthly' })
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(urlTag).join('')}
${blogUrls.join('')}
</urlset>`.trim();

fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');

console.log(`\n🗺   sitemap.xml → ${staticPages.length} static + ${blogUrls.length} blog URLs\n`);
