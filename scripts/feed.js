#!/usr/bin/env node
/**
 * INDEVA STUDIO — RSS FEED GENERATOR
 * Scans actual insights/ files (same source of truth as sitemap.js) and
 * builds an RSS 2.0 feed at repo root: feed.xml → https://www.indevastudio.com/feed.xml
 *
 * Handles both post file layouts present in the repo:
 *   insights/<slug>.html
 *   insights/<slug>/index.html
 *
 * Pulls title / description / canonical link / publish date straight out
 * of each post's existing <title>, <meta name="description">, <link rel="canonical">,
 * and the Article JSON-LD block — no separate metadata source to maintain.
 *
 * Run: node scripts/feed.js
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT       = path.join(__dirname, '..');
const INSIGHTS   = path.join(ROOT, 'insights');
const BASE       = 'https://www.indevastudio.com';
const FEED_URL   = `${BASE}/feed.xml`;
const MAX_ITEMS  = 50; // most feed readers/aggregators only care about recent posts

// ── FIND ACTUAL POST FILES (both layouts) ──────────────────────────
function findPostFiles() {
  if (!fs.existsSync(INSIGHTS)) return [];
  const entries = fs.readdirSync(INSIGHTS, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isFile() && entry.name.endsWith('.html') && entry.name !== 'index.html') {
      files.push({
        slug: entry.name.replace('.html', ''),
        filePath: path.join(INSIGHTS, entry.name),
      });
    } else if (entry.isDirectory()) {
      const indexPath = path.join(INSIGHTS, entry.name, 'index.html');
      if (fs.existsSync(indexPath)) {
        files.push({ slug: entry.name, filePath: indexPath });
      }
    }
  }
  return files;
}

// ── EXTRACT METADATA FROM AN HTML FILE ──────────────────────────────
function extractMeta(html, slug) {
  const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/i);
  const descMatch  = html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']\s*\/?>/i);
  const canonMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([\s\S]*?)["']\s*\/?>/i);

  // Pull datePublished out of the Article JSON-LD block specifically
  // (there can be more than one <script type="application/ld+json"> tag, e.g. FAQ schema)
  let datePublished = null;
  const ldBlocks = [...html.matchAll(/<script type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi)];
  for (const block of ldBlocks) {
    try {
      const data = JSON.parse(block[1]);
      if (data['@type'] === 'Article' && data.datePublished) {
        datePublished = data.datePublished;
        break;
      }
    } catch { /* skip malformed / non-JSON-LD blocks */ }
  }

  const decode = (s = '') => s
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  return {
    slug,
    title:       decode((titleMatch?.[1] || slug).replace(/\s*—\s*ind[ée]va studio$/i, '').trim()),
    description: decode(descMatch?.[1] || ''),
    link:        (canonMatch?.[1] || `${BASE}/insights/${slug}`).replace(/\/?$/, '/'),
    pubDate:     datePublished ? new Date(datePublished) : null,
  };
}

// ── BUILD RSS XML ────────────────────────────────────────────────────
const escXml = (s = '') => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&apos;');

function itemXml(post) {
  const pubDate = (post.pubDate && !isNaN(post.pubDate)) ? post.pubDate : new Date();
  return `
  <item>
    <title>${escXml(post.title)}</title>
    <link>${escXml(post.link)}</link>
    <guid isPermaLink="true">${escXml(post.link)}</guid>
    <description>${escXml(post.description)}</description>
    <pubDate>${pubDate.toUTCString()}</pubDate>
  </item>`;
}

function buildFeed(posts) {
  const now = new Date().toUTCString();
  const items = posts.map(itemXml).join('');

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>indéva studio — Insights</title>
  <link>${BASE}/insights</link>
  <atom:link href="${FEED_URL}" rel="self" type="application/rss+xml"/>
  <description>Design intelligence from indéva studio — perspectives on luxury interior design, spatial logic, materials, and process.</description>
  <language>en-in</language>
  <lastBuildDate>${now}</lastBuildDate>
  <generator>indeva-blog-generator</generator>
${items}
</channel>
</rss>`.trim();
}

// ── MAIN ──────────────────────────────────────────────────────────────
function main() {
  const files = findPostFiles();

  const posts = files
    .map(({ slug, filePath }) => {
      try {
        const html = fs.readFileSync(filePath, 'utf8');
        return extractMeta(html, slug);
      } catch (err) {
        console.warn(`  ⚠️   Skipped ${slug}: ${err.message}`);
        return null;
      }
    })
    .filter(Boolean)
    // Most recent first; posts without a parsed date sort to the bottom
    .sort((a, b) => (b.pubDate?.getTime() || 0) - (a.pubDate?.getTime() || 0))
    .slice(0, MAX_ITEMS);

  const xml = buildFeed(posts);
  fs.writeFileSync(path.join(ROOT, 'feed.xml'), xml, 'utf8');

  console.log(`\n📡  feed.xml → ${posts.length} posts (of ${files.length} found in insights/)\n`);
}

main();
