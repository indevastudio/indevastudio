/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE
 * Uses Google Gemini API (FREE — 1000 requests/day)
 * Dark luxury design embedded — no external CSS needed
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
  { text: "our portfolio", url: "/index.html#projects" },
  { text: "our services", url: "/index.html#services" },
  { text: "contact us for a free consultation", url: "/index.html#contact" },
  { text: "our design projects", url: "/projects.html" },
  { text: "get in touch with our designers", url: "/index.html#contact" },
];

const EXTERNAL_LINKS = [
  { text: "architectural digest", url: "https://www.architecturaldigest.in" },
  { text: "elle decor india", url: "https://www.elledecor.com/in" },
  { text: "indian green building council", url: "https://igbc.in" },
  { text: "national institute of design", url: "https://www.nid.edu" },
  { text: "houzz india", url: "https://www.houzz.in" },
];

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
    if (!selected.includes(keyword)) selected.push(keyword);
  }
  console.log("📌 Today's keywords:", selected);
  return selected;
}

function toSlug(keyword) {
  return keyword.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
}

async function generateBlog(keyword) {
  const internalLink1 = INTERNAL_LINKS[Math.floor(Math.random() * 3)];
  const internalLink2 = INTERNAL_LINKS[3 + Math.floor(Math.random() * 2)];
  const externalLink1 = EXTERNAL_LINKS[Math.floor(Math.random() * EXTERNAL_LINKS.length)];

  const prompt = `You are a senior content writer for Indéva Studio — a premium luxury interior design firm based in Delhi NCR, India. Write a complete, SEO-optimized blog article.

TARGET KEYWORD: "${keyword}"

BRAND VOICE:
- Luxury, refined, expert
- Warm but authoritative
- No AI clichés ("dive into", "delve", "certainly", "absolutely")
- Grade 6-8 readability
- Indian context (rupees, Indian cities, Indian home styles)

MANDATORY STRUCTURE (output valid HTML only, no markdown):

1. SEO_TITLE: (60-65 chars, keyword-first, click-worthy)
2. META_DESC: (under 155 chars, include keyword + CTA)
3. SLUG: (keyword slug, hyphenated)
4. Full HTML article body starting with <article> tag including:
   - <h1> with primary keyword
   - Hook introduction paragraph (problem-aware, emotionally resonant)
   - 4-5 <h2> sections with <h3> subsections where needed
   - Bullet lists where appropriate
   - Cost estimates in INR where relevant (realistic 2025 Indian market rates)
   - This EXACT internal link 1: <a href="${internalLink1.url}">${internalLink1.text}</a>
   - This EXACT internal link 2: <a href="${internalLink2.url}">${internalLink2.text}</a>
   - This EXACT external link: <a href="${externalLink1.url}" rel="noopener noreferrer" target="_blank">${externalLink1.text}</a>
   - FAQ section with 4-5 questions using <details><summary> HTML tags
   - Strong CTA section at end linking to /index.html#contact
5. WORD_COUNT: (target 1400-1800 words)

OUTPUT FORMAT — respond with this exact structure:
SEO_TITLE: [title here]
META_DESC: [description here]
SLUG: [slug here]
---ARTICLE---
[full HTML article here]
---END---

Write the complete article now. No truncation. No placeholders.`;

  console.log(`  ✍️  Generating: "${keyword}"`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.8, maxOutputTokens: 4000 },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(`Gemini API error: ${JSON.stringify(data)}`);
  if (!data.candidates || !data.candidates[0]) throw new Error(`No response from Gemini: ${JSON.stringify(data)}`);
  return data.candidates[0].content.parts[0].text;
}

function parseBlogResponse(raw, keyword) {
  const titleMatch = raw.match(/SEO_TITLE:\s*(.+)/);
  const metaMatch = raw.match(/META_DESC:\s*(.+)/);
  const slugMatch = raw.match(/SLUG:\s*(.+)/);
  const articleMatch = raw.match(/---ARTICLE---([\s\S]+?)---END---/);
  return {
    title: titleMatch ? titleMatch[1].trim() : keyword,
    meta: metaMatch ? metaMatch[1].trim() : "",
    slug: slugMatch ? slugMatch[1].trim() : toSlug(keyword),
    article: articleMatch ? articleMatch[1].trim() : raw,
  };
}

function getImageUrl(keyword) {
  const queries = ["luxury+interior+design", "modern+indian+home", "elegant+living+room", "luxury+bedroom+design", "modular+kitchen+india", "contemporary+home+design"];
  const query = queries[Math.floor(Math.random() * queries.length)];
  const seed = keyword.length + (Date.now() % 1000);
  return `https://source.unsplash.com/1200x675/?${query}&sig=${seed}`;
}

function generateSchema(title, meta, slug, date) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: meta,
    datePublished: date,
    dateModified: date,
    author: { "@type": "Organization", name: "Indéva Studio", url: "https://indevastudio.com" },
    publisher: { "@type": "Organization", name: "Indéva Studio" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://indevastudio.com/blogs/${slug}` },
  }, null, 2);
}

function buildHTMLPage(blogData, keyword) {
  const date = new Date().toISOString().split("T")[0];
  const imageUrl = getImageUrl(keyword);
  const schema = generateSchema(blogData.title, blogData.meta, blogData.slug, date);
  const readableDate = new Date().toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${blogData.title} | Indéva Studio</title>
  <meta name="description" content="${blogData.meta}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://indevastudio.com/blogs/${blogData.slug}" />
  <meta property="og:title" content="${blogData.title}" />
  <meta property="og:description" content="${blogData.meta}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="https://indevastudio.com/blogs/${blogData.slug}" />
  <meta property="og:type" content="article" />
  <script type="application/ld+json">${schema}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --black:#0a0a0a;--black-card:#161616;
      --gold:#b89a6a;--gold-light:#d4b896;--gold-dim:rgba(184,154,106,0.12);
      --white:#f0ebe3;--white-muted:#c8c0b4;--white-dim:rgba(240,235,227,0.55);
      --serif:'Cormorant Garamond',Georgia,serif;
      --mono:'DM Mono','Courier New',monospace;
    }
    html{scroll-behavior:smooth}
    body{background:var(--black);color:var(--white);font-family:var(--serif);font-weight:300;line-height:1.75;-webkit-font-smoothing:antialiased}

    /* NAV */
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,4rem);height:68px;background:rgba(10,10,10,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(184,154,106,0.1)}
    .nav__logo{font-family:var(--serif);font-size:1.1rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);text-decoration:none}
    .nav__links{display:flex;align-items:center;gap:2rem}
    .nav__links a{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.2s}
    .nav__links a:hover{color:var(--gold)}
    .nav__cta{padding:0.45rem 1.1rem;border:1px solid var(--gold)!important;color:var(--gold)!important;transition:all 0.2s!important}
    .nav__cta:hover{background:var(--gold)!important;color:var(--black)!important}

    /* BACK BAR */
    .back-bar{position:fixed;top:68px;left:0;right:0;z-index:90;padding:0.6rem clamp(1.5rem,5vw,4rem);background:rgba(10,10,10,0.85);border-bottom:1px solid rgba(184,154,106,0.07);display:flex;align-items:center;justify-content:space-between}
    .back-bar a{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);text-decoration:none}
    .back-bar__meta{font-family:var(--mono);font-size:0.62rem;color:var(--white-dim);letter-spacing:0.08em}

    /* HERO */
    .hero{margin-top:110px;position:relative;height:clamp(300px,52vh,540px);overflow:hidden}
    .hero img{width:100%;height:100%;object-fit:cover;filter:brightness(0.35);display:block}
    .hero__overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(1.5rem,4vw,3rem) clamp(1.5rem,8vw,8rem)}
    .hero__eyebrow{font-family:var(--mono);font-size:0.62rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);margin-bottom:0.75rem}
    .hero__title{font-size:clamp(1.8rem,4vw,3.2rem);font-weight:300;font-style:italic;color:var(--white);line-height:1.15;max-width:800px;margin-bottom:1rem}
    .hero__date{font-family:var(--mono);font-size:0.65rem;color:var(--white-dim);letter-spacing:0.08em}

    /* ARTICLE */
    .article-wrap{max-width:760px;margin:0 auto;padding:4rem clamp(1.5rem,5vw,3rem) 6rem}
    .article-wrap h1{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;font-style:italic;color:var(--white);line-height:1.2;margin-bottom:2rem}
    .article-wrap h2{font-size:clamp(1.3rem,2.2vw,1.8rem);font-weight:400;color:var(--gold-light);margin:3rem 0 1rem;letter-spacing:0.01em}
    .article-wrap h3{font-size:1.15rem;font-weight:400;font-style:italic;color:var(--white);margin:2rem 0 0.75rem}
    .article-wrap p{font-size:1.05rem;color:var(--white-muted);line-height:1.85;margin-bottom:1.5rem}
    .article-wrap p:first-of-type{font-size:1.15rem;color:var(--white);font-style:italic;padding-left:1.25rem;border-left:2px solid var(--gold);margin-bottom:2.5rem}
    .article-wrap ul,.article-wrap ol{margin:1rem 0 1.75rem 1.5rem}
    .article-wrap li{color:var(--white-muted);font-size:1rem;line-height:1.7;margin-bottom:0.5rem}
    .article-wrap ul li::marker{color:var(--gold)}
    .article-wrap ol li::marker{color:var(--gold);font-family:var(--mono);font-size:0.85rem}
    .article-wrap a{color:var(--gold);text-decoration:underline;text-decoration-color:rgba(184,154,106,0.35);text-underline-offset:3px;transition:text-decoration-color 0.2s}
    .article-wrap a:hover{text-decoration-color:var(--gold)}
    .article-wrap details{border:1px solid rgba(184,154,106,0.18);margin-bottom:0.6rem;overflow:hidden}
    .article-wrap summary{padding:1rem 1.25rem;cursor:pointer;font-weight:400;color:var(--white);font-size:0.98rem;list-style:none;display:flex;justify-content:space-between;align-items:center;background:var(--black-card)}
    .article-wrap summary::-webkit-details-marker{display:none}
    .article-wrap summary::after{content:'+';font-family:var(--mono);color:var(--gold);font-size:1.1rem}
    .article-wrap details[open] summary::after{content:'−'}
    .article-wrap details p{padding:1rem 1.25rem;margin:0;font-size:0.95rem;background:var(--black-card);border-top:1px solid rgba(184,154,106,0.1)}

    /* CTA BANNER */
    .cta-banner{background:linear-gradient(135deg,#14100a 0%,#0a0a0a 100%);border-top:1px solid rgba(184,154,106,0.18);border-bottom:1px solid rgba(184,154,106,0.18);padding:5rem clamp(1.5rem,5vw,4rem);text-align:center}
    .cta-banner h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:300;font-style:italic;color:var(--white);margin-bottom:0.75rem}
    .cta-banner p{font-family:var(--mono);font-size:0.72rem;color:var(--white-dim);letter-spacing:0.05em;margin-bottom:2rem}
    .cta-banner a{display:inline-block;padding:0.9rem 2.25rem;background:var(--gold);color:var(--black);font-family:var(--mono);font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;transition:background 0.2s,transform 0.2s}
    .cta-banner a:hover{background:var(--gold-light);transform:translateY(-1px)}

    /* FOOTER */
    .footer{padding:2.5rem clamp(1.5rem,5vw,4rem);text-align:center;border-top:1px solid rgba(184,154,106,0.08)}
    .footer p{font-family:var(--mono);font-size:0.65rem;color:var(--white-dim);letter-spacing:0.05em;margin-bottom:0.4rem}
    .footer a{color:var(--gold);text-decoration:none}

    @media(max-width:768px){.nav__links{display:none}.hero{margin-top:100px}}
  </style>
</head>
<body>

  <nav class="nav">
    <a href="/" class="nav__logo">Indéva Studio</a>
    <div class="nav__links">
      <a href="/index.html#projects">Portfolio</a>
      <a href="/index.html#services">Services</a>
      <a href="/blogs/">Journal</a>
      <a href="/index.html#contact" class="nav__cta">Get Consultation</a>
    </div>
  </nav>

  <div class="back-bar">
    <a href="/blogs/">← Back to Journal</a>
    <span class="back-bar__meta">${readableDate} · Indéva Studio</span>
  </div>

  <div class="hero">
    <img src="${imageUrl}" alt="${blogData.title} — Indéva Studio" loading="eager" width="1200" height="675" />
    <div class="hero__overlay">
      <p class="hero__eyebrow">Interior Design Journal</p>
      <h2 class="hero__title">${blogData.title}</h2>
      <p class="hero__date">${readableDate} · By Indéva Studio</p>
    </div>
  </div>

  <main class="article-wrap">
    ${blogData.article}
  </main>

  <section class="cta-banner">
    <h2>Ready to Transform Your Space?</h2>
    <p>Our design consultants are available for a complimentary 30-minute discovery session.</p>
    <a href="/index.html#contact">Book Free Consultation →</a>
  </section>

  <footer class="footer">
    <p>© ${new Date().getFullYear()} Indéva Studio · <a href="/">indevastudio.com</a> · hello@indevastudio.com</p>
    <p><a href="/blogs/">← Back to Journal</a></p>
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
    title: b.title, slug: b.slug, meta: b.meta,
    date: new Date().toISOString().split("T")[0], keyword: b.keyword,
  }));
  const updated = [...newEntries, ...existing].slice(0, 200);
  fs.writeFileSync(indexPath, JSON.stringify(updated, null, 2));
  console.log("📚 Blog index updated");
}

function buildBlogListingPage(blogs) {
  const cards = blogs.slice(0, 20).map((b) => `
    <article class="card">
      <a href="/blogs/${b.slug}" class="card__link">
        <div class="card__img">
          <img src="https://source.unsplash.com/600x400/?luxury+interior+design&sig=${b.slug.length}" alt="${b.title}" loading="lazy" />
        </div>
        <div class="card__body">
          <time class="card__date">${b.date}</time>
          <h2 class="card__title">${b.title}</h2>
          <p class="card__meta">${b.meta}</p>
          <span class="card__read">Read Article →</span>
        </div>
      </a>
    </article>`).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Interior Design Journal | Indéva Studio</title>
  <meta name="description" content="Expert interior design insights, trends, and ideas from Indéva Studio — Delhi NCR's premium design firm." />
  <link rel="canonical" href="https://indevastudio.com/blogs/" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{--black:#0a0a0a;--gold:#b89a6a;--gold-light:#d4b896;--white:#f0ebe3;--white-muted:#c8c0b4;--white-dim:rgba(240,235,227,0.55);--black-card:#161616;--serif:'Cormorant Garamond',Georgia,serif;--mono:'DM Mono','Courier New',monospace}
    body{background:var(--black);color:var(--white);font-family:var(--serif);font-weight:300;-webkit-font-smoothing:antialiased}
    .nav{position:sticky;top:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,4rem);height:68px;background:rgba(10,10,10,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(184,154,106,0.1)}
    .nav__logo{font-family:var(--serif);font-size:1.1rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);text-decoration:none}
    .nav__links{display:flex;align-items:center;gap:2rem}
    .nav__links a{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.2s}
    .nav__links a:hover{color:var(--gold)}
    .nav__cta{padding:0.45rem 1.1rem;border:1px solid var(--gold)!important;color:var(--gold)!important;transition:all 0.2s!important}
    .nav__cta:hover{background:var(--gold)!important;color:var(--black)!important}
    .listing-header{text-align:center;padding:6rem clamp(1.5rem,5vw,4rem) 4rem;border-bottom:1px solid rgba(184,154,106,0.1)}
    .listing-header__eyebrow{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);margin-bottom:1rem}
    .listing-header h1{font-size:clamp(2.2rem,5vw,3.8rem);font-weight:300;font-style:italic;color:var(--white);margin-bottom:1rem}
    .listing-header__sub{font-family:var(--mono);font-size:0.72rem;color:var(--white-dim);letter-spacing:0.05em}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(340px,1fr));gap:2px;padding:2px;max-width:1400px;margin:0 auto}
    .card{background:var(--black-card);overflow:hidden}
    .card__link{display:block;text-decoration:none;height:100%}
    .card__img{height:220px;overflow:hidden}
    .card__img img{width:100%;height:100%;object-fit:cover;filter:brightness(0.7);transition:transform 0.6s,filter 0.4s;display:block}
    .card:hover .card__img img{transform:scale(1.04);filter:brightness(0.85)}
    .card__body{padding:1.75rem}
    .card__date{display:block;font-family:var(--mono);font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);margin-bottom:0.75rem}
    .card__title{font-size:1.25rem;font-weight:400;font-style:italic;color:var(--white);line-height:1.3;margin-bottom:0.75rem;transition:color 0.2s}
    .card:hover .card__title{color:var(--gold-light)}
    .card__meta{font-family:var(--mono);font-size:0.72rem;color:var(--white-dim);line-height:1.6;margin-bottom:1.25rem;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
    .card__read{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.1em;color:var(--gold);text-transform:uppercase}
    .footer{padding:2.5rem;text-align:center;border-top:1px solid rgba(184,154,106,0.08)}
    .footer p{font-family:var(--mono);font-size:0.65rem;color:var(--white-dim)}
    .footer a{color:var(--gold);text-decoration:none}
    @media(max-width:768px){.nav__links{display:none}.grid{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <nav class="nav">
    <a href="/" class="nav__logo">Indéva Studio</a>
    <div class="nav__links">
      <a href="/index.html#projects">Portfolio</a>
      <a href="/index.html#services">Services</a>
      <a href="/blogs/">Journal</a>
      <a href="/index.html#contact" class="nav__cta">Get Consultation</a>
    </div>
  </nav>
  <header class="listing-header">
    <p class="listing-header__eyebrow">The Indéva Journal</p>
    <h1>Interior Design Insights</h1>
    <p class="listing-header__sub">Ideas, trends, and expertise from Delhi NCR's premium design studio</p>
  </header>
  <main class="grid">${cards}</main>
  <footer class="footer">
    <p>© ${new Date().getFullYear()} Indéva Studio · <a href="/">indevastudio.com</a></p>
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
    console.error("❌ GEMINI_API_KEY is not set. Add it to GitHub Secrets.");
    process.exit(1);
  }

  const blogsDir = path.join(REPO_ROOT, "blogs");
  if (!fs.existsSync(blogsDir)) {
    fs.mkdirSync(blogsDir, { recursive: true });
    console.log("📁 Created blogs/ folder");
  }

  const keywords = selectDailyKeywords();
  const publishedBlogs = [];

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    console.log(`\n[${i + 1}/4] Processing: "${keyword}"`);
    try {
      const raw = await generateBlog(keyword);
      const blogData = parseBlogResponse(raw, keyword);
      blogData.keyword = keyword;
      const html = buildHTMLPage(blogData, keyword);
      const filePath = path.join(blogsDir, `${blogData.slug}.html`);
      fs.writeFileSync(filePath, html);
      console.log(`  ✅ Saved: blogs/${blogData.slug}.html`);
      publishedBlogs.push(blogData);
      if (i < keywords.length - 1) await new Promise((r) => setTimeout(r, 2000));
    } catch (err) {
      console.error(`  ❌ Failed for "${keyword}":`, err.message);
    }
  }

  if (publishedBlogs.length > 0) {
    updateBlogIndex(publishedBlogs);
    buildBlogListingPage(publishedBlogs);
  }

  console.log("\n🎉 DONE! Blogs published:", publishedBlogs.length);
  console.log("━".repeat(50));
}

main().catch(console.error);
