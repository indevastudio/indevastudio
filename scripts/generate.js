#!/usr/bin/env node
/**
 * INDEVA STUDIO — BLOG GENERATOR
 * Writes HTML files to insights/ at repo root.
 * Vercel deploys from repo root, so files committed here go live.
 *
 * Usage:
 *   node scripts/generate.js                   → generate all new posts
 *   node scripts/generate.js --force           → regenerate everything
 *   node scripts/generate.js --slug my-slug    → one post only
 *   node scripts/generate.js --audit           → show missing files
 */

import fs   from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogs } from '../blogs.config.js';

const __dirname  = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT  = path.join(__dirname, '..');
const OUT_DIR    = path.join(REPO_ROOT, 'insights');   // ← repo root /insights/

const args    = process.argv.slice(2);
const FORCE   = args.includes('--force');
const AUDIT   = args.includes('--audit');
const slugIdx = args.indexOf('--slug');
const TARGET  = slugIdx !== -1 ? args[slugIdx + 1] : null;

// ── AUDIT MODE ────────────────────────────────────────────────────
if (AUDIT) {
  console.log('\n🔍  Auditing insights/ vs blogs.config.js...\n');
  const files   = fs.existsSync(OUT_DIR)
    ? new Set(fs.readdirSync(OUT_DIR).filter(f => f.endsWith('.html') && f !== 'index.html').map(f => f.replace('.html','')))
    : new Set();
  const config  = new Set(blogs.filter(b => b.slug).map(b => b.slug));
  const missing = [...config].filter(s => !files.has(s));
  const orphan  = [...files].filter(s => !config.has(s));

  console.log(`  Config entries : ${config.size}`);
  console.log(`  HTML files     : ${files.size}`);
  if (missing.length) {
    console.log(`\n  ❌  Missing HTML (will 404):`);
    missing.forEach(s => console.log(`       /insights/${s}`));
  } else {
    console.log('\n  ✅  No missing files.');
  }
  if (orphan.length) {
    console.log(`\n  ⚠️   Orphaned files (HTML exists, not in config):`);
    orphan.forEach(s => console.log(`       /insights/${s}`));
  }
  console.log('');
  process.exit(missing.length ? 1 : 0);
}

// ── HELPERS ───────────────────────────────────────────────────────
const esc = (s = '') =>
  String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
            .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

const inline = (t = '') =>
  esc(t).replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
        .replace(/\[(.+?)\]\((.+?)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');

const section = (s) => {
  switch(s.type) {
    case 'h2':      return `<h2>${esc(s.text)}</h2>`;
    case 'h3':      return `<h3>${esc(s.text)}</h3>`;
    case 'p':       return `<p>${inline(s.text)}</p>`;
    case 'quote':   return `<blockquote><p>${esc(s.text)}</p></blockquote>`;
    case 'callout': return `<div class="callout"><p>${inline(s.text)}</p></div>`;
    case 'list':    return `<ul>${s.items.map(i=>`<li>${inline(i)}</li>`).join('')}</ul>`;
    case 'image':   return `<figure><img src="${esc(s.url)}" alt="${esc(s.alt)}" loading="lazy"/>${s.credit?`<figcaption>${esc(s.credit.name)}</figcaption>`:''}</figure>`;
    default:        return '';
  }
};

const articleSchema = (p) => JSON.stringify({
  '@context':'https://schema.org','@type':'Article',
  headline: p.title, description: p.metaDesc, image: p.heroImage,
  datePublished: new Date().toISOString().split('T')[0],
  author:    { '@type':'Organization', name:'indéva studio', url:'https://www.indevastudio.com' },
  publisher: { '@type':'Organization', name:'indéva studio',
    logo:{ '@type':'ImageObject', url:'https://www.indevastudio.com/og-default.jpg' } },
  mainEntityOfPage:{ '@type':'WebPage', '@id':`https://www.indevastudio.com/insights/${p.slug}` }
});

const faqSchema = (faqs=[]) => !faqs?.length ? '' : JSON.stringify({
  '@context':'https://schema.org','@type':'FAQPage',
  mainEntity: faqs.map(f=>({ '@type':'Question', name:f.q,
    acceptedAnswer:{ '@type':'Answer', text:f.a } }))
});

// ── HTML TEMPLATE ─────────────────────────────────────────────────
const html = (p) => {
  const title  = p.metaTitle || `${p.title} — indéva studio`;
  const canon  = `https://www.indevastudio.com/insights/${p.slug}`;
  const faqSch = faqSchema(p.faqs);
  const yr     = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${esc(title)}</title>
<meta name="description" content="${esc(p.metaDesc)}"/>
<meta name="robots" content="index,follow"/>
<link rel="canonical" href="${canon}/"/>
<meta property="og:type"        content="article"/>
<meta property="og:url"         content="${canon}/"/>
<meta property="og:title"       content="${esc(title)}"/>
<meta property="og:description" content="${esc(p.metaDesc)}"/>
<meta property="og:image"       content="${esc(p.heroImage)}"/>
<meta property="og:locale"      content="en_IN"/>
<meta property="og:site_name"   content="indéva studio"/>
<meta name="twitter:card"        content="summary_large_image"/>
<meta name="twitter:title"       content="${esc(title)}"/>
<meta name="twitter:description" content="${esc(p.metaDesc)}"/>
<meta name="twitter:image"       content="${esc(p.heroImage)}"/>
<meta name="geo.region"   content="IN-DL"/>
<meta name="geo.position" content="28.6139;77.2090"/>
<meta name="ICBM"         content="28.6139,77.2090"/>
${p.city?`<meta name="geo.placename" content="${esc(p.city)},India"/>`:''}
<script type="application/ld+json">${articleSchema(p)}</script>
${faqSch?`<script type="application/ld+json">${faqSch}</script>`:''}
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
:root{--bg:#0E0E0E;--surface:#161412;--cream:#F0EBE1;--muted:#7A7570;--border:rgba(255,255,255,.07);--bronze:#A07850;--bronze-lt:#C4966A;--max:720px}
body{background:var(--bg);color:var(--cream);font-family:'Jost',sans-serif;font-weight:300;line-height:1.75;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;width:100%;height:auto}
nav{position:sticky;top:0;z-index:100;background:rgba(14,14,14,.93);backdrop-filter:blur(12px);border-bottom:1px solid var(--border);padding:0 32px;display:flex;align-items:center;justify-content:space-between;height:60px}
.nav-logo{font-family:'Cormorant Garamond',serif;font-size:16px;font-weight:400;letter-spacing:3px;text-transform:lowercase;color:var(--cream)}
.nav-logo span{display:block;font-size:9px;letter-spacing:2px;color:var(--muted);margin-top:1px;font-family:'Jost',sans-serif}
.nav-links{display:flex;gap:28px;list-style:none}
.nav-links a{font-size:11px;letter-spacing:2px;text-transform:lowercase;color:var(--muted);transition:color .2s}
.nav-links a:hover{color:var(--cream)}
.nav-cta{font-size:10px;letter-spacing:2px;text-transform:lowercase;color:var(--bronze);border:1px solid rgba(160,120,80,.4);padding:7px 16px;transition:all .2s}
.nav-cta:hover{background:var(--bronze);color:var(--bg)}
@media(max-width:680px){.nav-links{display:none};nav{padding:0 16px}}
.breadcrumb{max-width:var(--max);margin:40px auto 0;padding:0 24px;display:flex;align-items:center;gap:10px;font-size:11px;letter-spacing:2px;text-transform:lowercase;color:var(--muted)}
.breadcrumb a{color:var(--bronze)}.breadcrumb .sep{opacity:.3}
.article-header{max-width:var(--max);margin:32px auto 0;padding:0 24px}
.article-category{display:inline-block;font-size:9px;font-weight:500;letter-spacing:3px;text-transform:uppercase;color:var(--bronze);border:1px solid rgba(160,120,80,.3);padding:4px 12px;margin-bottom:20px}
.article-header h1{font-family:'Cormorant Garamond',serif;font-size:clamp(26px,5vw,46px);font-weight:300;line-height:1.1;color:var(--cream);margin-bottom:20px}
.article-meta{font-size:11px;color:var(--muted);letter-spacing:1px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;padding-bottom:24px;border-bottom:1px solid var(--border)}
.article-meta .dot{opacity:.3}
.hero{max-width:900px;margin:0 auto;padding:32px 24px 0}
.hero img{width:100%;aspect-ratio:16/9;object-fit:cover}
.hero-credit{font-size:10px;color:var(--muted);margin-top:8px;text-align:right}
.hero-credit a{color:var(--muted);text-decoration:underline}
.article-body{max-width:var(--max);margin:48px auto 0;padding:0 24px}
.intro{font-size:17px;line-height:1.8;color:rgba(240,235,225,.85);border-left:2px solid var(--bronze);padding-left:20px;margin-bottom:48px;font-family:'Cormorant Garamond',serif;font-weight:300}
.article-body h2{font-family:'Cormorant Garamond',serif;font-size:clamp(22px,3.5vw,32px);font-weight:400;line-height:1.2;color:var(--cream);margin:48px 0 16px}
.article-body h3{font-size:13px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:var(--bronze-lt);margin:32px 0 12px}
.article-body p{font-size:14px;color:rgba(240,235,225,.8);margin-bottom:20px;line-height:1.85}
.article-body strong{color:var(--cream);font-weight:500}
.article-body a{color:var(--bronze-lt);border-bottom:1px solid rgba(196,150,106,.3)}
.article-body a:hover{border-color:var(--bronze-lt)}
.article-body blockquote{border-left:2px solid var(--bronze);margin:32px 0;padding:20px 24px;background:rgba(160,120,80,.08)}
.article-body blockquote p{font-family:'Cormorant Garamond',serif;font-size:18px;font-style:italic;color:var(--cream);margin:0;line-height:1.6}
.article-body ul{list-style:none;margin:20px 0 28px;display:flex;flex-direction:column;gap:10px}
.article-body ul li{font-size:14px;color:rgba(240,235,225,.8);display:flex;align-items:flex-start;gap:12px;line-height:1.7}
.article-body ul li::before{content:'◆';color:var(--bronze);font-size:7px;margin-top:8px;flex-shrink:0}
.callout{background:linear-gradient(135deg,rgba(160,120,80,.12),rgba(160,120,80,.04));border:1px solid rgba(160,120,80,.25);padding:24px 28px;margin:32px 0}
.callout p{font-size:13px!important;color:var(--cream)!important;margin:0!important}
.ornament{display:flex;align-items:center;gap:16px;margin:56px 0}
.ornament-line{flex:1;height:1px;background:var(--border)}
.ornament-gem{color:var(--bronze);font-size:9px}
.faq-section{max-width:var(--max);margin:64px auto 0;padding:0 24px}
.faq-section h2{font-family:'Cormorant Garamond',serif;font-size:32px;font-weight:300;color:var(--cream);margin-bottom:32px}
details{border-top:1px solid var(--border);padding:20px 0}
details:last-child{border-bottom:1px solid var(--border)}
summary{font-size:14px;font-weight:500;color:var(--cream);cursor:pointer;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:16px}
summary::-webkit-details-marker{display:none}
summary::after{content:'+';color:var(--bronze);font-size:20px;font-weight:300;flex-shrink:0;transition:transform .2s}
details[open] summary::after{transform:rotate(45deg)}
details p{font-size:13px;color:var(--muted);margin-top:14px;line-height:1.8}
.cta-section{max-width:var(--max);margin:80px auto;padding:48px 40px;border:1px solid rgba(160,120,80,.2);background:linear-gradient(135deg,rgba(160,120,80,.08),transparent);text-align:center}
.cta-label{font-size:10px;letter-spacing:4px;text-transform:uppercase;color:var(--bronze);display:block;margin-bottom:16px}
.cta-section h3{font-family:'Cormorant Garamond',serif;font-size:clamp(24px,4vw,36px);font-weight:300;color:var(--cream);margin-bottom:12px;line-height:1.2}
.cta-section p{font-size:13px;color:var(--muted);margin-bottom:28px}
.cta-buttons{display:flex;gap:12px;justify-content:center;flex-wrap:wrap}
.btn-primary{display:inline-block;padding:13px 32px;font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;background:var(--bronze);color:var(--bg);transition:opacity .2s}
.btn-primary:hover{opacity:.85}
.btn-secondary{display:inline-block;padding:13px 32px;font-size:10px;font-weight:500;letter-spacing:2.5px;text-transform:uppercase;border:1px solid rgba(160,120,80,.4);color:var(--bronze);transition:all .2s}
.btn-secondary:hover{background:rgba(160,120,80,.1)}
footer{border-top:1px solid var(--border);padding:48px 32px;text-align:center;background:var(--surface)}
.footer-logo{font-family:'Cormorant Garamond',serif;font-size:20px;letter-spacing:4px;color:var(--cream);margin-bottom:4px}
.footer-tag{font-size:10px;letter-spacing:3px;text-transform:lowercase;color:var(--muted);margin-bottom:24px}
.footer-links{display:flex;gap:24px;justify-content:center;flex-wrap:wrap;font-size:11px;color:var(--muted)}
.footer-links a:hover{color:var(--cream)}
.footer-copy{margin-top:24px;font-size:10px;color:rgba(122,117,112,.4)}
.wa-float{position:fixed;bottom:24px;right:24px;z-index:999;display:flex;align-items:center;gap:10px;background:#25D366;color:#fff;padding:12px 18px;font-size:12px;font-weight:500;box-shadow:0 4px 20px rgba(37,211,102,.3);transition:transform .2s;text-decoration:none}
.wa-float:hover{transform:translateY(-2px);color:#fff}
.wa-float svg{width:18px;height:18px;fill:#fff;flex-shrink:0}
@media(max-width:600px){.hero,.article-header,.article-body,.faq-section,.breadcrumb{padding-left:16px;padding-right:16px}.cta-section{padding:36px 20px;margin-left:16px;margin-right:16px}}
</style>
</head>
<body>

<nav>
  <a href="https://www.indevastudio.com/" class="nav-logo">indéva studio<span>luxury interior design · new delhi</span></a>
  <ul class="nav-links">
    <li><a href="https://www.indevastudio.com/">home</a></li>
    <li><a href="https://www.indevastudio.com/#about">about</a></li>
    <li><a href="https://www.indevastudio.com/#services">services</a></li>
    <li><a href="https://www.indevastudio.com/#projects">projects</a></li>
    <li><a href="https://www.indevastudio.com/insights/">insights</a></li>
  </ul>
  <a href="https://www.indevastudio.com/#contact" class="nav-cta">start a project</a>
</nav>

<div class="breadcrumb">
  <a href="https://www.indevastudio.com/insights/">← back to insights</a>
  <span class="sep">·</span><span>${esc(p.category)}</span>
  <span class="sep">·</span><span>${esc(p.readTime)}</span>
</div>

<header class="article-header">
  <span class="article-category">${esc(p.category)}</span>
  <h1>${esc(p.title)}</h1>
  <div class="article-meta">
    <span>${esc(p.date)}</span><span class="dot">·</span>
    <span>${esc(p.readTime)}</span><span class="dot">·</span>
    <span>indéva studio</span>
    ${p.city?`<span class="dot">·</span><span>${esc(p.city)}</span>`:''}
  </div>
</header>

<div class="hero">
  <img src="${esc(p.heroImage)}" alt="${esc(p.heroAlt)}" loading="eager" fetchpriority="high"/>
  ${p.heroCredit?`<p class="hero-credit">photo by <a href="${esc(p.heroCredit.url)}?utm_source=indeva_studio&utm_medium=referral" target="_blank" rel="noopener">${esc(p.heroCredit.name)}</a> on <a href="https://unsplash.com/?utm_source=indeva_studio&utm_medium=referral" target="_blank" rel="noopener">unsplash</a></p>`:''}
</div>

<article class="article-body">
  <p class="intro">${inline(p.intro)}</p>
  ${p.sections.map(section).join('\n  ')}
  <div class="ornament"><div class="ornament-line"></div><span class="ornament-gem">◆</span><div class="ornament-line"></div></div>
</article>

${p.faqs?.length?`
<section class="faq-section">
  <h2>frequently asked questions</h2>
  ${p.faqs.map(f=>`<details><summary>${esc(f.q)}</summary><p>${inline(f.a)}</p></details>`).join('')}
</section>`:''}

<div class="cta-section">
  <span class="cta-label">indéva studio</span>
  <h3>ready to transform<br>your space?</h3>
  <p>our design consultants are available for a complimentary discovery session.</p>
  <div class="cta-buttons">
    <a href="https://www.indevastudio.com/#contact" class="btn-primary">start a project ↗</a>
    <a href="https://wa.me/919717881083?text=Hi%2C%20I%27d%20like%20to%20discuss%20a%20project" class="btn-secondary" target="_blank" rel="noopener">whatsapp us</a>
  </div>
</div>

<footer>
  <div class="footer-logo">indéva studio</div>
  <p class="footer-tag">luxury interior design · new delhi, india</p>
  <div class="footer-links">
    <a href="https://www.indevastudio.com/">home</a>
    <a href="https://www.indevastudio.com/insights/">insights</a>
    <a href="https://www.indevastudio.com/#projects">projects</a>
    <a href="https://www.indevastudio.com/#contact">contact</a>
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
};

// ── MAIN ──────────────────────────────────────────────────────────
async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  let posts = blogs.filter(b => {
    if (!b.title || !b.slug || !b.sections) return false;
    if (FORCE) return true;
    return !fs.existsSync(path.join(OUT_DIR, `${b.slug}.html`));
  });

  if (TARGET) {
    posts = posts.filter(b => b.slug === TARGET);
    if (!posts.length) {
      console.error(`\n❌  Slug "${TARGET}" not found or already deployed. Use --force to regenerate.\n`);
      process.exit(1);
    }
  }

  if (!posts.length) {
    console.log('\n✅  Nothing new to generate. Use --force to regenerate all.\n');
    return;
  }

  console.log(`\n📄  Generating ${posts.length} post(s) → insights/\n`);
  let ok = 0, fail = 0;
  const generated = [];

  for (const p of posts) {
    try {
      const out = path.join(OUT_DIR, `${p.slug}.html`);
      fs.writeFileSync(out, html(p), 'utf8');
      console.log(`  ✓  insights/${p.slug}.html`);
      generated.push(p.slug);
      ok++;
    } catch(e) {
      console.error(`  ✗  ${p.slug}  →  ${e.message}`);
      fail++;
    }
  }

  console.log(`\n${'─'.repeat(50)}`);
  console.log(`  Generated: ${ok}  |  Failed: ${fail}`);
  if (fail) { process.exit(1); }

  fs.writeFileSync(path.join(REPO_ROOT, '.generated-slugs.json'), JSON.stringify(generated), 'utf8');
  console.log(`\n  ✅  Done. Commit insights/ and push to deploy.\n`);
}

main().catch(e => { console.error(e); process.exit(1); });
