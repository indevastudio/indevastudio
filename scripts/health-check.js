#!/usr/bin/env node
/**
 * INDEVA STUDIO — HEALTH CHECK
 * Verifies newly generated blog URLs return HTTP 200 after Vercel deploys.
 * Retries with backoff to handle CDN propagation delay (30–90 seconds).
 *
 * Usage:
 *   node scripts/health-check.js                  → check .generated-slugs.json
 *   node scripts/health-check.js --all            → check all blogs in config
 *   node scripts/health-check.js my-slug other    → check specific slugs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT      = path.join(__dirname, '..');
const BASE      = 'https://www.indevastudio.com';
const RETRIES   = 6;
const DELAY     = 20_000;   // 20s initial wait
const BACKOFF   = 1.5;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function check(url) {
  try {
    const r = await fetch(url, { method:'HEAD', redirect:'follow', headers:{ 'User-Agent':'indeva-health/1.0' } });
    return { url, status: r.status, ok: r.status === 200 };
  } catch(e) {
    return { url, status: 0, ok: false, error: e.message };
  }
}

async function main() {
  const args = process.argv.slice(2);
  let slugs  = [];

  if (args.includes('--all')) {
    const { blogs } = await import('../blogs.config.js');
    slugs = blogs.filter(b => b.title && b.slug).map(b => b.slug);
  } else if (args.filter(a => !a.startsWith('--')).length) {
    slugs = args.filter(a => !a.startsWith('--'));
  } else {
    const mf = path.join(ROOT, '.generated-slugs.json');
    if (fs.existsSync(mf)) slugs = JSON.parse(fs.readFileSync(mf, 'utf8'));
  }

  if (!slugs.length) {
    console.log('\n  ℹ️  No slugs to check.\n');
    process.exit(0);
  }

  const urls = slugs.map(s => `${BASE}/insights/${s}`);
  console.log(`\n🔎  Checking ${urls.length} URL(s)...\n`);

  let remaining = [...urls];
  let passed    = [];
  let delay     = DELAY;

  for (let attempt = 1; attempt <= RETRIES; attempt++) {
    if (attempt > 1) {
      console.log(`\n  ⏳  Retrying in ${delay/1000}s (attempt ${attempt}/${RETRIES})...`);
      await sleep(delay);
      delay = Math.round(delay * BACKOFF);
    }

    const results    = await Promise.all(remaining.map(check));
    const nowPassed  = results.filter(r => r.ok);
    const stillFail  = results.filter(r => !r.ok);

    nowPassed.forEach(r => { console.log(`  ✅  ${r.url}`); passed.push(r.url); });
    stillFail.forEach(r => { console.log(`  ❌  ${r.url}  →  HTTP ${r.status}${r.error?' ('+r.error+')':''}`); });

    remaining = stillFail.map(r => r.url);
    if (!remaining.length) break;
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`  ✅  Live: ${passed.length}   ❌  Failed: ${remaining.length}`);

  if (remaining.length) {
    console.log('\n  Still failing:');
    remaining.forEach(u => console.log(`    ${u}`));
    console.log('\n  → Check that insights/{slug}.html is committed to the repo\n');
    process.exit(1);
  }

  // Clean up manifest
  const mf = path.join(ROOT, '.generated-slugs.json');
  if (fs.existsSync(mf)) fs.unlinkSync(mf);
  console.log('\n  🎉  All URLs live.\n');
}

main().catch(e => { console.error(e); process.exit(1); });
