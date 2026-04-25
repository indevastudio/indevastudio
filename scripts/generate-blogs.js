/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE v3
 * Full uniqueness system: angle rotation, title history,
 * structure variation, semantic diversity, anti-duplication
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MEMORY_FILE = path.join(REPO_ROOT, "content", "blog-memory.json");

// ─────────────────────────────────────────────
// MEMORY SYSTEM
// Tracks: used titles, used angles, content summaries
// ─────────────────────────────────────────────
function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) {
    return { titles: [], slugs: [], usedKeywords: [], summaries: [], lastAngles: [] };
  }
  try {
    return JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
  } catch (_) {
    return { titles: [], slugs: [], usedKeywords: [], summaries: [], lastAngles: [] };
  }
}

function saveMemory(memory) {
  fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
  // Keep only last 200 entries to avoid bloat
  memory.titles = memory.titles.slice(-200);
  memory.slugs = memory.slugs.slice(-200);
  memory.summaries = memory.summaries.slice(-200);
  memory.usedKeywords = memory.usedKeywords.slice(-200);
  memory.lastAngles = memory.lastAngles.slice(-20);
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

// ─────────────────────────────────────────────
// CONTENT ANGLES — 6 distinct approaches
// Each blog gets a different angle to ensure
// content is different even for same keyword
// ─────────────────────────────────────────────
const ANGLES = [
  {
    id: "cost-guide",
    name: "Cost & Budget Guide",
    structure: "Guide format",
    intro: "Data-driven with cost anchors",
    instruction: `Write as a DEFINITIVE COST GUIDE. 
    Structure: Start with the biggest cost misconception in India.
    H2s must cover: what drives costs up, cost breakdown by room, 
    how to negotiate, red flags that inflate bills, real project budget example.
    Tone: Financial advisor meets design expert. Specific ₹ figures throughout.
    Opening: Start with a surprising cost statistic or common pricing myth.`,
  },
  {
    id: "mistakes-avoid",
    name: "Mistakes to Avoid",
    structure: "Warning/listicle format",
    intro: "Problem-aware story opening",
    instruction: `Write as a WARNING GUIDE exposing costly mistakes.
    Structure: Open with a real-sounding client disaster story (no names).
    H2s must be mistakes, each with: what goes wrong, why it happens, exact fix.
    Tone: Experienced designer who has seen everything go wrong.
    Opening: "The day a client called us mid-project..." type narrative.
    Every section must feel like hard-won wisdom, not generic advice.`,
  },
  {
    id: "expert-insights",
    name: "Expert Perspective",
    structure: "Narrative/opinion format",
    intro: "Provocative expert opinion",
    instruction: `Write as a PROVOCATIVE EXPERT OPINION piece.
    Structure: Take a contrarian or unexpected position on the topic.
    H2s must challenge conventional wisdom about this topic in India.
    Tone: Senior designer with 15 years experience speaking candidly.
    Opening: Start with a bold statement that most designers won't say publicly.
    Include at least one counterintuitive insight specific to Indian homes/clients.`,
  },
  {
    id: "step-by-step",
    name: "Step-by-Step Process",
    structure: "Sequential how-to format",
    intro: "Question-based opening",
    instruction: `Write as a PRACTICAL STEP-BY-STEP PROCESS guide.
    Structure: Open with the question clients ask most about this topic.
    H2s must be numbered steps (Step 1, Step 2, etc.) in logical sequence.
    Tone: Patient teacher explaining to a first-time client.
    Each step must include: what to do, what to ask your designer, common pitfall.
    Opening: Start with "Most people approach [topic] backwards. Here is the right sequence."`,
  },
  {
    id: "case-study",
    name: "Case Study Style",
    structure: "Story-driven narrative",
    intro: "Story-based client journey",
    instruction: `Write as a CASE STUDY following a real-sounding client project.
    Structure: Follow one project from brief to completion.
    Use a specific Indian city, property type, and budget throughout.
    H2s must be project phases: The Brief, The Challenge, The Design Solution, The Result.
    Tone: Documentary storytelling — specific details make it feel real.
    Opening: Describe the client situation before the project started.
    Include: exact timeline, specific design decisions and why, final cost vs budget.`,
  },
  {
    id: "design-ideas",
    name: "Design Ideas & Inspiration",
    structure: "Inspirational listicle",
    intro: "Vivid visual description opening",
    instruction: `Write as a CURATED DESIGN IDEAS piece with strong visual language.
    Structure: Open by describing a specific beautiful space in detail.
    H2s must be distinct design directions/styles for this topic.
    Tone: Design magazine editor — aspirational but grounded in Indian reality.
    Each idea section must include: visual description, materials, cost range, who it suits.
    Opening: Paint a vivid picture of what the ideal version of this space looks/feels like.
    Reference specific Indian aesthetics, materials, or cultural elements.`,
  },
];

// City rotation to ensure geographic variety
const CITIES = [
  { city: "Delhi", area: "South Delhi", property: "independent bungalow" },
  { city: "Gurgaon", area: "DLF Phase 5", property: "luxury apartment" },
  { city: "Noida", area: "Sector 150", property: "penthouse" },
  { city: "Delhi", area: "Lutyens Delhi", property: "heritage bungalow" },
  { city: "Gurgaon", area: "Golf Course Road", property: "villa" },
  { city: "Noida", area: "Sector 44", property: "builder floor" },
  { city: "Delhi", area: "Greater Kailash", property: "duplex" },
];

// Budget ranges to rotate through
const BUDGETS = [
  { range: "₹15–25 lakh", tier: "mid-luxury" },
  { range: "₹40–80 lakh", tier: "premium" },
  { range: "₹1–3 crore", tier: "ultra-luxury" },
  { range: "₹8–15 lakh", tier: "aspirational" },
  { range: "₹25–50 lakh", tier: "high-end" },
];

// ─────────────────────────────────────────────
// KEYWORD POOL
// ─────────────────────────────────────────────
const KEYWORD_POOL = {
  interior_design: [
    "luxury home interior design cost Delhi 2025",
    "premium interior designers Delhi NCR",
    "bespoke interior design ideas Indian homes",
    "contemporary interior design trends India 2025",
    "full home interior design cost Gurgaon",
    "best luxury interior designers near me Delhi",
    "high end interior design services India",
    "affordable luxury interior design Delhi NCR",
  ],
  villa: [
    "luxury villa interior design India",
    "villa interior design cost Delhi NCR",
    "modern villa design ideas Indian homes",
    "farmhouse villa interior design Gurgaon",
    "luxury villa bedroom design ideas India",
    "contemporary villa living room design India",
    "villa interior designers Delhi NCR price",
    "bespoke villa interior design Noida",
  ],
  farmhouse: [
    "farmhouse interior design ideas India",
    "luxury farmhouse design Delhi NCR",
    "modern farmhouse interior design cost India",
    "farmhouse living room design ideas India",
    "rustic luxury farmhouse design Delhi",
    "farmhouse bedroom interior design India",
    "weekend farmhouse interior design Gurgaon",
    "farmhouse kitchen design ideas India",
  ],
  restaurant: [
    "luxury restaurant interior design India",
    "restaurant interior design cost Delhi",
    "fine dining restaurant design ideas India",
    "modern cafe interior design Delhi NCR",
    "restaurant interior designers Gurgaon",
    "premium restaurant design ideas India 2025",
    "restaurant ambience design cost India",
    "high end cafe and restaurant design Delhi",
  ],
  living_room: [
    "luxury living room interior design Delhi",
    "modern living room design ideas India 2025",
    "living room TV unit design ideas India",
    "false ceiling design for living room India",
    "sofa set design ideas Indian living room",
    "living room interior cost estimate Delhi",
    "premium living room design Gurgaon",
    "open plan living room design India",
  ],
  bedroom: [
    "master bedroom interior design ideas India",
    "luxury bedroom design cost Delhi NCR",
    "luxury bedroom design ideas Indian homes",
    "wardrobe design ideas for bedroom India",
    "bedroom false ceiling design ideas India",
    "couple bedroom interior design Delhi",
    "kids bedroom luxury design ideas India",
    "premium master suite design India",
  ],
  local_seo: [
    "interior designer in Gurgaon for villa",
    "luxury interior design company Noida",
    "best interior designer Dehradun farmhouse",
    "interior design services Delhi NCR reviews",
    "interior designer Udaipur luxury villas",
    "top interior designers Delhi farmhouse",
    "restaurant interior designer Delhi NCR",
    "flat interior design Delhi cost per sqft",
  ],
};

const CATEGORY_MAP = {
  interior_design: "design intelligence",
  villa: "villa & farmhouse",
  farmhouse: "villa & farmhouse",
  restaurant: "hospitality design",
  living_room: "spatial logic",
  bedroom: "bedroom design",
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

// Picsum photo IDs — reliable, free, always loads
const IMAGE_IDS = [
  "1024","1029","1031","1033","1038","1040","1041",
  "1043","1044","1047","1048","1050","1053","1054",
  "1055","1060","1062","1063","1064","1068",
];

function getImageUrl(slug) {
  const index = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % IMAGE_IDS.length;
  return `https://picsum.photos/id/${IMAGE_IDS[index]}/1200/675`;
}

// ─────────────────────────────────────────────
// KEYWORD SELECTOR
// Avoids recently used keywords, ensures category spread
// ─────────────────────────────────────────────
function selectDailyKeywords(memory) {
  const allKeywords = Object.entries(KEYWORD_POOL).flatMap(
    ([category, keywords]) => keywords.map(keyword => ({ keyword, category }))
  );

  // Filter recently used (last 56 = full pool cycle)
  const recentlyUsed = new Set(memory.usedKeywords.slice(-56));
  let available = allKeywords.filter(k => !recentlyUsed.has(k.keyword));

  // If pool exhausted, reset
  if (available.length < 4) {
    console.log("🔄 Keyword pool cycled — resetting usage history");
    available = allKeywords;
    memory.usedKeywords = [];
  }

  // Deterministic-by-date shuffle (Mulberry32-style) — was previously a broken
  // sort comparator that only referenced `a`, not `b`, producing inconsistent ordering.
  const seedStr = new Date().toISOString().split("T")[0];
  let seedNum = 0;
  for (const c of seedStr) seedNum = (seedNum * 31 + c.charCodeAt(0)) >>> 0;
  function rng() {
    seedNum = (seedNum + 0x6D2B79F5) >>> 0;
    let t = seedNum;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  const seeded = [...available];
  for (let i = seeded.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
  }

  // Pick 4 from different categories
  const selected = [];
  const usedCategories = new Set();

  for (const item of seeded) {
    if (selected.length >= 4) break;
    if (!usedCategories.has(item.category)) {
      selected.push(item);
      usedCategories.add(item.category);
    }
  }

  // If not enough categories, fill remaining slots
  for (const item of seeded) {
    if (selected.length >= 4) break;
    if (!selected.find(s => s.keyword === item.keyword)) {
      selected.push(item);
    }
  }

  console.log("📌 Today's keywords:", selected.map(s => s.keyword));
  return selected;
}

// ─────────────────────────────────────────────
// ANGLE SELECTOR
// Each blog today gets a different angle
// Avoids angles used recently
// ─────────────────────────────────────────────
function selectAnglesForToday(memory) {
  const recentAngles = new Set(memory.lastAngles.slice(-4));
  const available = ANGLES.filter(a => !recentAngles.has(a.id));
  const pool = available.length >= 4 ? available : ANGLES;

  // Shuffle and pick 4
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}



// ─────────────────────────────────────────────
// TITLE UNIQUENESS CHECK (v2)
// Domain-aware — ignores filler/category words that legitimately
// repeat across luxury-interior content (luxury, design, india, delhi, etc.)
// Only rejects on rare-word overlap, which is what actually signals duplication
// ─────────────────────────────────────────────
const STOPWORDS = new Set([
  // English filler
  "the", "and", "for", "with", "your", "you", "are", "this", "that", "from",
  "into", "what", "when", "where", "which", "have", "will", "best", "top",
  // Domain words that repeat across virtually every blog (legitimately)
  "luxury", "design", "designs", "interior", "interiors", "designer", "designers",
  "home", "homes", "house", "houses", "room", "rooms",
  "delhi", "ncr", "gurgaon", "noida", "india", "indian",
  "ideas", "cost", "price", "pricing", "guide", "tips", "trends",
  "style", "styles", "modern", "premium", "high",
  "2024", "2025", "2026",
]);

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

function getRareWords(title) {
  return new Set(
    normalizeTitle(title)
      .split(/\s+/)
      .filter(w => w.length > 3 && !STOPWORDS.has(w))
  );
}

function isTitleUnique(newTitle, existingTitles) {
  const newNorm = normalizeTitle(newTitle);
  if (!newNorm) return false;

  const newRare = getRareWords(newTitle);

  for (const existing of existingTitles) {
    // Exact normalized match → reject
    if (newNorm === normalizeTitle(existing)) return false;

    const exRare = getRareWords(existing);

    // If the new title has no rare words at all, fall back to length-aware check
    if (newRare.size === 0 || exRare.size === 0) continue;

    // Jaccard similarity on RARE words only
    const intersection = [...newRare].filter(w => exRare.has(w)).length;
    const union = new Set([...newRare, ...exRare]).size;
    const similarity = intersection / union;

    // Reject only if rare-word overlap is very high (≥ 0.85)
    // AND at least 3 rare words match (prevents false positives on short titles)
    if (similarity >= 0.85 && intersection >= 3) return false;
  }
  return true;
}

// ─────────────────────────────────────────────
// BLOG GENERATOR
// ─────────────────────────────────────────────
async function generateBlog(keyword, category, angle, cityData, budgetData, attemptNum = 1) {
  const internalLink1 = INTERNAL_LINKS[Math.floor(Math.random() * 3)];
  const internalLink2 = INTERNAL_LINKS[3 + Math.floor(Math.random() * 2)];
  const externalLink1 = EXTERNAL_LINKS[Math.floor(Math.random() * EXTERNAL_LINKS.length)];

  // Semantic keyword variations to avoid stuffing
  const semanticVariations = [
    keyword,
    keyword.replace("cost", "pricing").replace("ideas", "concepts").replace("design", "interior"),
    keyword.split(" ").reverse().join(" "),
  ].filter((v, i, arr) => arr.indexOf(v) === i).slice(0, 2).join(" / ");

  const prompt = `You are a senior interior design writer for indéva studio, Delhi NCR's most awarded luxury design firm.

PRIMARY KEYWORD: "${keyword}"
SEMANTIC VARIATIONS TO USE NATURALLY: ${semanticVariations}
WRITING ANGLE: ${angle.name}
ARTICLE STRUCTURE: ${angle.structure}
INTRODUCTION STYLE: ${angle.intro}
THIS IS ATTEMPT ${attemptNum} — make it completely different from any generic article on this topic.

SPECIFIC CONTEXT TO USE:
- Location: ${cityData.area}, ${cityData.city}
- Property type: ${cityData.property}  
- Budget range: ${budgetData.range} (${budgetData.tier} segment)

WRITING DIRECTIVE:
${angle.instruction}

FORBIDDEN PHRASES (never use these):
"in the realm of", "when it comes to", "it is worth noting", "needless to say",
"at the end of the day", "having said that", "with that in mind", "on the other hand",
"that being said", "first and foremost", "dive into", "delve", "certainly", "absolutely",
"transformative", "holistic", "leverage", "cutting-edge", "seamlessly"

BRAND VOICE:
- Brand name always: indéva studio (lowercase)
- Authoritative but warm — like a trusted expert, not a salesperson
- Indian market fluency: ₹ for prices, reference real Delhi NCR areas
- Grade 7-8 readability — complex ideas in plain language

RESPOND WITH EXACTLY THIS FORMAT — nothing else:
SEO_TITLE: [unique title, 60-65 chars, keyword-first, angle-specific]
META_DESC: [155 chars max, includes keyword, has a hook]
SLUG: [hyphenated-slug-max-8-words]
CATEGORY: [one of: spatial logic / design intelligence / india market / kitchen design / bedroom design / villa & farmhouse / hospitality design / materials / philosophy / process]
EXCERPT: [2 sentences, plain text only, used as card preview on insights page]
CONTENT_SUMMARY: [1 sentence describing main argument — used for deduplication checking]
---ARTICLE---
[HTML body only. No DOCTYPE. No html/head/body tags.
Start directly with <h1>.

STRUCTURE FOR THIS ANGLE (${angle.structure}):
${angle.instruction}

REQUIRED ELEMENTS:
- <h1> containing keyword naturally
- Opening paragraph matching intro style: ${angle.intro}
- 4-5 <h2> sections (headings must be specific to this angle, not generic)
- <h3> subsections where they add value
- <ul> or <ol> with specific, non-generic items
- Cost in ₹ from the budget range: ${budgetData.range}
- Location reference: ${cityData.area}, ${cityData.city}
- This internal link naturally placed: <a href="${internalLink1.url}">${internalLink1.text}</a>
- This internal link naturally placed: <a href="${internalLink2.url}">${internalLink2.text}</a>  
- This external link: <a href="${externalLink1.url}" rel="noopener noreferrer" target="_blank">${externalLink1.text}</a>
- One <blockquote> with a non-obvious insight
- FAQ section: 4 questions using <details><summary> tags — questions must match the angle
- Final paragraph with natural CTA linking to <a href="/#contact">start a project</a>

WORD COUNT: 1500-1900 words
NO MARKDOWN. NO CODE FENCES. PURE HTML ONLY.]
---END---`;

  console.log(`  ✍️  Generating [${angle.name}]: "${keyword}" (attempt ${attemptNum})`);

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75 + Math.random() * 0.2, // 0.75–0.95 for variety
          maxOutputTokens: 8192,                    // ↑ doubled — 4096 was truncating mid-article
        },
      }),
    }
  );

  const data = await response.json();
  if (!response.ok) throw new Error(`Gemini HTTP ${response.status}: ${JSON.stringify(data).slice(0, 300)}`);

  const candidate = data.candidates?.[0];
  if (!candidate) throw new Error(`Gemini returned no candidates. Response: ${JSON.stringify(data).slice(0, 300)}`);

  // Catch silent failures: SAFETY, RECITATION, OTHER, MAX_TOKENS without content
  const finish = candidate.finishReason;
  const text = candidate.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error(`Gemini blocked or empty (finishReason=${finish}). No text returned.`);
  }
  if (finish && finish !== "STOP") {
    console.warn(`  ⚠️  Gemini finishReason=${finish} (not STOP) — content may be incomplete (${text.length} chars)`);
  } else {
    console.log(`  📥 Gemini OK — ${text.length} chars, finishReason=${finish || "STOP"}`);
  }

  return text;
}

// ─────────────────────────────────────────────
// PARSE RESPONSE
// ─────────────────────────────────────────────
function parseBlogResponse(raw, keyword, category, angle) {
  const titleMatch = raw.match(/SEO_TITLE:\s*(.+)/);
  const metaMatch = raw.match(/META_DESC:\s*(.+)/);
  const slugMatch = raw.match(/SLUG:\s*(.+)/);
  const catMatch = raw.match(/CATEGORY:\s*(.+)/);
  const excerptMatch = raw.match(/EXCERPT:\s*([\s\S]+?)(?=CONTENT_SUMMARY:|---ARTICLE---)/);
  const summaryMatch = raw.match(/CONTENT_SUMMARY:\s*(.+)/);
  const articleMatch = raw.match(/---ARTICLE---([\s\S]+?)---END---/);

  // STRICT MODE: fail loudly if Gemini drifted from the format.
  // The old silent fallback to `keyword` is exactly why the same string
  // ("flat interior design delhi cost per sqft") was appearing as a title
  // every day — it wasn't a title, it was the raw keyword leaking through.
  const missing = [];
  if (!titleMatch) missing.push("SEO_TITLE");
  if (!slugMatch) missing.push("SLUG");
  if (!articleMatch) missing.push("---ARTICLE---/---END---");

  if (missing.length > 0) {
    console.warn(`  ⚠️  Parse failure — missing fields: ${missing.join(", ")}`);
    console.warn(`     Response head: ${raw.slice(0, 200).replace(/\n/g, " | ")}`);
    console.warn(`     Response tail: ${raw.slice(-200).replace(/\n/g, " | ")}`);
    throw new Error(`Malformed Gemini output (missing: ${missing.join(", ")})`);
  }

  return {
    title: titleMatch[1].trim(),
    meta: metaMatch ? metaMatch[1].trim() : "",
    slug: slugMatch[1].trim(),
    cat: catMatch ? catMatch[1].trim() : (CATEGORY_MAP[category] || "design intelligence"),
    excerpt: excerptMatch ? excerptMatch[1].trim() : "",
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    article: articleMatch[1].trim(),
    angleId: angle.id,
  };
}

function toSlug(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
    .split("-").slice(0, 8).join("-"); // max 8 words
}

// ─────────────────────────────────────────────
// BUILD INSIGHT PAGE HTML
// ─────────────────────────────────────────────
function buildInsightPage(blogData) {
  const date = new Date().toISOString().split("T")[0];
  const imageUrl = getImageUrl(blogData.slug);
  const monthYear = new Date().toLocaleDateString("en-IN", {
    month: "long", year: "numeric"
  }).toLowerCase();
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
:root{--black:#0a0a0a;--black-2:#111111;--gold:#b89a6a;--gold-dim:#8a7250;--gold-bright:#c9ac7e;--white:#f0ebe3;--white-dim:rgba(240,235,227,0.55);--white-muted:rgba(240,235,227,0.28);--serif:'Cormorant Garamond',Georgia,serif;--sans:'Founders Grotesk',sans-serif;--mono:'DM Mono',monospace;--line:rgba(240,235,227,0.08);--line-gold:rgba(184,154,106,0.2);}
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
.article-image{padding:0 60px;}
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
  <p>our design consultants are available for a complimentary discovery session.</p>
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
// INJECT INTO INSIGHTS PAGE
// ─────────────────────────────────────────────
function injectCardsIntoInsightsPage(newBlogs) {
  const insightsIndexPath = path.join(REPO_ROOT, "insights", "index.html");
  if (!fs.existsSync(insightsIndexPath)) {
    console.log("⚠️  insights/index.html not found");
    return;
  }

  let html = fs.readFileSync(insightsIndexPath, "utf8");

  const newCards = newBlogs.map(blog => {
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

  if (!newCards) return;

  const gridTag = '<div class="blog-grid">';
  if (html.includes(gridTag)) {
    html = html.replace(gridTag, `${gridTag}\n${newCards}`);
    fs.writeFileSync(insightsIndexPath, html);
    console.log(`✅ Injected ${newBlogs.length} cards into insights/index.html`);
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
    .filter(b => !sitemap.includes(`/insights/${b.slug}/`))
    .map(b => `
  <url>
    <loc>https://indevastudio.com/insights/${b.slug}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`).join("");
  if (newEntries) {
    sitemap = sitemap.replace("</urlset>", `${newEntries}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemap);
    console.log("🗺️  Sitemap updated");
  }
}

// ─────────────────────────────────────────────
// PING SEARCH ENGINES (IndexNow protocol)
// Note: Google deprecated their ping endpoint in 2023.
// IndexNow covers Bing, Yandex, Naver, Seznam — Google discovers via sitemap.
// Requires INDEXNOW_KEY env var + the same key hosted at /<KEY>.txt on your domain.
// ─────────────────────────────────────────────
async function pingSearchEngines(newBlogs) {
  const key = process.env.INDEXNOW_KEY;
  if (!key) {
    console.log("ℹ️  INDEXNOW_KEY not set — skipping search engine ping");
    return;
  }
  if (newBlogs.length === 0) return;

  const urlList = newBlogs.map(b => `https://indevastudio.com/insights/${b.slug}/`);

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "indevastudio.com",
        key: key,
        keyLocation: `https://indevastudio.com/${key}.txt`,
        urlList: urlList,
      }),
    });
    if (res.ok || res.status === 202) {
      console.log(`📡 IndexNow pinged for ${urlList.length} URLs (status ${res.status})`);
    } else {
      console.log(`⚠️  IndexNow returned ${res.status} — non-critical`);
    }
  } catch (e) {
    console.log("⚠️  IndexNow ping failed — non-critical:", e.message);
  }
}

// ─────────────────────────────────────────────
// MAIN ORCHESTRATOR
// ─────────────────────────────────────────────
async function main() {
  console.log("\n🌟 INDEVA STUDIO — BLOG ENGINE v3");
  console.log("━".repeat(50));
  console.log(`📅 Date: ${new Date().toLocaleDateString("en-IN")}`);

  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not set.");
    process.exit(1);
  }

  // Load memory
  const memory = loadMemory();
  console.log(`📚 Memory: ${memory.titles.length} past titles, ${memory.slugs.length} past slugs, ${memory.usedKeywords.length} used keywords`);
  if (memory.titles.length > 0) {
    console.log(`   Last 3 titles: ${memory.titles.slice(-3).map(t => `"${t}"`).join(", ")}`);
  }
  if (!fs.existsSync(MEMORY_FILE)) {
    console.log(`   ⚠️  Memory file does not exist yet — will be created at: ${MEMORY_FILE}`);
  } else {
    console.log(`   ✓ Memory file exists at: ${MEMORY_FILE}`);
  }

  // Ensure insights folder exists
  const insightsDir = path.join(REPO_ROOT, "insights");
  if (!fs.existsSync(insightsDir)) fs.mkdirSync(insightsDir, { recursive: true });

  // Select today's keywords and angles
  const selections = selectDailyKeywords(memory);
  const angles = selectAnglesForToday(memory);

  console.log(`\n🎯 Selected ${selections.length} keywords for today:`);
  selections.forEach((s, i) => console.log(`   ${i + 1}. [${s.category}] "${s.keyword}"`));
  console.log(`🎨 Selected ${angles.length} angles: ${angles.map(a => a.id).join(", ")}`);
  console.log("");

  // Rotate cities and budgets
  const dayIndex = Math.floor(Date.now() / 86400000);
  const publishedBlogs = [];
  const newTitles = [];
  const newKeywordsUsed = [];
  const newAnglesUsed = [];

  for (let i = 0; i < selections.length; i++) {
    const { keyword, category } = selections[i];
    const angle = angles[i % angles.length];
    const cityData = CITIES[(dayIndex + i) % CITIES.length];
    const budgetData = BUDGETS[(dayIndex + i * 2) % BUDGETS.length];

    console.log(`\n[${i + 1}/4] "${keyword}" → [${angle.name}]`);

    let blogData = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const raw = await generateBlog(keyword, category, angle, cityData, budgetData, attempts);
        const parsed = parseBlogResponse(raw, keyword, category, angle);

        // TITLE UNIQUENESS CHECK
        const allKnownTitles = [...memory.titles, ...newTitles];
        if (!isTitleUnique(parsed.title, allKnownTitles)) {
          console.log(`  ⚠️  Title not unique — regenerating (attempt ${attempts})`);
          if (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000));
            continue;
          } else {
            // Force unique by appending angle to title
            parsed.title = `${parsed.title} — ${angle.name}`;
            parsed.slug = toSlug(parsed.title);
          }
        }

        // SLUG UNIQUENESS CHECK
        if (memory.slugs.includes(parsed.slug)) {
          parsed.slug = `${parsed.slug}-${angle.id}`;
        }

        blogData = parsed;
        blogData.keyword = keyword;
        break;

      } catch (err) {
        console.error(`  ❌ Attempt ${attempts} failed: ${err.message}`);
        if (attempts < maxAttempts) {
          await new Promise(r => setTimeout(r, 3000));
        }
      }
    }

    if (!blogData) {
      console.error(`  ❌ All ${maxAttempts} attempts failed for "${keyword}" — skipping`);
      console.error(`     If this happens repeatedly, check: 1) GEMINI_API_KEY valid, 2) dedup not too strict`);
      continue;
    }

    // Save file
    const slugDir = path.join(insightsDir, blogData.slug);
    if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
    const html = buildInsightPage(blogData);
    fs.writeFileSync(path.join(slugDir, "index.html"), html);

    console.log(`  ✅ Saved: insights/${blogData.slug}/index.html`);
    publishedBlogs.push(blogData);
    newTitles.push(blogData.title);
    newKeywordsUsed.push(keyword);
    newAnglesUsed.push(angle.id);

    if (i < selections.length - 1) await new Promise(r => setTimeout(r, 3000));
  }

  // Update memory
  memory.titles.push(...newTitles);
  memory.slugs.push(...publishedBlogs.map(b => b.slug));
  memory.usedKeywords.push(...newKeywordsUsed);
  memory.summaries.push(...publishedBlogs.map(b => b.summary || ""));
  memory.lastAngles.push(...newAnglesUsed);
  saveMemory(memory);

  if (publishedBlogs.length > 0) {
    injectCardsIntoInsightsPage(publishedBlogs);
    updateSitemap(publishedBlogs);
    await pingSearchEngines(publishedBlogs);
  }

  // Final summary — makes diagnosis instant in workflow logs
  console.log("\n" + "━".repeat(50));
  console.log(`📊 RUN SUMMARY`);
  console.log(`   Selected:  ${selections.length} keywords`);
  console.log(`   Published: ${publishedBlogs.length} insights`);
  console.log(`   Failed:    ${selections.length - publishedBlogs.length}`);
  if (publishedBlogs.length > 0) {
    console.log(`   New slugs:`);
    publishedBlogs.forEach(b => console.log(`     • ${b.slug}`));
  }
  if (publishedBlogs.length < selections.length) {
    console.log(`   ⚠️  Not all keywords produced a blog. Check the per-attempt errors above.`);
  }
  if (publishedBlogs.length === 0) {
    console.log(`   ❌ ZERO blogs published. Workflow will commit nothing.`);
    process.exit(1);  // Fail the workflow so it's visible
  }
  console.log("━".repeat(50));
}

main().catch(console.error);
