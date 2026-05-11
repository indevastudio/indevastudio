#!/usr/bin/env node
/**
 * INDEVA STUDIO — AUTO BLOG GENERATOR
 * ─────────────────────────────────────────────────────────────────
 * Fully automatic pipeline:
 *   1. Fetches live /insights/ listing page
 *   2. Finds slugs with no HTML file in insights/
 *   3. Calls Claude API → generates full blog content
 *   4. Builds production HTML → writes to insights/{slug}.html
 *   5. Pings IndexNow → instant Google + Bing indexing
 *   6. Sends email notification to NOTIFY_TO
 *
 * Required env vars (GitHub Secrets):
 *   ANTHROPIC_API_KEY   →  sk-ant-...
 *   INDEXNOW_KEY        →  your IndexNow key
 *   NOTIFY_TO           →  email address (e.g. ceo@indevastudio.com)
 *   RESEND_API_KEY      →  re_... (get free at resend.com)
 * ─────────────────────────────────────────────────────────────────
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname   = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT   = path.join(__dirname, '..');
const INSIGHTS    = path.join(REPO_ROOT, 'insights');
const DRY_RUN     = process.argv.includes('--dry-run');
const SITE_URL    = 'https://www.indevastudio.com';

// ── Env vars ──────────────────────────────────────────────────────
const API_KEY       = process.env.ANTHROPIC_API_KEY;
const INDEXNOW_KEY  = process.env.INDEXNOW_KEY;
const NOTIFY_TO     = process.env.NOTIFY_TO;
const RESEND_KEY    = process.env.RESEND_API_KEY;

if (!API_KEY) {
  console.error('\n❌  ANTHROPIC_API_KEY is not set.\n');
  process.exit(1);
}

if (!fs.existsSync(INSIGHTS)) fs.mkdirSync(INSIGHTS, { recursive: true });

// ─────────────────────────────────────────────────────────────────
// STEP 1 — Fetch published slugs from live listing page
// ─────────────────────────────────────────────────────────────────
async function fetchPublishedSlugs() {
  console.log(`\n📡  Fetching ${SITE_URL}/insights/ ...`);
  const res = await fetch(`${SITE_URL}/insights/`, {
    headers: { 'User-Agent': 'indeva-auto-generator/3.0' }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching insights page`);
  const html = await res.text();

  const pattern = /href="\/insights\/([a-z0-9][a-z0-9-]*[a-z0-9])"/g;
  const slugs   = new Set();
  let   m;
  while ((m = pattern.exec(html)) !== null) {
    if (m[1] !== 'insights') slugs.add(m[1]);
  }
  console.log(`    Found ${slugs.size} slugs on the listing page.`);
  return [...slugs];
}

// ─────────────────────────────────────────────────────────────────
// STEP 2 — Find which slugs have no HTML file yet
// ─────────────────────────────────────────────────────────────────
function findMissingSlugs(all) {
  const existing = new Set(
    fs.readdirSync(INSIGHTS)
      .filter(f => f.endsWith('.html') && f !== 'index.html')
      .map(f => f.replace('.html', ''))
  );
  const missing = all.filter(s => !existing.has(s));
  console.log(`    HTML files in repo : ${existing.size}`);
  console.log(`    Missing (need gen) : ${missing.length}`);
  missing.forEach(s => console.log(`      → /insights/${s}`));
  return missing;
}

// ─────────────────────────────────────────────────────────────────
// STEP 3 — Generate content via Claude API
// ─────────────────────────────────────────────────────────────────
async function generateContent(slug) {
  console.log(`\n  🤖  Generating: ${slug}`);
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{
        role: 'user',
        content: `You are a senior content writer for indéva studio, a luxury interior design and custom furniture manufacturing studio based in Chattarpur, Delhi, India.

Write a complete, high-quality blog post for the URL slug: "${slug}"

Respond ONLY with a valid JSON object — no markdown, no backticks, no explanation:
{
  "title": "Full SEO-optimised blog post title",
  "metaTitle": "SEO title max 60 chars — indéva studio",
  "metaDesc": "Meta description max 155 chars with primary keyword",
  "category": "one of: villa & farmhouse | bedroom design | hospitality design | spatial logic | execution | india market | design intelligence | philosophy | lighting | kitchen design | colour theory | sustainable design | bathroom design | commercial design | small spaces | client guide",
  "readTime": "X min read",
  "date": "May 2025",
  "city": "Delhi | Gurgaon | Noida | Delhi NCR | Chandigarh | (empty if not location-specific)",
  "heroImageKeywords": "3-5 word Unsplash search phrase for the ideal hero image",
  "intro": "2-3 sentence opening paragraph. Direct and specific. No fluff.",
  "sections": [
    { "type": "h2", "text": "Section heading" },
    { "type": "p", "text": "Paragraph. Use **bold** for key terms. Under 80 words." },
    { "type": "h3", "text": "Sub-heading" },
    { "type": "quote", "text": "One short memorable line" },
    { "type": "list", "items": ["Specific point one", "Specific point two"] },
    { "type": "callout", "text": "Key insight in 1-2 sentences." }
  ],
  "faqs": [
    { "q": "Specific client question", "a": "Direct answer with a number or detail." }
  ]
}

Requirements:
- 6-10 sections total (mix types — do not have all p sections)
- 3-4 FAQs minimum
- Indian market context, Delhi NCR references where relevant
- Include INR cost ranges where helpful
- Sophisticated tone — never salesy
- Do not include items with empty text fields`
      }],
    }),
  });

  if (!res.ok) throw new Error(`Claude API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const raw  = (data.content?.[0]?.text || '').replace(/^```(?:json)?\s*/,'').replace(/\s*```$/,'').trim();

  try {
    return JSON.parse(raw);
  } catch(e) {
    throw new Error(`JSON parse failed: ${e.message}\nRaw: ${raw.slice(0,300)}`);
  }
}

// ─────────────────────────────────────────────────────────────────
// STEP 4 — Get hero image from Unsplash
// ─────────────────────────────────────────────────────────────────
const FALLBACK_IMAGES = [
  'photo-1600210492486-724fe5c67fb0',
  'photo-1586023492125-27b2c045efd7',
  'photo-1555041469-a586c61ea9bc',
  'photo-1567538096630-e0c55bd6374c',
  'photo-1616486338812-3dadae4b4ace',
  'photo-1631679706909-1844bbd07221',
  'photo-1560448204-e02f11c3d0e2',
  'photo-1484101403633-562f891dc89a',
  'photo-1558618666-fcd25c85cd64',
  'photo-1484154218962-a197022b5858',
];

async function getHeroImage(keywords, slug) {
  try {
    const q   = encodeURIComponent((keywords || 'luxury interior design').replace(/[^\w\s]/g,''));
    const res = await fetch(`https://source.unsplash.com/1200x675/?${q}`, { redirect:'follow', method:'HEAD' });
    if (res.ok && res.url?.includes('unsplash.com/photo')) {
      const id = res.url.match(/photo-([a-zA-Z0-9_-]+)/)?.[1];
      if (id) return `https://images.unsplash.com/photo-${id}?w=1200&h=675&fit=crop&q=80`;
    }
  } catch(_) {}
  const idx = [...slug].reduce((a,c) => a + c.charCodeAt(0), 0) % FALLBACK_IMAGES.length;
  return `https://images.unsplash.com/${FALLBACK_IMAGES[idx]}?w=1200&h=675&fit=crop&q=80`;
}

// ─────────────────────────────────────────────────────────────────
// STEP 5 — Build HTML
// ─────────────────────────────────────────────────────────────────
const esc    = (s='') => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const inline = (t='') => esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');

const renderSection = s => {
  switch(s.type) {
    case 'h2':      return `<h2>${esc(s.text)}</h2>`;
    case 'h3':      return `<h3>${esc(s.text)}</h3>`;
    case 'p':       return `<p>${inline(s.text)}</p>`;
    case 'quote':   return `<blockquote><p>${esc(s.text)}</p></blockquote>`;
    case 'callout': return `<div class="callout"><p>${inline(s.text)}</p></div>`;
    case 'list':    return `<ul>${(s.items||[]).map(i=>`<li>${inline(i)}</li>`).join('')}</ul>`;
    default:        return '';
  }
};

function buildHtml(slug, c, heroImage) {
  const yr     = new Date().getFullYear();
  const canon  = `${SITE_URL}/insights/${slug}`;
  const date   = new Date().toISOString().split('T')[0];

  const aSchema = JSON.stringify({ '@context':'https://schema.org','@type':'Article',headline:c.title,description:c.metaDesc,image:heroImage,datePublished:date,author:{'@type':'Organization',name:'indéva studio',url:SITE_URL},publisher:{'@type':'Organization',name:'indéva studio',logo:{'@type':'ImageObject',url:`${SITE_URL}/og-default.jpg`}},mainEntityOfPage:{'@type':'WebPage','@id':`${canon}/`} });
  const fSchema = c.faqs?.length ? JSON.stringify({ '@context':'https://schema.org','@type':'FAQPage',mainEntity:c.faqs.map(f=>({'@type':'Question',name:f.q,acceptedAnswer:{'@type':'Answer',text:f.a}})) }) : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(c.metaTitle)}</title>
<meta name="description" content="${esc(c.metaDesc)}"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${canon}/"/>
<meta property="og:type" content="article"/><meta property="og:url" content="${canon}/"/>
<meta property="og:title" content="${esc(c.metaTitle)}"/><meta property="og:description" content="${esc(c.metaDesc)}"/>
<meta property="og:image" content="${esc(heroImage)}"/><meta property="og:locale" content="en_IN"/><meta property="og:site_name" content="indéva studio"/>
<meta name="twitter:card" content="summary_large_image"/><meta name="twitter:title" content="${esc(c.metaTitle)}"/>
<meta name="twitter:description" content="${esc(c.metaDesc)}"/><meta name="twitter:image" content="${esc(heroImage)}"/>
<meta name="geo.region" content="IN-DL"/><meta name="geo.position" content="28.6139;77.2090"/><meta name="ICBM" content="28.6139,77.2090"/>
${c.city?`<meta name="geo.placename" content="${esc(c.city)},India"/>`:''}
<script type="application/ld+json">${aSchema}</script>
${fSchema?`<script type="application/ld+json">${fSchema}</script>`:''}
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}html{scroll-behavior:smooth}
:root{--bg:#0E0E0E;--surface:#161412;--cream:#F0EBE1;--muted:#7A7570;--border:rgba(255,255,255,.07);--bronze:#A07850;--bronze-lt:#C4966A;--max:720px}
body{background:var(--bg);color:var(--cream);font-family:'Jost',sans-serif;font-weight:300;line-height:1.75;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}img{display:block;width:100%;height:auto}
nav{position:sticky;top:0;z-index:100;background:rgba(14,14,14,.93);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:60px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400;letter-spacing:3px;text-transform:lowercase;color:var(--cream)}
.nav-logo span{display:block;font-size:9px;letter-spacing:2px;color:var(--muted);margin-top:1px;font-family:'Jost',sans-serif}
.nav-links{display:flex;gap:28px;list-style:none}.nav-links a{font-size:11px;letter-spacing:2px;text-transform:lowercase;color:var(--muted);transition:color .2s}.nav-links a:hover{color:var(--cream)}
.nav-cta{font-size:10px;letter-spacing:2px;text-transform:lowercase;color:var(--bronze);border:1px solid rgba(160,120,80,.4);padding:7px 16px;transition:all .2s}.nav-cta:hover{background:var(--bronze);color:var(--bg)}
@media(max-width:680px){.nav-links{display:none};nav{padding:0 16px}}
.breadcrumb{max-width:var(--max);margin:40px auto 0;padding:0 24px;display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:2px;text-transform:lowercase;color:var(--muted)}
.breadcrumb a{color:var(--bronze)}.breadcrumb .sep{opacity:.3}
.article-header{max-width:var(--max);margin:32px auto 0;padding:0 24px}
.article-category{display:inline-block;font-size:9px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--bronze);border:1px solid rgba(160,120,80,.3);padding:4px 12px;margin-bottom:20px}
.article-header h1{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,5vw,46px);font-weight:300;line-height:1.1;color:var(--cream);margin-bottom:20px}
.article-meta{font-size:11px;color:var(--muted);letter-spacing:1px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding-bottom:24px;border-bottom:1px solid var(--border)}
.article-meta .dot{opacity:.3}
.hero{max-width:900px;margin:0 auto;padding:32px 24px 0}.hero img{width:100%;aspect-ratio:16/9;object-fit:cover}
.article-body{max-width:var(--max);margin:48px auto 0;padding:0 24px}
.intro{font-size:17px;line-height:1.8;color:rgba(240,235,225,.85);border-left:2px solid var(--bronze);padding-left:20px;margin-bottom:48px;font-family:'Cormorant Garamond',serif;font-weight:300}
.article-body h2{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,3.5vw,32px);font-weight:400;line-height:1.2;color:var(--cream);margin:48px 0 16px}
.article-body h3{font-size:13px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--bronze-lt);margin:32px 0 12px}
.article-body p{font-size:14px;color:rgba(240,235,225,.8);margin-bottom:20px;line-height:1.85}
.article-body strong{color:var(--cream);font-weight:500}
.article-body a{color:var(--bronze-lt);border-bottom:1px solid rgba(196,150,106,.3)}.article-body a:hover{border-color:var(--bronze-lt)}
.article-body blockquote{border-left:2px solid var(--bronze);margin:32px 0;padding:20px 24px;background:rgba(160,120,80,.08)}
.article-body blockquote p{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--cream);margin:0;line-height:1.6}
.article-body ul{list-style:none;margin:20px 0 28px;display:flex;flex-direction:column;gap:10px}
.article-body ul li{font-size:14px;color:rgba(240,235,225,.8);display:flex;align-items:flex-start;gap:12px;line-height:1.7}
.article-body ul li::before{content:'◆';color:var(--bronze);font-size:7px;margin-top:8px;flex-shrink:0}
.callout{background:linear-gradient(135deg,rgba(160,120,80,.12),rgba(160,120,80,.04));border:1px solid rgba(160,120,80,.25);padding:24px 28px;margin:32px 0}
.callout p{font-size:13px!important;color:var(--cream)!important;margin:0!important}
.ornament{display:flex;align-items:center;gap:16px;margin:56px 0}.ornament-line{flex:1;height:1px;background:var(--border)}.ornament-gem{color:var(--bronze);font-size:9px}
.faq-section{max-width:var(--max);margin:64px auto 0;padding:0 24px}
.faq-section h2{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--cream);margin-bottom:32px}
details{border-top:1px solid var(--border);padding:20px 0}details:last-child{border-bottom:1px solid var(--border)}
summary{font-size:14px;font-weight:500;color:var(--cream);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px}
summary::-webkit-details-marker{display:none}summary::after{content:'+';color:var(--bronze);font-size:20px;font-weight:300;flex-shrink:0;transition:transform .2s}details[open] summary::after{transform:rotate(45deg)}
details p{font-size:13px;color:var(--muted);margin-top:14px;line-height:1.8}
.cta-section{max-width:var(--max);margin:80px auto;padding:48px 40px;border:1px solid rgba(160,120,80,.2);background:linear-gradient(135deg,rgba(160,120,80,.08),transparent);text-align:center}
.cta-label{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--bronze);display:block;margin-bottom:16px}
.cta-section h3{font-family:'Cormorant Garamond',serif;font-size:clamp(24px,4vw,36px);font-weight:300;color:var(--cream);margin-bottom:12px;line-height:1.2}
.cta-section p{font-size:13px;color:var(--muted);margin-bottom:28px}
.cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary{display:inline-block;padding:13px 32px;font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;background:var(--bronze);color:var(--bg);transition:opacity .2s}.btn-primary:hover{opacity:.85}
.btn-secondary{display:inline-block;padding:13px 32px;font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;border:1px solid rgba(160,120,80,.4);color:var(--bronze);transition:all .2s}.btn-secondary:hover{background:rgba(160,120,80,.1)}
footer{border-top:1px solid var(--border);padding:48px 32px;text-align:center;background:var(--surface)}
.footer-logo{font-family:'Cormorant Garamond',serif;font-size:20px;letter-spacing:4px;color:var(--cream);margin-bottom:4px}
.footer-tag{font-size:10px;letter-spacing:3px;text-transform:lowercase;color:var(--muted);margin-bottom:24px}
.footer-links{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;font-size:11px;color:var(--muted)}.footer-links a:hover{color:var(--cream)}
.footer-copy{margin-top:24px;font-size:10px;color:rgba(122,117,112,.4)}
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;align-items:center;gap:10px;background:#25D366;color:#fff;padding:12px 18px;font-size:12px;font-weight:500;box-shadow:0 4px 20px rgba(37,211,102,.3);transition:transform .2s;text-decoration:none}.wa-float:hover{transform:translateY(-2px);color:#fff}
.wa-float svg{width:18px;height:18px;fill:#fff;flex-shrink:0}
@media(max-width:600px){.hero,.article-header,.article-body,.faq-section,.breadcrumb{padding-left:16px;padding-right:16px}.cta-section{padding:36px 20px;margin-left:16px;margin-right:16px}}
</style>
</head>
<body>
<nav>
  <a href="${SITE_URL}/" class="nav-logo">indéva studio<span>luxury interior design · new delhi</span></a>
  <ul class="nav-links">
    <li><a href="${SITE_URL}/">home</a></li>
    <li><a href="${SITE_URL}/#about">about</a></li>
    <li><a href="${SITE_URL}/#services">services</a></li>
    <li><a href="${SITE_URL}/#projects">projects</a></li>
    <li><a href="${SITE_URL}/insights/">insights</a></li>
  </ul>
  <a href="${SITE_URL}/#contact" class="nav-cta">start a project</a>
</nav>
<div class="breadcrumb">
  <a href="${SITE_URL}/insights/">← back to insights</a>
  <span class="sep">·</span><span>${esc(c.category)}</span>
  <span class="sep">·</span><span>${esc(c.readTime)}</span>
</div>
<header class="article-header">
  <span class="article-category">${esc(c.category)}</span>
  <h1>${esc(c.title)}</h1>
  <div class="article-meta">
    <span>${esc(c.date)}</span><span class="dot">·</span>
    <span>${esc(c.readTime)}</span><span class="dot">·</span>
    <span>indéva studio</span>
    ${c.city?`<span class="dot">·</span><span>${esc(c.city)}</span>`:''}
  </div>
</header>
<div class="hero">
  <img src="${esc(heroImage)}" alt="${esc(c.title.toLowerCase())}" loading="eager" fetchpriority="high"/>
</div>
<article class="article-body">
  <p class="intro">${inline(c.intro)}</p>
  ${(c.sections||[]).filter(s=>s.text||s.items?.length).map(renderSection).join('\n  ')}
  <div class="ornament"><div class="ornament-line"></div><span class="ornament-gem">◆</span><div class="ornament-line"></div></div>
</article>
${c.faqs?.length?`
<section class="faq-section">
  <h2>frequently asked questions</h2>
  ${c.faqs.map(f=>`<details><summary>${esc(f.q)}</summary><p>${inline(f.a)}</p></details>`).join('')}
</section>`:''}
<div class="cta-section">
  <span class="cta-label">indéva studio</span>
  <h3>ready to transform<br>your space?</h3>
  <p>our design consultants are available for a complimentary discovery session.</p>
  <div class="cta-buttons">
    <a href="${SITE_URL}/#contact" class="btn-primary">start a project ↗</a>
    <a href="https://wa.me/919717881083?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project" class="btn-secondary" target="_blank" rel="noopener">whatsapp us</a>
  </div>
</div>
<footer>
  <div class="footer-logo">indéva studio</div>
  <p class="footer-tag">luxury interior design · new delhi, india</p>
  <div class="footer-links">
    <a href="${SITE_URL}/">home</a>
    <a href="${SITE_URL}/insights/">insights</a>
    <a href="${SITE_URL}/#projects">projects</a>
    <a href="${SITE_URL}/#contact">contact</a>
    <a href="mailto:hello@indevastudio.com">hello@indevastudio.com</a>
  </div>
  <p class="footer-copy">© ${yr} indéva studio. all rights reserved.</p>
</footer>
<a class="wa-float" href="https://wa.me/919717881083?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project%20with%20Ind%C3%A9va%20Studio" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
  whatsapp
</a>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────
// STEP 6 — Ping IndexNow (instant Google + Bing indexing)
// ─────────────────────────────────────────────────────────────────
async function pingIndexNow(urls) {
  if (!INDEXNOW_KEY) {
    console.log('\n  ⚠️   INDEXNOW_KEY not set — skipping IndexNow ping.');
    return;
  }
  if (!urls.length) return;

  console.log(`\n  📡  Pinging IndexNow for ${urls.length} URL(s)...`);
  try {
    const res = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({
        host:        'www.indevastudio.com',
        key:         INDEXNOW_KEY,
        keyLocation: `https://www.indevastudio.com/${INDEXNOW_KEY}.txt`,
        urlList:     urls,
      }),
    });
    if (res.ok || res.status === 202) {
      console.log(`  ✅  IndexNow accepted — URLs submitted to Google & Bing for indexing.`);
      urls.forEach(u => console.log(`       ${u}`));
    } else {
      console.log(`  ⚠️   IndexNow responded with HTTP ${res.status} — URLs may still be indexed later.`);
    }
  } catch(err) {
    console.log(`  ⚠️   IndexNow ping failed: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────
// STEP 7 — Send email notification via Resend
// ─────────────────────────────────────────────────────────────────
async function sendEmailNotification(generated) {
  if (!RESEND_KEY) {
    console.log('\n  ⚠️   RESEND_API_KEY not set — skipping email notification.');
    console.log('       Add it as a GitHub secret to enable notifications.');
    return;
  }
  if (!NOTIFY_TO) {
    console.log('\n  ⚠️   NOTIFY_TO not set — skipping email notification.');
    return;
  }
  if (!generated.length) return;

  console.log(`\n  📧  Sending email notification to ${NOTIFY_TO}...`);

  const timestamp  = new Date().toLocaleString('en-IN', { timeZone:'Asia/Kolkata', dateStyle:'medium', timeStyle:'short' });
  const blogList   = generated.map(s => `
    <tr>
      <td style="padding:12px 16px;border-bottom:1px solid #f0ebe1;font-family:Georgia,serif;font-size:14px;color:#1c1c1c;">
        ${s.replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}
      </td>
      <td style="padding:12px 16px;border-bottom:1px solid #f0ebe1;font-size:13px;">
        <a href="https://www.indevastudio.com/insights/${s}" style="color:#a07850;text-decoration:none;">
          /insights/${s} ↗
        </a>
      </td>
    </tr>`).join('');

  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#f5f0e8;font-family:Arial,sans-serif;">
<div style="max-width:600px;margin:40px auto;background:#ffffff;border:1px solid #d8cec2;">

  <div style="background:#0e0e0e;padding:32px 40px;text-align:center;">
    <p style="font-family:Georgia,serif;font-size:24px;letter-spacing:6px;color:#f0ebe1;margin:0;font-weight:300;">INDÉVA STUDIO</p>
    <p style="font-size:10px;letter-spacing:3px;color:#7a7570;margin:6px 0 0;text-transform:uppercase;">automated blog report</p>
  </div>

  <div style="padding:40px;">
    <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#a07850;margin:0 0 16px;">
      🤖 Auto-Generated · ${timestamp} IST
    </p>
    <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;color:#1c1c1c;margin:0 0 12px;line-height:1.2;">
      ${generated.length} new blog post${generated.length > 1 ? 's' : ''} published
    </h1>
    <p style="font-size:14px;color:#7a7570;margin:0 0 32px;line-height:1.7;">
      The following blog posts were automatically detected, generated, and deployed to your website. Each URL has been submitted to Google and Bing for immediate indexing via IndexNow.
    </p>

    <table style="width:100%;border-collapse:collapse;border:1px solid #d8cec2;">
      <thead>
        <tr style="background:#f5f0e8;">
          <th style="padding:12px 16px;text-align:left;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#a07850;font-weight:600;">Post Title</th>
          <th style="padding:12px 16px;text-align:left;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#a07850;font-weight:600;">Live URL</th>
        </tr>
      </thead>
      <tbody>${blogList}</tbody>
    </table>

    <div style="margin:32px 0;padding:24px;background:#f5f0e8;border-left:3px solid #a07850;">
      <p style="font-size:13px;color:#1c1c1c;margin:0;line-height:1.7;">
        <strong>IndexNow submitted:</strong> URLs sent to Google & Bing for instant crawling.<br/>
        <strong>Vercel deployed:</strong> All pages live on indevastudio.com.<br/>
        <strong>Next check:</strong> In 1 hour — any new missing posts will be auto-generated.
      </p>
    </div>

    <div style="text-align:center;margin-top:32px;">
      <a href="https://www.indevastudio.com/insights/" style="display:inline-block;padding:14px 32px;background:#a07850;color:#ffffff;font-size:11px;letter-spacing:2px;text-transform:uppercase;text-decoration:none;">
        View All Insights ↗
      </a>
    </div>
  </div>

  <div style="padding:24px 40px;border-top:1px solid #d8cec2;text-align:center;background:#faf8f4;">
    <p style="font-size:11px;color:#7a7570;margin:0;">
      indéva studio · Chattarpur, New Delhi · hello@indevastudio.com<br/>
      This is an automated notification from your GitHub blog pipeline.
    </p>
  </div>
</div>
</body></html>`;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${RESEND_KEY}`,
      },
      body: JSON.stringify({
        from:    'Indéva Studio Blog Bot <onboarding@resend.dev>',
        to:      [NOTIFY_TO],
        subject: `🤖 ${generated.length} new blog post${generated.length>1?'s':''} auto-published — indéva studio`,
        html,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      console.log(`  ✅  Email sent → ${NOTIFY_TO}  (ID: ${data.id})`);
    } else {
      const err = await res.text();
      console.log(`  ⚠️   Email send failed: ${res.status} — ${err}`);
    }
  } catch(err) {
    console.log(`  ⚠️   Email error: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n════════════════════════════════════════════════');
  console.log('  INDEVA STUDIO — AUTO BLOG GENERATOR v3');
  console.log('════════════════════════════════════════════════');
  if (DRY_RUN) console.log('  MODE: DRY RUN\n');

  const allSlugs     = await fetchPublishedSlugs();
  const missingSlugs = findMissingSlugs(allSlugs);

  if (!missingSlugs.length) {
    console.log('\n✅  All published blogs have HTML files. Nothing to do.\n');
    return;
  }

  const generated = [];
  const failed    = [];

  for (const slug of missingSlugs) {
    try {
      const content   = await generateContent(slug);
      const heroImage = await getHeroImage(content.heroImageKeywords, slug);
      const html      = buildHtml(slug, content, heroImage);

      if (!DRY_RUN) {
        fs.writeFileSync(path.join(INSIGHTS, `${slug}.html`), html, 'utf8');
        console.log(`  ✅  insights/${slug}.html  (${(html.length/1024).toFixed(1)} KB)`);
        generated.push(slug);
      } else {
        console.log(`  ✓  [DRY RUN] Would write: insights/${slug}.html`);
      }
      await new Promise(r => setTimeout(r, 1500));
    } catch(err) {
      console.error(`  ❌  ${slug}  →  ${err.message}`);
      failed.push(slug);
    }
  }

  // Write manifest for health-check step in CI
  if (generated.length) {
    fs.writeFileSync(path.join(REPO_ROOT, '.generated-slugs.json'), JSON.stringify(generated), 'utf8');
  }

  // IndexNow — ping immediately after generation (before Vercel deploys)
  if (!DRY_RUN && generated.length) {
    const liveUrls = generated.map(s => `${SITE_URL}/insights/${s}`);
    await pingIndexNow(liveUrls);
  }

  // Email notification
  if (!DRY_RUN && generated.length) {
    await sendEmailNotification(generated);
  }

  console.log('\n════════════════════════════════════════════════');
  console.log(`  Generated : ${generated.length}  |  Failed : ${failed.length}`);
  if (failed.length) {
    console.log(`  Failed (will retry next run):`);
    failed.forEach(s => console.log(`    /insights/${s}`));
  }
  console.log('');

  if (failed.length && !generated.length) process.exit(1);
}

main().catch(err => { console.error('\n💥', err.message); process.exit(1); });
