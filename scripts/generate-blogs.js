/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE
 * Uses Google Gemini API (FREE — 1000 requests/day)
 * Design matches indevastudio.com/insights/ exactly
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

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

const INTERNAL_LINKS = [
  { text: "our portfolio", url: "/#projects" },
  { text: "our services", url: "/#services" },
  { text: "contact us for a free consultation", url: "/#contact" },
  { text: "our design projects", url: "/#projects" },
  { text: "get in touch with our designers", url: "/#contact" },
];

const EXTERNAL_LINKS = [
  { text: "architectural digest", url: "https://www.architecturaldigest.in" },
  { text: "elle decor india", url: "https://www.elledecor.com/in" },
  { text: "indian green building council", url: "https://igbc.in" },
  { text: "national institute of design", url: "https://www.nid.edu" },
  { text: "houzz india", url: "https://www.houzz.in" },
];

// Category labels matching your insights page style
const CATEGORY_MAP = {
  interior_design: "design intelligence",
  modular_kitchen: "kitchen design",
  living_room: "spatial logic",
  bedroom: "bedroom design",
  home_salon: "residential design",
  local_seo: "india market",
};

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
    if (!selected.includes(keyword)) selected.push({ keyword, category });
  }
  console.log("📌 Today's keywords:", selected.map(s => s.keyword));
  return selected;
}

function toSlug(keyword) {
  return keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

async function generateBlog(keyword) {
  const internalLink1 = INTERNAL_LINKS[Math.floor(Math.random() * 3)];
  const internalLink2 = INTERNAL_LINKS[3 + Math.floor(Math.random() * 2)];
  const externalLink1 = EXTERNAL_LINKS[Math.floor(Math.random() * EXTERNAL_LINKS.length)];

  const prompt = `You are a senior content writer for indéva studio — a premium luxury interior design firm in Delhi NCR, India.

Write a complete SEO-optimized blog article for the keyword: "${keyword}"

BRAND VOICE:
- Lowercase brand name: indéva studio
- Luxury, authoritative, intelligent tone
- No AI clichés: no "dive into", "delve", "certainly", "absolutely", "straightforward"
- Grade 7-8 readability
- Indian market context: use ₹ for prices, mention Indian cities

OUTPUT FORMAT — respond with this EXACT structure, nothing else:
SEO_TITLE: [60-65 chars, keyword-first]
META_DESC: [under 155 chars, include keyword]
SLUG: [hyphenated slug]
CATEGORY: [one of: spatial logic / design intelligence / india market / kitchen design / bedroom design / residential design / materials / philosophy / process]
---ARTICLE---
[Pure HTML only. Start with <h1>. Then write the article body with:
- Opening paragraph (hook, problem-aware)
- 4-5 <h2> sections
- <h3> subsections where needed
- <ul> or <ol> lists where appropriate
- Cost estimates in ₹ where relevant
- This internal link somewhere natural: <a href="${internalLink1.url}">${internalLink1.text}</a>
- This internal link somewhere natural: <a href="${internalLink2.url}">${internalLink2.text}</a>
- This external link somewhere natural: <a href="${externalLink1.url}" rel="noopener noreferrer" target="_blank">${externalLink1.text}</a>
- A <blockquote> with a key insight
- FAQ section: 4 questions using <details><summary> tags
- Final paragraph with CTA linking to <a href="/#contact">start a project</a>
Target 1400-1800 words. No markdown. No backticks.]
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
  if (!response.ok) throw new Error(`Gemini API error: ${JSON.stringify(data)}`);
  if (!data.candidates?.[0]) throw new Error(`No response from Gemini`);
  return data.candidates[0].content.parts[0].text;
}

function parseBlogResponse(raw, keyword, category) {
  const titleMatch = raw.match(/SEO_TITLE:\s*(.+)/);
  const metaMatch = raw.match(/META_DESC:\s*(.+)/);
  const slugMatch = raw.match(/SLUG:\s*(.+)/);
  const catMatch = raw.match(/CATEGORY:\s*(.+)/);
  const articleMatch = raw.match(/---ARTICLE---([\s\S]+?)---END---/);
  return {
    title: titleMatch ? titleMatch[1].trim() : keyword,
    meta: metaMatch ? metaMatch[1].trim() : "",
    slug: slugMatch ? slugMatch[1].trim() : toSlug(keyword),
    cat: catMatch ? catMatch[1].trim() : (CATEGORY_MAP[category] || "design intelligence"),
    article: articleMatch ? articleMatch[1].trim() : raw,
  };
}

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
];

function getImageUrl(slug) {
  const index = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % IMAGE_POOL.length;
  return IMAGE_POOL[index];
}

function generateSchema(title, meta, slug, date, imageUrl) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: meta,
    image: imageUrl,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: "indéva studio", url: "https://indevastudio.com" },
    publisher: { "@type": "Organization", name: "indéva studio", logo: { "@type": "ImageObject", url: "https://indevastudio.com/favicon-32x32.png" } },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://indevastudio.com/blogs/${slug}` },
  });
}

function buildHTMLPage(blogData, keyword, category) {
  const date = new Date().toISOString().split("T")[0];
  const imageUrl = getImageUrl(blogData.slug);
  const schema = generateSchema(blogData.title, blogData.meta, blogData.slug, date, imageUrl);

  // Format date like your insights pages: "april 2026"
  const monthYear = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" }).toLowerCase();

  // Estimate read time
  const wordCount = blogData.article.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${blogData.title} — indéva studio</title>
<meta name="description" content="${blogData.meta}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://indevastudio.com/blogs/${blogData.slug}">
<meta property="og:title" content="${blogData.title} — indéva studio">
<meta property="og:description" content="${blogData.meta}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:url" content="https://indevastudio.com/blogs/${blogData.slug}">
<meta property="og:type" content="article">
<script type="application/ld+json">${schema}</script>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Founders+Grotesk:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
:root{
  --black:#0a0a0a;--black-2:#111111;--black-3:#181818;
  --gold:#b89a6a;--gold-dim:#8a7250;--gold-bright:#c9ac7e;
  --white:#f0ebe3;--white-dim:rgba(240,235,227,0.55);--white-muted:rgba(240,235,227,0.28);
  --serif:'Cormorant Garamond',Georgia,serif;
  --sans:'Founders Grotesk',sans-serif;
  --mono:'DM Mono',monospace;
  --line:rgba(240,235,227,0.08);--line-gold:rgba(184,154,106,0.2);
}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
html{scroll-behavior:smooth;}
body{background:var(--black);color:var(--white);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased;}

/* NAV — exact match to your site */
nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:72px;background:var(--black);border-bottom:1px solid var(--line);}
.nav-logo{font-family:var(--serif);font-size:1.45rem;font-weight:400;letter-spacing:0.04em;color:var(--white);text-decoration:none;line-height:1;}
.nav-logo sub{font-family:var(--mono);font-size:0.5rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);display:block;margin-top:2px;}
.nav-center{display:flex;gap:36px;}
.nav-link{font-family:var(--mono);font-size:0.62rem;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.25s;}
.nav-link:hover{color:var(--white);}
.nav-link.active{color:var(--gold);}
.nav-cta{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);border:1px solid var(--line-gold);padding:10px 22px;text-decoration:none;transition:all 0.25s;}
.nav-cta:hover{background:var(--gold);color:var(--black);border-color:var(--gold);}

/* ARTICLE HEADER */
.article-header{padding:140px 60px 0;max-width:900px;margin:0 auto;}
.article-cat{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:20px;display:block;}
.article-title{font-family:var(--serif);font-size:clamp(2.2rem,4vw,4rem);font-weight:300;line-height:1.1;letter-spacing:-0.02em;color:var(--white);margin-bottom:32px;}
.article-meta{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);display:flex;gap:24px;align-items:center;padding-bottom:40px;border-bottom:1px solid var(--line);}

/* HERO IMAGE */
.article-image{max-width:900px;margin:48px auto 0;padding:0 60px;}
.article-image img{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;filter:brightness(0.8) saturate(0.85);}

/* ARTICLE BODY */
.article-body{max-width:720px;margin:0 auto;padding:60px 60px 120px;}
.article-body h1{font-family:var(--serif);font-size:clamp(1.8rem,3vw,2.6rem);font-weight:300;color:var(--white);line-height:1.2;margin-bottom:2rem;font-style:italic;}
.article-body h2{font-family:var(--serif);font-size:clamp(1.4rem,2.2vw,1.9rem);font-weight:300;color:var(--white);line-height:1.25;margin:3.5rem 0 1.25rem;letter-spacing:-0.01em;}
.article-body h3{font-family:var(--serif);font-size:1.2rem;font-weight:400;color:var(--gold-bright);margin:2.5rem 0 1rem;font-style:italic;}
.article-body p{font-family:var(--sans);font-size:0.95rem;font-weight:300;line-height:1.9;color:var(--white-dim);margin-bottom:1.5rem;}
.article-body p:first-of-type{font-family:var(--serif);font-size:1.15rem;line-height:1.75;color:var(--white);font-style:italic;border-left:2px solid var(--gold);padding-left:1.5rem;margin-bottom:2.5rem;}
.article-body ul,.article-body ol{margin:1rem 0 2rem 1.5rem;}
.article-body li{font-family:var(--sans);font-size:0.92rem;font-weight:300;line-height:1.8;color:var(--white-dim);margin-bottom:0.6rem;}
.article-body ul li::marker{color:var(--gold);}
.article-body ol li::marker{color:var(--gold);font-family:var(--mono);font-size:0.8rem;}
.article-body a{color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);transition:border-color 0.2s;}
.article-body a:hover{border-color:var(--gold);}
.article-body blockquote{border-left:2px solid var(--gold);margin:2.5rem 0;padding:1.5rem 2rem;background:var(--black-2);}
.article-body blockquote p{font-family:var(--serif);font-size:1.1rem;color:var(--white);font-style:italic;line-height:1.65;border:none;padding:0;margin:0;}
.article-body strong{color:var(--white);font-weight:500;}

/* FAQ */
.article-body details{border:1px solid var(--line);margin-bottom:8px;background:var(--black-2);}
.article-body summary{padding:1.1rem 1.5rem;cursor:pointer;font-family:var(--sans);font-size:0.88rem;font-weight:400;color:var(--white);list-style:none;display:flex;justify-content:space-between;align-items:center;letter-spacing:0.01em;}
.article-body summary::-webkit-details-marker{display:none;}
.article-body summary::after{content:'+';font-family:var(--mono);color:var(--gold);font-size:1rem;flex-shrink:0;}
.article-body details[open] summary{border-bottom:1px solid var(--line);}
.article-body details[open] summary::after{content:'−';}
.article-body details p{padding:1.25rem 1.5rem;margin:0;font-size:0.88rem;color:var(--white-dim);line-height:1.8;border:none;}

/* CTA SECTION */
.article-cta{background:var(--black-2);border:1px solid var(--line-gold);padding:60px;text-align:center;margin:0 60px 80px;}
.article-cta-label{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:16px;display:block;}
.article-cta h2{font-family:var(--serif);font-size:clamp(1.8rem,3vw,2.8rem);font-weight:300;color:var(--white);margin-bottom:16px;line-height:1.2;}
.article-cta p{font-family:var(--sans);font-size:0.85rem;color:var(--white-dim);margin-bottom:32px;line-height:1.7;}
.article-cta a{font-family:var(--mono);font-size:0.62rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);border:1px solid var(--line-gold);padding:14px 32px;text-decoration:none;display:inline-block;transition:all 0.25s;}
.article-cta a:hover{background:var(--gold);color:var(--black);border-color:var(--gold);}

/* BACK LINK */
.back-link{position:fixed;top:72px;left:0;right:0;z-index:100;padding:12px 60px;background:var(--black);border-bottom:1px solid var(--line);display:flex;justify-content:space-between;align-items:center;}
.back-link a{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.2s;}
.back-link a:hover{color:var(--gold);}
.back-link span{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--white-muted);}

/* FOOTER */
footer{background:var(--black-2);border-top:1px solid var(--line);padding:60px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px;}
.footer-logo{font-family:var(--serif);font-size:1.2rem;color:var(--white);text-decoration:none;}
.footer-note{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);}

@media(max-width:768px){
  nav{padding:0 24px;}
  .nav-center{display:none;}
  .back-link{padding:10px 24px;}
  .article-header{padding:130px 24px 0;}
  .article-image{padding:0 24px;}
  .article-body{padding:40px 24px 80px;}
  .article-cta{margin:0 24px 60px;padding:40px 24px;}
  footer{padding:40px 24px;}
}
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

<div class="back-link">
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
  <img src="${imageUrl}" alt="${blogData.title} — indéva studio" loading="eager" width="1200" height="675">
</div>

<main class="article-body">
  ${blogData.article}
</main>

<div class="article-cta">
  <span class="article-cta-label">indéva studio · new delhi</span>
  <h2>ready to transform your space?</h2>
  <p>our design consultants are available for a complimentary 30-minute discovery session. tell us about your project.</p>
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

function updateBlogIndex(blogs) {
  const indexPath = path.join(REPO_ROOT, "blogs", "index.json");
  let existing = [];
  if (fs.existsSync(indexPath)) {
    try { existing = JSON.parse(fs.readFileSync(indexPath, "utf8")); } catch (_) { existing = []; }
  }
  const newEntries = blogs.map((b) => ({
    title: b.title, slug: b.slug, meta: b.meta, cat: b.cat,
    date: new Date().toISOString().split("T")[0], keyword: b.keyword,
  }));
  const updated = [...newEntries, ...existing].slice(0, 200);
  fs.writeFileSync(indexPath, JSON.stringify(updated, null, 2));
  console.log("📚 Blog index updated");
}

function buildBlogListingPage() {
  const indexPath = path.join(REPO_ROOT, "blogs", "index.json");
  if (!fs.existsSync(indexPath)) return;
  let blogs = [];
  try { blogs = JSON.parse(fs.readFileSync(indexPath, "utf8")); } catch (_) { return; }

  const cards = blogs.slice(0, 24).map((b) => {
    const imageUrl = getImageUrl(b.slug);
    return `
    <a class="blog-card" href="/blogs/${b.slug}">
      <img src="${imageUrl}" alt="${b.title}" class="blog-card-image">
      <div class="blog-card-cat">${b.cat || "design intelligence"}</div>
      <h2 class="blog-card-title">${b.title.toLowerCase()}</h2>
      <p class="blog-card-excerpt">${b.meta}</p>
      <div class="blog-card-read">read article ↗</div>
    </a>`;
  }).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>blog — indéva studio</title>
<meta name="description" content="design intelligence from indéva studio — perspectives on luxury interior design, spatial logic, materials, and process.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://indevastudio.com/blogs/">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Founders+Grotesk:wght@300;400;500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
:root{--black:#0a0a0a;--black-2:#111111;--gold:#b89a6a;--gold-dim:#8a7250;--white:#f0ebe3;--white-dim:rgba(240,235,227,0.55);--white-muted:rgba(240,235,227,0.28);--serif:'Cormorant Garamond',Georgia,serif;--sans:'Founders Grotesk',sans-serif;--mono:'DM Mono',monospace;--line:rgba(240,235,227,0.08);--line-gold:rgba(184,154,106,0.2);}
*,*::before,*::after{margin:0;padding:0;box-sizing:border-box;}
body{background:var(--black);color:var(--white);font-family:var(--sans);font-weight:300;-webkit-font-smoothing:antialiased;}
nav{position:fixed;top:0;left:0;right:0;z-index:200;display:flex;align-items:center;justify-content:space-between;padding:0 60px;height:72px;background:var(--black);border-bottom:1px solid var(--line);}
.nav-logo{font-family:var(--serif);font-size:1.45rem;font-weight:400;letter-spacing:0.04em;color:var(--white);text-decoration:none;line-height:1;}
.nav-logo sub{font-family:var(--mono);font-size:0.5rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold);display:block;margin-top:2px;}
.nav-center{display:flex;gap:36px;}
.nav-link{font-family:var(--mono);font-size:0.62rem;font-weight:300;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.25s;}
.nav-link:hover{color:var(--white);}.nav-link.active{color:var(--gold);}
.nav-cta{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--gold);border:1px solid var(--line-gold);padding:10px 22px;text-decoration:none;transition:all 0.25s;}
.nav-cta:hover{background:var(--gold);color:var(--black);border-color:var(--gold);}
.page-hero{padding:160px 60px 80px;border-bottom:1px solid var(--line);}
.label{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.3em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:20px;display:block;}
.page-title{font-family:var(--serif);font-size:clamp(2.5rem,5vw,5rem);font-weight:300;line-height:1;letter-spacing:-0.02em;color:var(--white);}
.blog-grid{padding:80px 60px 120px;display:grid;grid-template-columns:1fr 1fr;gap:2px;}
.blog-card{display:block;text-decoration:none;background:var(--black-2);padding:40px;border:1px solid var(--line);transition:border-color 0.25s;}
.blog-card:hover{border-color:var(--gold);}
.blog-card-image{width:100%;aspect-ratio:16/9;object-fit:cover;display:block;margin-bottom:28px;filter:brightness(0.75) saturate(0.8);transition:filter 0.4s;}
.blog-card:hover .blog-card-image{filter:brightness(0.9) saturate(1);}
.blog-card-cat{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold-dim);margin-bottom:12px;}
.blog-card-title{font-family:var(--serif);font-size:clamp(1.2rem,1.8vw,1.6rem);font-weight:300;color:var(--white);line-height:1.25;margin-bottom:16px;}
.blog-card-excerpt{font-family:var(--sans);font-size:0.82rem;font-weight:300;line-height:1.85;color:var(--white-dim);margin-bottom:24px;}
.blog-card-read{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);transition:color 0.2s;}
.blog-card:hover .blog-card-read{color:var(--gold);}
footer{background:var(--black-2);border-top:1px solid var(--line);padding:60px;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:24px;}
.footer-logo{font-family:var(--serif);font-size:1.2rem;color:var(--white);text-decoration:none;}
.footer-note{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white-muted);}
@media(max-width:768px){nav{padding:0 24px;}.nav-center{display:none;}.page-hero{padding:120px 24px 60px;}.blog-grid{grid-template-columns:1fr;padding:40px 24px 80px;}footer{padding:40px 24px;}}
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
    <a class="nav-link active" href="/blogs/">insights</a>
  </div>
  <a class="nav-cta" href="/#contact">start a project</a>
</nav>
<section class="page-hero">
  <span class="label">journal · insights</span>
  <h1 class="page-title">design<br><em style="font-style:italic;color:var(--gold)">intelligence.</em></h1>
</section>
<div class="blog-grid">
  ${cards}
</div>
<footer>
  <a class="footer-logo" href="/">indéva studio</a>
  <span class="footer-note">luxury interior design · new delhi, india</span>
  <span class="footer-note">© ${new Date().getFullYear()} indéva studio</span>
</footer>
</body>
</html>`;

  fs.writeFileSync(path.join(REPO_ROOT, "blogs", "index.html"), html);
  console.log("📄 Blog listing page updated");
}

async function main() {
  console.log("\n🌟 INDEVA STUDIO — BLOG ENGINE STARTED");
  console.log("━".repeat(50));
  console.log(`📅 Date: ${new Date().toLocaleDateString("en-IN")}`);

  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY is not set.");
    process.exit(1);
  }

  const blogsDir = path.join(REPO_ROOT, "blogs");
  if (!fs.existsSync(blogsDir)) fs.mkdirSync(blogsDir, { recursive: true });

  const selections = selectDailyKeywords();
  const publishedBlogs = [];

  for (let i = 0; i < selections.length; i++) {
    const { keyword, category } = selections[i];
    console.log(`\n[${i + 1}/4] Processing: "${keyword}"`);
    try {
      const raw = await generateBlog(keyword);
      const blogData = parseBlogResponse(raw, keyword, category);
      blogData.keyword = keyword;
      const html = buildHTMLPage(blogData, keyword, category);
      const filePath = path.join(blogsDir, `${blogData.slug}.html`);
      fs.writeFileSync(filePath, html);
      console.log(`  ✅ Saved: blogs/${blogData.slug}.html`);
      publishedBlogs.push(blogData);
      if (i < selections.length - 1) await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`  ❌ Failed for "${keyword}":`, err.message);
    }
  }

  if (publishedBlogs.length > 0) {
    updateBlogIndex(publishedBlogs);
    buildBlogListingPage();
  }

  console.log("\n🎉 DONE! Blogs published:", publishedBlogs.length);
  console.log("━".repeat(50));
}

main().catch(console.error);
