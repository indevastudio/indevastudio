// scripts/feed.js
// Rebuilds feed.xml from insights/*/index.html — mirrors the sitemap.xml
// scan logic already used in auto-generate.yml, so it always matches
// what's actually live. ESM syntax to match this repo's package.json
// ("type": "module").

import fs from 'fs';
import path from 'path';

const ORIGIN = 'https://www.indevastudio.com';
const INSIGHTS = path.join(process.cwd(), 'insights');
const MAX_ITEMS = 40; // keep the feed to the most recent N posts

function escapeXml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function extract(html, tagRegex) {
  const m = html.match(tagRegex);
  return m ? m[1].trim() : '';
}

function toRfc822(date) {
  return date.toUTCString();
}

if (!fs.existsSync(INSIGHTS)) {
  console.log('No insights/ directory found — skipping feed.xml generation.');
  process.exit(0);
}

const posts = [];

for (const slug of fs.readdirSync(INSIGHTS)) {
  const fp = path.join(INSIGHTS, slug, 'index.html');
  if (!fs.existsSync(fp)) continue;

  const html = fs.readFileSync(fp, 'utf8');
  const stat = fs.statSync(fp);

  let title =
    extract(html, /<title>([^<]*)<\/title>/i) ||
    extract(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);

  let description =
    extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);

  if (!title) continue;

  posts.push({
    title: title.replace(/\s*—\s*indéva studio.*$/i, '').trim(),
    link: `${ORIGIN}/insights/${slug}/`,
    description: description || '',
    pubDate: stat.mtime,
  });
}

posts.sort((a, b) => b.pubDate - a.pubDate);

const items = posts.slice(0, MAX_ITEMS).map(p => [
  '  <item>',
  `    <title>${escapeXml(p.title)}</title>`,
  `    <link>${p.link}</link>`,
  `    <guid isPermaLink="true">${p.link}</guid>`,
  `    <description>${escapeXml(p.description)}</description>`,
  `    <pubDate>${toRfc822(p.pubDate)}</pubDate>`,
  '  </item>',
].join('\n'));

const lastBuildDate = toRfc822(new Date());

const xml = [
  '<?xml version="1.0" encoding="UTF-8"?>',
  '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
  '<channel>',
  '  <title>indéva studio — Insights</title>',
  '  <link>https://www.indevastudio.com/insights</link>',
  '  <atom:link href="https://www.indevastudio.com/feed.xml" rel="self" type="application/rss+xml"/>',
  '  <description>Design intelligence from indéva studio — perspectives on luxury interior design, spatial logic, materials, and process.</description>',
  '  <language>en-in</language>',
  `  <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
  '  <generator>indeva-blog-generator</generator>',
  '',
  items.join('\n\n'),
  '</channel>',
  '</rss>',
].join('\n');

fs.writeFileSync(path.join(process.cwd(), 'feed.xml'), xml + '\n');
console.log(`feed.xml written — ${Math.min(posts.length, MAX_ITEMS)} of ${posts.length} posts included.`);
