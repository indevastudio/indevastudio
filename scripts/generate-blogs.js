/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE
 * - Generates blogs inside /insights/ folder
 * - Injects cards into /insights/index.html automatically
 * - Matches existing insights card design exactly
 * - Uses Google Gemini API (FREE)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ─────────────────────────────────────────────
// KEYWORD POOL
// ─────────────────────────────────────────────
const KEYWORD_POOL = {
  interior_design: [
    "interior design cost in Delhi 2025",
    "luxury interior designers in Delhi NCR",
    "modular interior design ideas for Indian homes",
    "contemporary interior design trends India",
    "interior design services price list India",
    "full home interior design cost Gurgaon",
    "best interior designers near me Delhi",
    "affordable luxury interior design India",
  ],
  modular_kitchen: [
    "modular kitchen design ideas for Indian homes",
    "modular kitchen cost in Delhi 2025",
    "L-shaped modular kitchen design small space",
    "parallel kitchen design ideas India",
    "modular kitchen materials comparison India",
    "open kitchen design ideas Indian homes",
    "modular kitchen with island design India",
    "best modular kitchen brands India price",
  ],
  living_room: [
    "modern living room design ideas India 2025",
    "luxury living room interior design Delhi",
    "small living room design ideas Indian apartment",
    "living room TV unit design ideas India",
    "living room color combinations Indian homes",
    "false ceiling design for living room India",
    "sofa set design ideas for Indian living room",
    "living room interior cost estimate Delhi",
  ],
  bedroom: [
    "master bedroom interior design ideas India",
    "bedroom design cost in Delhi NCR",
    "luxury bedroom design ideas Indian homes",
    "small bedroom storage ideas India",
    "kids bedroom design ideas India",
    "wardrobe design ideas for bedroom India",
    "bedroom false ceiling design ideas",
    "couple bedroom interior design ideas",
  ],
  home_salon: [
    "home salon interior design ideas India",
    "beauty parlour interior design small space",
    "home salon setup cost India 2025",
    "salon interior design ideas for small rooms",
    "home beauty studio design ideas India",
    "nail salon interior design ideas India",
    "home parlour furniture ideas India",
    "budget home salon design India",
  ],
  local_seo: [
    "interior designer in Gurgaon for home",
    "interior design company Noida residential",
    "best interior designer Dehradun homes",
    "interior design services Delhi NCR reviews",
    "interior designer Udaipur luxury villas",
    "top interior designers Delhi farmhouse",
    "home renovation interior design Delhi",
    "flat interior design Delhi cost per sqft",
  ],
};

const CATEGORY_MAP = {
  interior_design: "design intelligence",
  modular_kitchen: "kitchen design",
  living_room: "spatial logic",
  bedroom: "bedroom design",
  home_salon: "residential design",
  local_seo: "india market",
};

const INTERNAL_LINKS = [
  { text: "our portfolio", url: "/#projects" },
  { text: "our services", url: "/#services" },
  { text: "contact us for a free consultation", url: "/#contact" },
  { text: "our design process", url: "/#about" },
  { text: "get in touch with our designers", url: "/#contact" },
];

const EXTERNAL_LINKS = [
  { text: "architectural digest india", url: "https://www.architecturaldigest.in" },
  { text: "elle decor india", url: "https://www.elledecor.com/in" },
  { text: "indian green building council", url: "https://igbc.in" },
  { text: "national institute of design", url: "https://www.nid.edu" },
  { text: "houzz india", url: "https://www.houzz.in" },
];

// Reliable Unsplash images — same pool your existing insights use
const IMAGE_POOL = [
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80",
  "https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80",
  "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80",
  "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80",
  "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&q=80",
  "https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80",
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200&q=80",
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80",
  "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80",
  "https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200&q=80",
];

function getImageUrl(slug) {
  const index = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % IMAGE_POOL.length;
  return IMAGE_POOL[index];
}

// ─────────────────────────────────────────────
// KEYWORD SELECTOR
// ─────────────────────────────────────────────
function selectDailyKeywords() {
  const categories = Object.keys(KEYWORD_POOL);
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
  const selected = [];
  const shuffled = [...categories].sort(() => (dayOfYear % 2 === 0 ? 1 : -1));
  for (let i = 0; i < 4; i++) {
    const category = shuffled[i % shuffled.length];
    const pool = KEYWORD_POOL[category];
    const keyword = pool[(dayOfYear + i * 3) % pool.length];
    if (!selected.find(s => s.keyword === keyword)) {
      selected.push({ keyword, category });
    }
  }
  console.log("📌 Today's keywords:", selected.map(s => s.keyword));
  return selected;
}

function toSlug(keyword) {
  return keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

// ─────────────────────────────────────────────
// BLOG GENERATOR — GEMINI API
// ─────────────────────────────────────────────
async function generateBlog(keyword) {
  const internalLink1 = INTERNAL_LINKS[Math.floor(Math.random() * 3)];
  const internalLink2 = INTERNAL_LINKS[3 + Math.floor(Math.random() * 2)];
  const externalLink1 = EXTERNAL_LINKS[Math.floor(Math.random() * EXTERNAL_LINKS.length)];

  const prompt = `You are a senior content writer for indéva studio — a premium luxury interior design firm in Delhi NCR, India.

Write a complete SEO-optimized blog article for keyword: "${keyword}"

BRAND VOICE:
- Brand name always lowercase: indéva studio
- Authoritative, intelligent, warm
- No clichés: no "dive into", "delve", "certainly", "absolutely"
- Grade 7-8 readability
- Indian context: use ₹ for prices, reference Indian cities

OUTPUT — respond with EXACTLY this structure:
SEO_TITLE: [60-65 chars, keyword-first, compelling]
META_DESC: [under 155 chars, include keyword]
SLUG: [hyphenated-slug-only]
CATEGORY: [one of: spatial logic / design intelligence / india market / kitchen design / bedroom design / residential design / materials / philosophy / process]
EXCERPT: [2 sentences max, used as card preview — no HTML]
---ARTICLE---
[Pure HTML article body. Do NOT include DOCTYPE, html, head, or body tags.
Start directly with <h1>.
Include:
- <h1> with keyword
- Opening paragraph (hook, problem statement)  
- 4-5 <h2> sections with <h3> subsections
- <ul> or <ol> lists
- Cost estimates in ₹ where relevant
- This link naturally: <a href="${internalLink1.url}">${internalLink1.text}</a>
- This link naturally: <a href="${internalLink2.url}">${internalLink2.text}</a>
- This external link: <a href="${externalLink1.url}" rel="noopener noreferrer" target="_blank">${externalLink1.text}</a>
- A <blockquote> with a key insight
- FAQ: 4 questions with <details><summary> tags
- Final CTA paragraph with <a href="/#contact">start a project</a>
Target: 1400-1800 words. No markdown. No code fences.]
---END---`;

  console.log(`  ✍️  Generating: "${keyword}"`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.75, maxOutputTokens: 4000 },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(`Gemini error: ${JSON.stringify(data)}`);
  if (!data.candidates?.[0]) throw new Error("No response from Gemini");
  return data.candidates[0].content.parts[0].text;
}

// ─────────────────────────────────────────────
// PARSE RESPONSE
// ─────────────────────────────────────────────
function parseBlogResponse(raw, keyword, category) {
  const titleMatch = raw.match(/SEO_TITLE:\s*(.+)/);
  const metaMatch = raw.match(/META_DESC:\s*(.+)/);
  const slugMatch = raw.match(/SLUG:\s*(.+)/);
  const catMatch = raw.match(/CATEGORY:\s*(.+)/);
  const excerptMatch = raw.match(/EXCERPT:\s*(.+)/);
  const articleMatch = raw.match(/---ARTICLE---([\s\S]+?)---END---/);

  return {
    title: titleMatch ? titleMatch[1].trim() : keyword,
    meta: metaMatch ? metaMatch[1].trim() : "",
    slug: slugMatch ? slugMatch[1].trim() : toSlug(keyword),
    cat: catMatch ? catMatch[1].trim() : (CATEGORY_MAP[category] || "design intelligence"),
    excerpt: excerptMatch ? excerptMatch[1].trim() : (metaMatch ? metaMatch[1].trim() : ""),
    article: articleMatch ? articleMatch[1].trim() : raw,
  };
}

// ─────────────────────────────────────────────
// BUILD INDIVIDUAL INSIGHT PAGE
// Matches your existing /insights/floorplans structure exactly
// ─────────────────────────────────────────────
function buildInsightPage(blogData) {
  const date = new Date().toISOString().split("T")[0];
  const imageUrl = getImageUrl(blogData.slug);
  const monthYear = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }).toLowerCase();
  const wordCount = blogData.article.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blogData.title,
    description: blogData.meta,
    image: imageUrl,
    datePublished: date,
    author: { "@type": "Organization", name: "indéva studio", url: "https://indevastudio.com" },
    publisher: { "@type": "Organization", name: "indéva studio" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://indevastudio.com/insights/${blogData.slug}/` },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${blogData.title.toLowerCase()} — indéva studio</title>
<meta name="description" content="${blogData.meta}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://indevastudio.com/insights/${blogData.slug}/">
<meta property="og:title" content="${blogData.title} — indéva studio">
<meta property="og:description" content="${blogData.meta}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:url" content="https://indevastudio.com/insights/${blogData.slug}/">
<meta property="og:type" content="article">
<script type="application/ld+json">${schema}</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Founders+Grotesk:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
:root{--black:#0a0a0a;--black-2:#111111;--black-3:#181818;--gold:#b89a6a;--gold-dim:#8a7250;--gold-bright:#c9ac7e;--white:#f0ebe3;--white-dim:rgba(240,235,227,0.55);--white-muted:rgba(240,235,227,0.28);--serif:'Cormorant Garamond',Georgia,serif;--sans:'Founders Grotesk',sans-serif;--mono:'DM Mono',monospace;--line:rgba(240,235,227,0.08);--line-gold:rgba(184,154,106,0.2);}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--black);color:var(--white);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased;}
nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:72px;background:var(--black);border-bottom:1px solid var(--line);}
.nav-logo{font-family:var(--serif);font-size:1.45rem;font-weight:400;letter-spacing:0.04em;color:var(--white);text-decoration:none;line-height:1;}
.nav-logo sub{font-family:var(--mono);font-size:0.5rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);display:block;margin-top:2px;}
.nav-center{display:flex;gap:36px;}
.nav-link{font-family:var(--mono);font-size:0.62rem;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.25s;}
.nav-link:hover{color:var(--white);}.nav-link.active{color:var(--gold);}
.nav-cta{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);border:1px solid var(--line-gold);padding:10px 22px;text-decoration:none;transition:all 0.25s;}
.nav-cta:hover{background:var(--gold);color:var(--black);border-color:var(--gold);}
.article-nav{position:fixed;top:72px;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:44px;background:var(--black);border-bottom:1px solid var(--line);}
.article-nav a{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.2s;}
.article-nav a:hover{color:var(--gold);}
.article-nav span{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--white-muted);}
.article-header{padding:148px 60px 48px;max-width:960px;}
.article-cat{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:20px;display:block;}
.article-title{font-family:var(--serif);font-size:clamp(2rem,4.5vw,4.5rem);font-weight:300;line-height:1.05;letter-spacing:-0.02em;color:var(--white);margin-bottom:32px;}
.article-meta{display:flex;gap:20px;align-items:center;font-family:var(--mono);font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);padding-bottom:48px;border-bottom:1px solid var(--line);}
.article-image{padding:0 60px;margin-bottom:0;}
.article-image img{width:100%;max-height:560px;object-fit:cover;display:block;filter:brightness(0.8) saturate(0.85);}
.article-body{max-width:720px;padding:64px 60px 120px;}
.article-body h1{font-family:var(--serif);font-size:clamp(1.6rem,3vw,2.4rem);font-weight:300;color:var(--white);line-height:1.2;margin-bottom:2rem;font-style:italic;}
.article-body h2{font-family:var(--serif);font-size:clamp(1.3rem,2vw,1.9rem);font-weight:300;color:var(--white);line-height:1.2;margin:3.5rem 0 1.25rem;}
.article-body h3{font-family:var(--serif);font-size:1.15rem;font-weight:400;color:var(--gold-bright);margin:2.5rem 0 1rem;font-style:italic;}
.article-body p{font-family:var(--sans);font-size:0.95rem;line-height:1.9;color:var(--white-dim);margin-bottom:1.5rem;}
.article-body p:first-of-type{font-family:var(--serif);font-size:1.15rem;line-height:1.75;color:var(--white);font-style:italic;padding-left:1.5rem;border-left:2px solid var(--gold);margin-bottom:2.5rem;}
.article-body ul,.article-body ol{margin:1rem 0 2rem 1.5rem;}
.article-body li{font-family:var(--sans);font-size:0.92rem;line-height:1.8;color:var(--white-dim);margin-bottom:0.5rem;}
.article-body ul li::marker{color:var(--gold);}
.article-body ol li::marker{color:var(--gold);font-family:var(--mono);font-size:0.8rem;}
.article-body a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);transition:border-color 0.2s;}
.article-body a:hover{border-color:var(--gold);}
.article-body blockquote{border-left:2px solid var(--gold);margin:2.5rem 0;padding:1.5rem 2rem;background:var(--black-2);}
.article-body blockquote p{font-family:var(--serif);font-size:1.1rem;color:var(--white);font-style:italic;line-height:1.65;border:none;padding:0;margin:0;}
.article-body strong{color:var(--white);font-weight:500;}
.article-body details{border:1px solid var(--line);margin-bottom:8px;background:var(--black-2);}
.article-body summary{padding:1.1rem 1.5rem;cursor:pointer;font-family:var(--sans);font-size:0.88rem;font-weight:400;color:var(--white);list-style:none;display:flex;justify-content:space-between;align-items:center;}
.article-body summary::-webkit-details-marker{display:none;}
.article-body summary::after{content:'+';font-family:var(--mono);color:var(--gold);}
.article-body details[open] summary{border-bottom:1px solid var(--line);}
.article-body details[open] summary::after{content:'−';}
.article-body details p{padding:1.25rem 1.5rem;margin:0;color:var(--white-dim);font-size:0.88rem;line-height:1.8;border:none;}
.article-cta{margin:0 60px 80px;padding:60px;background:var(--black-2);border:1px solid var(--line-gold);text-align:center;}
.article-cta-label{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold-dim);display:block;margin-bottom:16px;}
.article-cta h2{font-family:var(--serif);font-size:clamp(1.6rem,3vw,2.8rem);font-weight:300;color:var(--white);margin-bottom:12px;line-height:1.2;}
.article-cta p{font-family:var(--sans);font-size:0.85rem;color:var(--white-dim);margin-bottom:32px;line-height:1.7;}
.article-cta a{font-family:var(--mono);font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);border:1px solid var(--line-gold);padding:14px 32px;text-decoration:none;display:inline-block;transition:all 0.25s;}
.article-cta a:hover{background:var(--gold);color:var(--black);border-color:var(--gold);}
footer{background:var(--black-2);border-top:1px solid var(--line);padding:60px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px;}
.footer-logo{font-family:var(--serif);font-size:1.2rem;color:var(--white);text-decoration:none;}
.footer-note{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);}
@media(max-width:768px){nav{padding:0 24px;}.nav-center{display:none;}.article-nav{padding:0 24px;}.article-header{padding:130px 24px 40px;}.article-image{padding:0 24px;}.article-body{padding:40px 24px 80px;}.article-cta{margin:0 24px 60px;padding:40px 24px;}footer{padding:40px 24px;}}
</style>
</head>
<body>
<nav>
  <a class="nav-logo" href="/">indéva studio<sub>luxury interior design · new delhi</sub></a>
  <div class="nav-center">
    <a class="nav-link" href="/">home</a>
    <a class="nav-link" href="/#about">about</a>
    <a class="nav-link" href="/#services">services</a>
    <a class="nav-link" href="/#projects">projects</a>
    <a class="nav-link active" href="/insights/">insights</a>
  </div>
  <a class="nav-cta" href="/#contact">start a project</a>
</nav>
<div class="article-nav">
  <a href="/insights/">← back to insights</a>
  <span>${blogData.cat} · ${readTime} min read</span>
</div>
<header class="article-header">
  <span class="article-cat">${blogData.cat}</span>
  <h1 class="article-title">${blogData.title.toLowerCase()}</h1>
  <div class="article-meta">
    <span>${monthYear}</span>
    <span>·</span>
    <span>${readTime} min read</span>
    <span>·</span>
    <span>indéva studio</span>
  </div>
</header>
<div class="article-image">
  <img src="${imageUrl}" alt="${blogData.title}" loading="eager" width="1200" height="675">
</div>
<main class="article-body">
${blogData.article}
</main>
<div class="article-cta">
  <span class="article-cta-label">indéva studio · new delhi</span>
  <h2>ready to transform your space?</h2>
  <p>our design consultants are available for a complimentary discovery session. tell us about your project.</p>
  <a href="/#contact">start a project ↗</a>
</div>
<footer>
  <a class="footer-logo" href="/">indéva studio</a>
  <span class="footer-note">luxury interior design · new delhi, india</span>
  <span class="footer-note">© ${new Date().getFullYear()} indéva studio</span>
</footer>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// INJECT CARDS INTO /insights/index.html
// Adds new blog cards at the TOP of the existing grid
// ─────────────────────────────────────────────
function injectCardsIntoInsightsPage(newBlogs) {
  const insightsIndexPath = path.join(REPO_ROOT, "insights", "index.html");

  if (!fs.existsSync(insightsIndexPath)) {
    console.log("⚠️  insights/index.html not found — skipping injection");
    return;
  }

  let html = fs.readFileSync(insightsIndexPath, "utf8");

  // Build new cards in your exact existing card format
  const newCards = newBlogs.map(blog => {
    const imageUrl = getImageUrl(blog.slug);
    return `
    <a class="blog-card" href="/insights/${blog.slug}/">
      <img src="${imageUrl}" alt="${blog.title.toLowerCase()}" class="blog-card-image">
      <div class="blog-card-cat">${blog.cat}</div>
      <h2 class="blog-card-title">${blog.title.toLowerCase()}</h2>
      <p class="blog-card-excerpt">${blog.excerpt}</p>
      <div class="blog-card-read">read article ↗</div>
    </a>`;
  }).join("\n");

  // Check if these slugs already exist and skip duplicates
  const filteredCards = newBlogs.map(blog => {
    if (html.includes(`/insights/${blog.slug}/`)) {
      console.log(`  ⏭️  Already in insights: ${blog.slug}`);
      return null;
    }
    const imageUrl = getImageUrl(blog.slug);
    return `
    <a class="blog-card" href="/insights/${blog.slug}/">
      <img src="${imageUrl}" alt="${blog.title.toLowerCase()}" class="blog-card-image">
      <div class="blog-card-cat">${blog.cat}</div>
      <h2 class="blog-card-title">${blog.title.toLowerCase()}</h2>
      <p class="blog-card-excerpt">${blog.excerpt}</p>
      <div class="blog-card-read">read article ↗</div>
    </a>`;
  }).filter(Boolean).join("\n");

  if (!filteredCards) {
    console.log("  ℹ️  All blogs already in insights page");
    return;
  }

  // Inject after the opening <div class="blog-grid"> tag
  const gridOpenTag = '<div class="blog-grid">';
  if (html.includes(gridOpenTag)) {
    html = html.replace(gridOpenTag, `${gridOpenTag}\n${filteredCards}`);
    fs.writeFileSync(insightsIndexPath, html);
    console.log(`✅ Injected ${newBlogs.length} new cards into insights/index.html`);
  } else {
    console.log("⚠️  Could not find blog-grid div in insights/index.html");
  }
}

// ─────────────────────────────────────────────
// UPDATE SITEMAP
// ─────────────────────────────────────────────
function updateSitemap(newBlogs) {
  const sitemapPath = path.join(REPO_ROOT, "sitemap.xml");
  if (!fs.existsSync(sitemapPath)) return;

  let sitemap = fs.readFileSync(sitemapPath, "utf8");
  const today = new Date().toISOString().split("T")[0];

  const newEntries = newBlogs
    .filter(blog => !sitemap.includes(`/insights/${blog.slug}/`))
    .map(blog => `
  <url>
    <loc>https://indevastudio.com/insights/${blog.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");

  if (newEntries) {
    sitemap = sitemap.replace("</urlset>", `${newEntries}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemap);
    console.log("🗺️  Sitemap updated with new insight URLs");
  }
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("\n🌟 INDEVA STUDIO — BLOG ENGINE");
  console.log("━".repeat(50));
  console.log(`📅 Date: ${new Date().toLocaleDateString("en-IN")}`);

  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not set.");
    process.exit(1);
  }

  // Ensure insights folder exists
  const insightsDir = path.join(REPO_ROOT, "insights");
  if (!fs.existsSync(insightsDir)) {
    fs.mkdirSync(insightsDir, { recursive: true });
  }

  const selections = selectDailyKeywords();
  const publishedBlogs = [];

  for (let i = 0; i < selections.length; i++) {
    const { keyword, category } = selections[i];
    console.log(`\n[${i + 1}/4] "${keyword}"`);
    try {
      const raw = await generateBlog(keyword);
      const blogData = parseBlogResponse(raw, keyword, category);
      blogData.keyword = keyword;

      // Save as /insights/[slug]/index.html for clean URLs
      const slugDir = path.join(insightsDir, blogData.slug);
      if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });

      const html = buildInsightPage(blogData);
      fs.writeFileSync(path.join(slugDir, "index.html"), html);

      console.log(`  ✅ Saved: insights/${blogData.slug}/index.html`);
      publishedBlogs.push(blogData);

      if (i < selections.length - 1) await new Promise(r => setTimeout(r, 2000));
    } catch (err) {
      console.error(`  ❌ Failed: ${err.message}`);
    }
  }

  if (publishedBlogs.length > 0) {
    injectCardsIntoInsightsPage(publishedBlogs);
    updateSitemap(publishedBlogs);
  }

  console.log(`\n🎉 DONE! Published: ${publishedBlogs.length} insights`);
  console.log("━".repeat(50));
}

main().catch(console.error);

