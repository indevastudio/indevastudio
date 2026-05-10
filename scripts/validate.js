#!/usr/bin/env node
/**
 * INDEVA STUDIO — CONFIG VALIDATOR
 * Checks blogs.config.js for errors before generating.
 * Run: node scripts/validate.js
 */

import { blogs } from '../blogs.config.js';

const REQUIRED = ['slug','title','metaDesc','category','readTime','date','heroImage','heroAlt','intro','sections'];
const seen     = new Set();
let   errors   = 0;

console.log('\n🔍  Validating blogs.config.js...\n');

for (const b of blogs) {
  if (!b.title && b.slug) continue;  // skip slug-only placeholders

  const id   = b.slug || '(no slug)';
  const errs = [];

  // Required fields
  for (const f of REQUIRED) {
    if (!b[f]) errs.push(`missing field: "${f}"`);
  }

  // Duplicate slug
  if (b.slug) {
    if (seen.has(b.slug)) errs.push(`duplicate slug`);
    seen.add(b.slug);
  }

  // Slug format: lowercase + hyphens only
  if (b.slug && /[^a-z0-9-]/.test(b.slug)) {
    errs.push(`slug has invalid chars — use only lowercase letters, numbers, hyphens`);
  }

  // Meta lengths
  if (b.metaDesc?.length > 165)  errs.push(`metaDesc too long (${b.metaDesc.length} chars, max 160)`);
  if (b.metaTitle?.length > 65)  errs.push(`metaTitle too long (${b.metaTitle.length} chars, max 60)`);

  // Sections not empty
  if (Array.isArray(b.sections) && !b.sections.length) errs.push(`sections array is empty`);

  if (errs.length) {
    console.error(`  ✗  ${id}`);
    errs.forEach(e => console.error(`       → ${e}`));
    errors += errs.length;
  } else {
    console.log(`  ✓  ${id}`);
  }
}

console.log(`\n${'─'.repeat(44)}`);

if (errors) {
  console.error(`  ❌  ${errors} error(s) found. Fix before generating.\n`);
  process.exit(1);
} else {
  console.log(`  ✅  All configs valid. Ready to generate.\n`);
}
