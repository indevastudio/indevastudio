// scripts/feed.js
// Rebuilds feed.xml from insights/*/index.html.
//
// IMPORTANT: publish dates are read from GIT HISTORY (git log), not
// filesystem mtime. actions/checkout resets every file's mtime to the
// moment of checkout, so mtime-based dates collapse to one shared
// timestamp per workflow run. Git commit history is permanent and
// reflects the actual date each post was published — that's the only
// reliable source here. Requires `fetch-depth: 0` in actions/checkout
// (already set in auto-generate.yml).

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const ORIGIN = 'https://www.indevastudio.com';
const INSIGHTS = path.join(process.cwd(), 'insights');
const MAX_ITEMS = 40;

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

// Real publish date = date this file was FIRST added to git, not last
// touched (a later unrelated commit shouldn't bump a post to "new").
function getFirstCommitDate(filePath) {
  try {
    const out = execSync(
      `git log --follow --diff-filter=A --format=%aI -- "${filePath}"`,
      { cwd: process.cwd(), stdio: ['ignore', 'pipe', 'ignore'] }
    ).toString().trim();
    const lines = out.split('\n').filter(Boolean);
    if (lines.length) return new Date(lines[lines.length - 1]); // oldest = first add
  } catch (e) {
    // git log failed (e.g. file not yet committed this run) — fall through
  }
  return null;
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
  const relPath = path.relative(process.cwd(), fp);

  let title =
    extract(html, /<title>([^<]*)<\/title>/i) ||
    extract(html, /<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i);

  let description =
    extract(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) ||
    extract(html, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i);

  if (!title) continue;

  // Prefer real git history date. If this file was just generated in the
  // current run (not committed yet at the point this script runs — it
  // runs BEFORE the commit step), git log won't find it. In that case
  // fall back to "now", which is correct since it's genuinely new today.
  const gitDate = getFirstCommitDate(relPath);

  posts.push({
    title: title.replace(/\s*—\s*indéva studio.*$/i, '').trim(),
    link: `${ORIGIN}/insights/${slug}/`,
    description: description || '',
    pubDate: gitDate || new Date(),
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
