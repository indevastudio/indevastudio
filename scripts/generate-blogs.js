/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE
 * Fixed version — correct folder paths for indevastudio repo
 */

import Anthropic from "@anthropic-ai/sdk";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─────────────────────────────────────────────
// 1. KEYWORD POOL
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

// ─────────────────────────────────────────────
// 2. INTERNAL + EXTERNAL LINKS
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 3. KEYWORD SELECTOR
// ─────────────────────────────────────────────
function selectDailyKeywords() {
  const categories = Object.keys(KEYWORD_POOL);
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 86400000
  );
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

// ─────────────────────────────────────────────
// 4. SLUG GENERATOR
// ─────────────────────────────────────────────
function toSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

// ─────────────────────────────────────────────
// 5. BLOG GENERATOR
// ─────────────────────────────────────────────
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
  const response = await client.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].text;
}

// ─────────────────────────────────────────────
// 6. PARSE RESPONSE
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 7. IMAGE HELPER
// ─────────────────────────────────────────────
function getImageUrl(keyword) {
  const queries = [
    "luxury+interior+design",
    "modern+indian+home",
    "elegant+living+room",
    "luxury+bedroom+design",
    "modular+kitchen+india",
    "contemporary+home+design",
  ];
  const query = queries[Math.floor(Math.random() * queries.length)];
  const seed = keyword.length + (Date.now() % 1000);
  return `https://source.unsplash.com/1200x675/?${query}&sig=${seed}`;
}

// ─────────────────────────────────────────────
// 8. SCHEMA MARKUP
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// 9. HTML PAGE BUILDER
// ─────────────────────────────────────────────
function buildHTMLPage(blogData, keyword) {
  const date = new Date().toISOString().split("T")[0];
  const imageUrl = getImageUrl(keyword);
  const schema = generateSchema(blogData.title, blogData.meta, blogData.slug, date);
  const readableDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric", month: "long", day: "numeric",
  });

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
  <script type="application/ld+json">
${schema}
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/blogs/blog-style.css" />
</head>
<body>
  <nav class="blog-nav">
    <a href="/" class="blog-nav__logo">Indéva Studio</a>
    <div class="blog-nav__links">
      <a href="/index.html#projects">Portfolio</a>
      <a href="/index.html#services">Services</a>
      <a href="/blogs/">Journal</a>
      <a href="/index.html#contact" class="blog-nav__cta">Get Consultation</a>
    </div>
  </nav>

  <div class="blog-hero">
    <img src="${imageUrl}" alt="${blogData.title} — Indéva Studio" loading="eager" width="1200" height="675" />
    <div class="blog-hero__overlay">
      <span class="blog-hero__category">Interior Design Journal</span>
      <p class="blog-hero__date">${readableDate} · By Indéva Studio</p>
    </div>
  </div>

  <main class="blog-main">
    <div class="blog-container">
      ${blogData.article}
    </div>
  </main>

  <section class="blog-cta-banner">
    <div class="blog-cta-banner__inner">
      <h2>Ready to Transform Your Space?</h2>
      <p>Our design consultants are available for a complimentary 30-minute discovery session.</p>
      <a href="/index.html#contact" class="blog-cta-banner__btn">Book Free Consultation →</a>
    </div>
  </section>

  <footer class="blog-footer">
    <p>© ${new Date().getFullYear()} Indéva Studio · <a href="/">indevastudio.com</a> · hello@indevastudio.com</p>
    <p><a href="/blogs/">← Back to Journal</a></p>
  </footer>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 10. BLOG INDEX UPDATER
// ─────────────────────────────────────────────
function updateBlogIndex(blogs) {
  const indexPath = path.join(REPO_ROOT, "blogs", "index.json");
  let existing = [];
  if (fs.existsSync(indexPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(indexPath, "utf8"));
    } catch (_) {
      existing = [];
    }
  }
  const newEntries = blogs.map((b) => ({
    title: b.title,
    slug: b.slug,
    meta: b.meta,
    date: new Date().toISOString().split("T")[0],
    keyword: b.keyword,
  }));
  const updated = [...newEntries, ...existing].slice(0, 200);
  fs.writeFileSync(indexPath, JSON.stringify(updated, null, 2));
  console.log("📚 Blog index updated");
}

// ─────────────────────────────────────────────
// 11. BLOG LISTING PAGE
// ─────────────────────────────────────────────
function buildBlogListingPage(blogs) {
  const cards = blogs.slice(0, 20).map((b) => `
    <article class="blog-card">
      <a href="/blogs/${b.slug}" class="blog-card__link">
        <div class="blog-card__img">
          <img src="https://source.unsplash.com/600x400/?luxury+interior+design&sig=${b.slug.length}" alt="${b.title}" loading="lazy" />
        </div>
        <div class="blog-card__body">
          <time class="blog-card__date">${b.date}</time>
          <h2 class="blog-card__title">${b.title}</h2>
          <p class="blog-card__meta">${b.meta}</p>
          <span class="blog-card__read">Read Article →</span>
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
  <link rel="stylesheet" href="/blogs/blog-style.css" />
</head>
<body>
  <nav class="blog-nav">
    <a href="/" class="blog-nav__logo">Indéva Studio</a>
    <div class="blog-nav__links">
      <a href="/index.html#projects">Portfolio</a>
      <a href="/index.html#services">Services</a>
      <a href="/blogs/">Journal</a>
      <a href="/index.html#contact" class="blog-nav__cta">Get Consultation</a>
    </div>
  </nav>
  <header class="blog-listing-header">
    <p class="blog-listing-header__eyebrow">The Indéva Journal</p>
    <h1>Interior Design Insights</h1>
    <p class="blog-listing-header__sub">Ideas, trends, and expertise from Delhi NCR's premium design studio</p>
  </header>
  <main class="blog-listing-grid">
    ${cards}
  </main>
  <footer class="blog-footer">
    <p>© ${new Date().getFullYear()} Indéva Studio · <a href="/">indevastudio.com</a></p>
  </footer>
</body>
</html>`;

  const outDir = path.join(REPO_ROOT, "blogs");
  fs.writeFileSync(path.join(outDir, "index.html"), html);
  console.log("📄 Blog listing page updated");
}

// ─────────────────────────────────────────────
// 12. MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("\n🌟 INDEVA STUDIO — BLOG ENGINE STARTED");
  console.log("━".repeat(50));
  console.log(`📅 Date: ${new Date().toLocaleDateString("en-IN")}`);

  // Ensure blogs folder exists
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

      if (i < keywords.length - 1) {
        await new Promise((r) => setTimeout(r, 2000));
      }
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
