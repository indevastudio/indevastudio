/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE v9
 *
 * Generates SEO-optimized luxury interior design blogs using Groq's free API
 * (running Meta's Llama 3.3 70B). Topic-relevant images via Unsplash.
 *
 * v9 CHANGE SUMMARY (structured SEO content engine — South Delhi / Gurgaon
 * focused, see the walkthrough given alongside this file for full detail):
 *   - BLOGS_PER_DAY raised 1 → 4, filled via 4 fixed daily SLOTS instead of
 *     random category selection (see DAILY_SLOTS / selectDailyKeywords()).
 *   - KEYWORD_POOL (flat string arrays) replaced by KEYWORD_DATABASE
 *     (structured objects: keyword/cluster/location/intent/priority/
 *     contentType/targetUrl/canonicalGroup — see PART 2 of the brief).
 *   - Canonical-group cooldown prevents cannibalisation — the same search
 *     intent won't get a second near-duplicate article for 21 days.
 *   - LANDING_PAGE and CASE_STUDY keywords are never auto-blogged.
 *   - Fabricated "real-sounding" client projects / experience-year claims
 *     removed from every angle's prompt instructions.
 *   - Added a quality gate (validateBlog()) that SKIPS a slot rather than
 *     publishing anything that fails basic checks.
 *
 * Required env vars:
 *   GROQ_API_KEY         — get from https://console.groq.com/keys (free, no card)
 *
 * Optional env vars:
 *   GROQ_MODEL           — defaults to openai/gpt-oss-120b
 *   UNSPLASH_ACCESS_KEY  — get from https://unsplash.com/oauth/applications (free,
 *                          50 req/hour). Without it, images fall back to a small
 *                          curated Picsum set (less topic-relevant but still works).
 *   INDEXNOW_KEY         — for Bing/Yandex indexing pings (optional)
 *
 * RATE LIMITS (Groq free tier):
 *   30 RPM · 12,000 TPM · 1,000 RPD
 *   With max_completion_tokens=5500 + ~1500 prompt tokens, one call ≈ 7K TPM.
 *   We sleep 65s between blogs so the rolling-1-minute window resets.
 *
 * SAFETY NOTE FOR HUMANS PASTING THIS FILE:
 * If the very first character of the file is "(" instead of "/",
 * something pasted a `git apply` command into the file. Delete everything
 * and re-paste from a clean source. The file MUST start with the
 * comment block above — nothing else.
 * Also, no line in this file should start with "+" or "-" followed by code.
 * Those are diff markers and indicate corruption.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-120b";
const MEMORY_FILE = path.join(REPO_ROOT, "content", "blog-memory.json");

// How many blogs to publish per run.
// v9: raised from 1 → 4 to support the structured 4-slot SEO content engine
// (South Delhi / Gurgaon / property niche / technical). Each slot is generated
// SEQUENTIALLY (never in parallel) with INTER_BLOG_DELAY_MS between calls —
// see PART 13 rate-limit note below. If your Groq plan is still free-tier,
// confirm 4 sequential calls (~4-5 min run time incl. sleeps) fits your
// workflow's timeout before relying on this in production.
const BLOGS_PER_DAY = 4;

// Delay between blogs (ms). Groq free tier caps at 12K TPM. With output capped
// at 5500 tokens + ~1500 prompt tokens, one call uses ~7K TPM. The TPM window
// is rolling-1-minute, so 65s ensures the previous call's tokens fully expire.
// Kept sequential (not parallel) intentionally — see selectDailyKeywords() and
// the main loop, which run one slot fully (generate → validate → save) before
// starting the next.
const INTER_BLOG_DELAY_MS = 65_000;

// The 4 daily content slots, in order. Slot order matters — it drives which
// cluster each keyword is pulled from (see selectDailyKeywords()).
const DAILY_SLOTS = ["south-delhi", "gurgaon", "property-niche", "technical"];

// SLOT 3 rotates through these property/service niches (PART 1 spec).
const PROPERTY_NICHE_ROTATION = [
  "villa", "farmhouse", "penthouse", "apartment", "office", "renovation", "furniture",
];

// SLOT 4 rotates through these technical/material topics (PART 1 spec).
const TECHNICAL_TOPIC_ROTATION = [
  "plywood", "hdhmr", "laminates", "kitchen", "wardrobe",
  "hardware", "lighting", "flooring", "furniture-construction", "boq", "execution",
];

// ─────────────────────────────────────────────
// MEMORY SYSTEM
// Tracks: used titles, used angles, content summaries
// ─────────────────────────────────────────────
// Default shape for a brand-new memory file. Also used to backfill any
// properties missing from an OLDER memory.json (PART 11 — "if older memory
// files don't contain the new properties, default them safely").
function emptyMemory() {
  return {
    titles: [],
    slugs: [],
    usedKeywords: [],
    summaries: [],
    lastAngles: [],
    // v9 additions — SEO cannibalisation / content-type tracking
    canonicalGroups: [],      // [{ canonicalGroup, lastUsedDate }]
    targetUrls: [],           // targetUrl of every published article
    contentTypes: [],         // contentType of every published article
    searchIntents: [],        // intent of every published article
    lastUsedDate: {},         // { [canonicalGroup]: 'YYYY-MM-DD' }
    lastLocations: [],        // recent location values, for slot-diversity checks
  };
}

function loadMemory() {
  if (!fs.existsSync(MEMORY_FILE)) return emptyMemory();
  try {
    const loaded = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
    // Backfill any field an older memory.json won't have. Never drop existing data.
    return { ...emptyMemory(), ...loaded };
  } catch (_) {
    return emptyMemory();
  }
}

function saveMemory(memory) {
  fs.mkdirSync(path.dirname(MEMORY_FILE), { recursive: true });
  // Keep only last N entries to avoid unbounded file growth
  memory.titles = memory.titles.slice(-300);
  memory.slugs = memory.slugs.slice(-300);
  memory.summaries = memory.summaries.slice(-300);
  memory.usedKeywords = memory.usedKeywords.slice(-300);
  memory.lastAngles = memory.lastAngles.slice(-40);
  memory.canonicalGroups = memory.canonicalGroups.slice(-300);
  memory.targetUrls = (memory.targetUrls || []).slice(-300);
  memory.contentTypes = (memory.contentTypes || []).slice(-300);
  memory.searchIntents = (memory.searchIntents || []).slice(-300);
  memory.lastLocations = (memory.lastLocations || []).slice(-40);
  fs.writeFileSync(MEMORY_FILE, JSON.stringify(memory, null, 2));
}

// ─────────────────────────────────────────────
// CONTENT ANGLES — 6 distinct approaches
// Each blog gets a different angle to ensure
// content is different even for same keyword
// ─────────────────────────────────────────────
// v9 CHANGE (PART 6 / PART 10 / PART 14): the old "case-study" angle asked the
// model to write a "real-sounding client project" — i.e. present a fabricated
// project as if it were a real Indéva job. That is removed entirely. Angles
// that reference example projects now explicitly require the model to label
// them as hypothetical. The "15 years experience" claim is also removed since
// it isn't a verified fact about the studio.
//
// Each angle now carries an `intents` array so selectAnglesForToday() can pick
// angles that actually fit the keyword's search intent (PART 10):
//   commercial   → cost-guide, step-by-step (hiring/process)
//   informational → mistakes-avoid, expert-insights, design-ideas
//   technical    → material-comparison, step-by-step
const ANGLES = [
  {
    id: "cost-guide",
    name: "Cost & Budget Guide",
    structure: "Guide format",
    intro: "Data-driven with cost anchors",
    intents: ["commercial", "technical"],
    instruction: `Write as a DEFINITIVE COST GUIDE.
    Structure: Start with the biggest cost misconception in India.
    H2s must cover: what drives costs up, cost breakdown by room,
    how to negotiate, red flags that inflate bills.
    If a budget example is useful, present it as a clearly labeled
    "ILLUSTRATIVE BUDGET" (not a real named project) with a realistic range, not a fabricated exact invoice.
    Tone: Financial advisor meets design expert. Specific ₹ figures throughout.
    Opening: Start with a surprising cost statistic or common pricing myth.`,
  },
  {
    id: "mistakes-avoid",
    name: "Mistakes to Avoid",
    structure: "Warning/listicle format",
    intro: "Problem-aware opening",
    intents: ["informational", "commercial"],
    instruction: `Write as a WARNING GUIDE exposing costly mistakes.
    Structure: Open by naming the pattern of mistake this topic invites — describe
    it generally (e.g. "many first-time villa clients...") rather than inventing a
    specific client story presented as real. If an example clarifies a point, label
    it explicitly as a "HYPOTHETICAL EXAMPLE".
    H2s must be mistakes, each with: what goes wrong, why it happens, exact fix.
    Tone: Experienced designer who has seen these patterns repeatedly.
    Every section must feel like hard-won wisdom, not generic advice.`,
  },
  {
    id: "expert-insights",
    name: "Expert Perspective",
    structure: "Narrative/opinion format",
    intro: "Grounded expert opinion",
    intents: ["informational"],
    instruction: `Write as a GROUNDED EXPERT OPINION piece.
    Structure: Take a considered, slightly contrarian position on the topic.
    H2s must challenge a common assumption about this topic in India.
    Tone: A senior designer speaking candidly — do not claim a specific number
    of years of experience or any unverified credential.
    Opening: Start with a clear, direct statement most designers gloss over.
    Include at least one counterintuitive insight specific to Indian homes/clients.`,
  },
  {
    id: "step-by-step",
    name: "Step-by-Step Process",
    structure: "Sequential how-to format",
    intro: "Question-based opening",
    intents: ["commercial", "technical"],
    instruction: `Write as a PRACTICAL STEP-BY-STEP PROCESS guide.
    Structure: Open with the question clients ask most about this topic.
    H2s must be numbered steps (Step 1, Step 2, etc.) in logical sequence.
    Tone: Patient teacher explaining to a first-time client.
    Each step must include: what to do, what to ask your designer, common pitfall.
    Opening: Start with "Most people approach [topic] backwards. Here is the right sequence."`,
  },
  {
    id: "material-comparison",
    name: "Material / Specification Comparison",
    structure: "Comparison format",
    intro: "Direct technical opening",
    intents: ["technical"],
    instruction: `Write as a TECHNICAL MATERIAL COMPARISON guide.
    Structure: Open by stating plainly what the two (or more) options actually are.
    H2s must cover: material properties, cost difference, durability/moisture/termite
    behaviour where relevant, where each option makes sense, what Indéva studio
    specifies by default and why.
    Tone: Technical but readable — a site engineer explaining to a client, not a
    catalogue. Avoid fabricated lab statistics or invented certification numbers;
    use general, well-known material properties instead.
    Opening: Start by correcting the most common misconception about this comparison.`,
  },
  {
    id: "design-ideas",
    name: "Design Ideas & Inspiration",
    structure: "Inspirational listicle",
    intro: "Vivid visual description opening",
    intents: ["informational"],
    instruction: `Write as a CURATED DESIGN IDEAS piece with strong visual language.
    Structure: Open by describing a specific beautiful space in detail (a
    composite/illustrative scene, not a claimed real project).
    H2s must be distinct design directions/styles for this topic.
    Tone: Design magazine editor — aspirational but grounded in Indian reality.
    Each idea section must include: visual description, materials, cost range, who it suits.
    Reference specific Indian aesthetics, materials, or cultural elements.`,
  },
];

// ─────────────────────────────────────────────
// LOCALITY DATA
// Keyword-driven replacement for the old random CITIES rotation (PART 9).
// Each keyword's `location` field maps to one of these — the scenario used in
// the generation prompt (city/area/property) is now DERIVED from the keyword
// being written about, not picked at random. Noida/Sonipat/Dehradun/Udaipur
// are intentionally NOT included here — PART 9 says stop rotating into
// markets the keyword doesn't belong to. Sonipat/Noida keywords still exist
// in the OLD deployed posts (see blogs.config.js) and remain live; this file
// simply stops generating new ones.
// ─────────────────────────────────────────────
const LOCALITY_DATA = {
  "South Delhi":                { city: "Delhi",   area: "South Delhi",                    property: "independent bungalow" },
  "Vasant Vihar":                { city: "Delhi",   area: "Vasant Vihar",                   property: "independent bungalow" },
  "Greater Kailash":             { city: "Delhi",   area: "Greater Kailash",                property: "duplex" },
  "Defence Colony":              { city: "Delhi",   area: "Defence Colony",                 property: "independent floor" },
  "Panchsheel Park":             { city: "Delhi",   area: "Panchsheel Park",                property: "independent bungalow" },
  "Hauz Khas":                   { city: "Delhi",   area: "Hauz Khas",                      property: "duplex" },
  "Maharani Bagh":               { city: "Delhi",   area: "Maharani Bagh",                  property: "independent bungalow" },
  "Friends Colony":              { city: "Delhi",   area: "Friends Colony",                 property: "independent bungalow" },
  "Vasant Kunj":                 { city: "Delhi",   area: "Vasant Kunj",                    property: "DDA residence" },
  "Sainik Farms":                { city: "Delhi",   area: "Sainik Farms",                   property: "farmhouse" },
  "Gurgaon":                     { city: "Gurgaon", area: "Gurgaon",                        property: "luxury apartment" },
  "DLF Gurgaon":                 { city: "Gurgaon", area: "DLF Phase 5",                    property: "luxury apartment" },
  "Golf Course Road":            { city: "Gurgaon", area: "Golf Course Road",               property: "villa" },
  "Golf Course Extension Road":  { city: "Gurgaon", area: "Golf Course Extension Road",     property: "villa" },
  "Sohna Road":                  { city: "Gurgaon", area: "Sohna Road",                     property: "farmhouse" },
  "New Gurgaon":                 { city: "Gurgaon", area: "New Gurgaon",                    property: "apartment" },
};

// Budget ranges to rotate through
const BUDGETS = [
  { range: "₹15–25 lakh", tier: "mid-luxury" },
  { range: "₹40–80 lakh", tier: "premium" },
  { range: "₹1–3 crore", tier: "ultra-luxury" },
  { range: "₹8–15 lakh", tier: "aspirational" },
  { range: "₹25–50 lakh", tier: "high-end" },
];

// ─────────────────────────────────────────────
// KEYWORD DATABASE (PART 2)
// ─────────────────────────────────────────────
// Replaces the old flat KEYWORD_POOL (string arrays with no metadata).
//
// Rather than hand-writing ~250 near-duplicate objects, we define CLUSTERS —
// each cluster shares one canonicalGroup, location, intent, contentType,
// priority, targetUrl, and site `category` (used for image search + display
// category) — and each cluster lists its raw keyword variants. The database
// is flattened from clusters at module load, so every individual keyword
// still ends up as its own { keyword, cluster, location, intent, priority,
// contentType, targetUrl, canonicalGroup, category, niche?, techTopic? }
// object, exactly per spec — clusters are just how we avoid repeating the
// same 7 metadata fields 250 times.
//
// contentType legend (PART 4):
//   LANDING_PAGE — high-intent commercial "hub" search. NOT auto-blogged —
//                  these should become a real static page (see proposedLandingUrl
//                  below). Auto-generating a blog for these would compete with
//                  the page you actually want to rank.
//   SERVICE_PAGE — specific service (villa/farmhouse/penthouse/commercial).
//                  Auto-generated as a support/informational article.
//   BLOG         — informational/evergreen guide. Always auto-generated.
//   LOCATION_PAGE— locality-specific. Auto-generated as a short local guide,
//                  capped to ONE live article per locality (see PART 3).
//   CASE_STUDY   — NOT used by the generator at all (PART 6/15 — no verified
//                  project data exists to write a real case study from).
//
// `targetUrl` = a route that ALREADY EXISTS on indevastudio.com today
// (confirmed from the repo: /delhi, /gurgaon, /#services, /#contact, /#about,
// /#projects). Generated articles link to these.
// `proposedLandingUrl` = the SEO-recommended future URL for that canonical
// group (e.g. /interior-designer-south-delhi). These do NOT exist yet — do
// not link to them and do not treat them as live. Build the real page first,
// then flip LANDING_PAGE clusters into auto-generation and point targetUrl
// at the new page. (Flagged in the summary as something to confirm with you.)
// ─────────────────────────────────────────────

function cluster(def) {
  return def.keywords.map(keyword => ({
    keyword,
    cluster: def.cluster,
    location: def.location,
    intent: def.intent,
    priority: def.priority,
    contentType: def.contentType,
    targetUrl: def.targetUrl,
    proposedLandingUrl: def.proposedLandingUrl || null,
    canonicalGroup: def.canonicalGroup,
    category: def.category,
    niche: def.niche || null,       // matches PROPERTY_NICHE_ROTATION, for SLOT 3
    techTopic: def.techTopic || null, // matches TECHNICAL_TOPIC_ROTATION, for SLOT 4
  }));
}

// Helper for the 8 South Delhi + 5 Gurgaon locality clusters, which all share
// the same shape (LOCATION_PAGE, one canonical group per locality).
function localityClusters(localities, cityLabel, categoryId, keywordsFn) {
  return localities.flatMap(name => cluster({
    cluster: `${categoryId}-locality-${name.toLowerCase().replace(/\s+/g, "-")}`,
    canonicalGroup: `locality-${name.toLowerCase().replace(/\s+/g, "-")}`,
    location: name,
    intent: "commercial",
    priority: "C",
    contentType: "LOCATION_PAGE",
    targetUrl: categoryId === "south_delhi" ? "/delhi" : "/gurgaon",
    proposedLandingUrl: null,
    category: categoryId,
    keywords: keywordsFn(name),
  }));
}

const KEYWORD_DATABASE = [
  // ============================================================
  // SOUTH DELHI
  // ============================================================
  ...cluster({
    cluster: "south-delhi-core",
    canonicalGroup: "south-delhi-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "A",
    contentType: "LANDING_PAGE",
    targetUrl: "/delhi",
    proposedLandingUrl: "/interior-designer-south-delhi",
    category: "south_delhi",
    keywords: [
      "interior designer South Delhi", "interior designer in South Delhi",
      "interior designers South Delhi", "interior design company South Delhi",
      "interior design firm South Delhi", "interior design studio South Delhi",
      "luxury interior designer South Delhi", "residential interior designer South Delhi",
      "home interior designer South Delhi", "best interior designer South Delhi",
      "top interior designers South Delhi", "turnkey interior designer South Delhi",
      "interior design services South Delhi", "interior company South Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-cost",
    canonicalGroup: "south-delhi-interior-cost-guide",
    location: "South Delhi", intent: "commercial", priority: "B",
    contentType: "BLOG", targetUrl: "/delhi", category: "south_delhi",
    keywords: [
      "interior design cost South Delhi", "interior designer cost South Delhi",
      "interior design cost per sq ft South Delhi", "2 BHK interior cost South Delhi",
      "3 BHK interior cost South Delhi", "4 BHK interior cost South Delhi",
      "luxury interior design cost South Delhi", "turnkey interior cost South Delhi",
      "home renovation cost South Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-villa",
    canonicalGroup: "south-delhi-villa-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "A", niche: "villa",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi",
    proposedLandingUrl: "/interior-designer-south-delhi", category: "south_delhi",
    keywords: [
      "villa interior designer South Delhi", "villa interior design South Delhi",
      "luxury villa interior designer South Delhi", "modern villa interior designer South Delhi",
      "villa renovation South Delhi", "villa interior cost South Delhi",
      "villa furniture design South Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-farmhouse",
    canonicalGroup: "south-delhi-farmhouse-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "A", niche: "farmhouse",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi",
    proposedLandingUrl: "/interior-designer-south-delhi", category: "south_delhi",
    keywords: [
      "farmhouse interior designer South Delhi", "farmhouse interior design South Delhi",
      "farmhouse interior designer Delhi", "luxury farmhouse interior designer Delhi",
      "farmhouse renovation South Delhi", "farmhouse interior cost South Delhi",
      "farmhouse furniture design Delhi", "farmhouse architecture and interior design Delhi",
      "farmhouse interior designer Sainik Farms", "farmhouse interior design Sainik Farms",
      "farmhouse renovation Sainik Farms",
    ],
  }),
  // ============================================================
  // DELHI (city-wide — distinct from South Delhi above)
  // NEW (2026-09) — audit found ZERO Delhi-wide, Delhi NCR, or Noida coverage in
  // this file; every existing Delhi-side keyword was South-Delhi-specific. Both
  // clusters below target /delhi (the same real landing page South Delhi keywords
  // already target) — this is intentional, not cannibalisation: Indéva has one
  // Delhi page, and "interior designer Delhi" / "interior designer South Delhi"
  // are different real query strings for the same authoritative destination.
  // ============================================================
  ...cluster({
    cluster: "delhi-core",
    canonicalGroup: "delhi-interior-designer",
    location: "Delhi", intent: "commercial", priority: "A",
    contentType: "LANDING_PAGE", targetUrl: "/delhi",
    proposedLandingUrl: "/delhi", category: "delhi",
    keywords: [
      "interior designer Delhi", "interior designers Delhi", "interior design company Delhi",
      "interior design firm Delhi", "interior design studio Delhi", "luxury interior designer Delhi",
      "residential interior designer Delhi", "home interior designer Delhi",
      "best interior designer Delhi", "top interior designers Delhi",
      "turnkey interior designer Delhi",
      "interior decorator Delhi", "interior design consultant Delhi",
    ],
  }),
  ...cluster({
    cluster: "delhi-property",
    canonicalGroup: "delhi-property-interior-designer",
    location: "Delhi", intent: "commercial", priority: "A",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi",
    proposedLandingUrl: "/delhi", category: "delhi",
    keywords: [
      "villa interior designer Delhi",
      "builder floor interior designer Delhi", "apartment interior designer Delhi",
      "bungalow interior designer Delhi", "penthouse interior designer Delhi",
      "duplex interior designer Delhi", "independent house interior designer Delhi",
    ],
  }),
  ...cluster({
    cluster: "delhi-cost",
    canonicalGroup: "delhi-interior-cost-guide",
    location: "Delhi", intent: "commercial", priority: "A",
    contentType: "BLOG", targetUrl: "/delhi", category: "delhi",
    keywords: [
      "interior design cost Delhi", "interior designer cost Delhi",
      "interior design cost per sq ft Delhi", "interior design price Delhi",
      "interior designer fees Delhi", "interior designer charges Delhi",
      "home interior cost Delhi", "luxury interior design cost Delhi",
      "2 BHK interior cost Delhi", "3 BHK interior cost Delhi", "4 BHK interior cost Delhi",
      "5 BHK interior cost Delhi", "builder floor interior cost Delhi",
      "renovation cost Delhi",
    ],
  }),
  ...cluster({
    cluster: "delhi-commercial",
    canonicalGroup: "delhi-commercial-interior-designer",
    location: "Delhi", intent: "commercial", priority: "B", niche: "office",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi", category: "commercial",
    keywords: [
      "office interior designer Delhi", "office interior design Delhi",
      "commercial interior designer Delhi", "corporate interior designer Delhi",
      "retail interior designer Delhi", "showroom interior designer Delhi",
      "restaurant interior designer Delhi", "cafe interior designer Delhi",
      "hospitality interior designer Delhi",
    ],
  }),
  ...cluster({
    cluster: "delhi-ncr-generic",
    canonicalGroup: "delhi-ncr-interior-designer",
    location: "Delhi NCR", intent: "commercial", priority: "B",
    contentType: "LANDING_PAGE", targetUrl: "/", category: "delhi_ncr",
    keywords: [
      "interior designer Delhi NCR", "interior design company Delhi NCR",
      "luxury interior designer Delhi NCR", "interior design and execution Delhi NCR",
    ],
  }),

  // ============================================================
  // NOIDA — NEW (2026-09), previously zero coverage despite an existing /noida page
  // ============================================================
  ...cluster({
    cluster: "noida-core",
    canonicalGroup: "noida-interior-designer",
    location: "Noida", intent: "commercial", priority: "A",
    contentType: "LANDING_PAGE", targetUrl: "/noida",
    proposedLandingUrl: "/noida", category: "noida",
    keywords: [
      "interior designer Noida", "interior designers Noida", "interior design company Noida",
      "interior design firm Noida", "luxury interior designer Noida",
      "residential interior designer Noida", "home interior designer Noida",
      "best interior designer Noida", "turnkey interior designer Noida",
      "interior designer Noida Extension", "interior designer Greater Noida",
    ],
  }),
  ...cluster({
    cluster: "noida-cost",
    canonicalGroup: "noida-interior-cost-guide",
    location: "Noida", intent: "commercial", priority: "B",
    contentType: "BLOG", targetUrl: "/noida", category: "noida",
    keywords: [
      "interior design cost Noida", "interior designer cost Noida",
      "2 BHK interior cost Noida", "3 BHK interior cost Noida", "4 BHK interior cost Noida",
      "flat interior design cost Noida",
    ],
  }),

  ...localityClusters(
    ["Vasant Vihar", "Greater Kailash", "Defence Colony", "Panchsheel Park", "Hauz Khas", "Maharani Bagh", "Friends Colony", "Vasant Kunj"],
    "South Delhi", "south_delhi",
    name => [
      `interior designer ${name}`, `luxury interior designer ${name}`,
      `residential interior designer ${name}`, `home interior designer ${name}`,
    ],
  ),
  // NEW (2026-09) — property-type and hiring-intent gaps found in a keyword audit.
  // Builder floor / DDA apartment / bungalow renovation match real South Delhi
  // housing stock (see LOCALITY_DATA property types above) and, for DDA apartment
  // specifically, two real completed projects (/projects/vasant-kunj/,
  // /projects/dda-apartment/). Kept to property-type and hiring-intent variants only —
  // deliberately NOT more "avoid mistakes in [locality]" pages or new micro-localities
  // beyond Vasant Kunj, which already has genuine project evidence.
  ...cluster({
    cluster: "south-delhi-builder-floor",
    canonicalGroup: "south-delhi-builder-floor-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "A", niche: "builder-floor",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi",
    proposedLandingUrl: "/interior-designer-south-delhi", category: "south_delhi",
    keywords: [
      "builder floor interior designer South Delhi", "builder floor interior design South Delhi",
      "independent floor interior designer South Delhi", "builder floor renovation South Delhi",
      "builder floor interior cost South Delhi", "3 floor builder house interior South Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-dda-apartment",
    canonicalGroup: "south-delhi-dda-apartment-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "A", niche: "dda-apartment",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi",
    proposedLandingUrl: "/interior-designer-south-delhi", category: "south_delhi",
    keywords: [
      "DDA flat interior designer Delhi", "DDA apartment interior design Delhi",
      "DDA flat renovation Delhi", "DDA apartment interior cost Delhi",
      "government housing interior designer Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-bungalow-renovation",
    canonicalGroup: "south-delhi-bungalow-renovation",
    location: "South Delhi", intent: "commercial", priority: "B", niche: "bungalow",
    contentType: "BLOG", targetUrl: "/delhi", category: "south_delhi",
    keywords: [
      "bungalow renovation South Delhi", "independent bungalow interior designer South Delhi",
      "bungalow interior design cost South Delhi", "old bungalow renovation Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-kitchen-wardrobe",
    canonicalGroup: "south-delhi-kitchen-wardrobe-material",
    location: "South Delhi", intent: "commercial", priority: "B",
    contentType: "BLOG", targetUrl: "/delhi", category: "south_delhi",
    keywords: [
      "modular kitchen designer South Delhi", "modular kitchen cost South Delhi",
      "wardrobe design South Delhi", "wardrobe cost South Delhi",
    ],
  }),
  ...cluster({
    cluster: "south-delhi-bhk-hiring",
    canonicalGroup: "south-delhi-bhk-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "A",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi", category: "south_delhi",
    keywords: [
      "2 BHK interior designer South Delhi", "3 BHK interior designer South Delhi",
      "4 BHK interior designer South Delhi", "1 BHK interior designer South Delhi",
    ],
  }),

  // ============================================================
  // GURGAON
  // ============================================================
  ...cluster({
    cluster: "gurgaon-core",
    canonicalGroup: "gurgaon-interior-designer",
    location: "Gurgaon", intent: "commercial", priority: "A",
    contentType: "LANDING_PAGE",
    targetUrl: "/gurgaon", proposedLandingUrl: "/interior-designer-gurgaon",
    category: "gurgaon",
    keywords: [
      "interior designer Gurgaon", "interior designer in Gurgaon", "interior designers Gurgaon",
      "interior designer Gurugram", "interior design company Gurgaon", "interior design firm Gurgaon",
      "interior design studio Gurgaon", "luxury interior designer Gurgaon",
      "residential interior designer Gurgaon", "home interior designer Gurgaon",
      "best interior designer Gurgaon", "top interior designers Gurgaon",
      "turnkey interior designer Gurgaon", "interior design and execution Gurgaon",
    ],
  }),
  ...cluster({
    cluster: "gurgaon-villa",
    canonicalGroup: "gurgaon-villa-interior-designer",
    location: "Gurgaon", intent: "commercial", priority: "A", niche: "villa",
    contentType: "SERVICE_PAGE", targetUrl: "/gurgaon",
    proposedLandingUrl: "/interior-designer-gurgaon", category: "gurgaon",
    keywords: [
      "villa interior designer Gurgaon", "villa interior design Gurgaon",
      "luxury villa interior designer Gurgaon", "modern villa interior designer Gurgaon",
      "villa renovation Gurgaon", "villa interior cost Gurgaon", "villa furniture design Gurgaon",
    ],
  }),
  ...cluster({
    cluster: "gurgaon-farmhouse",
    canonicalGroup: "gurgaon-farmhouse-interior-designer",
    location: "Gurgaon", intent: "commercial", priority: "A", niche: "farmhouse",
    contentType: "SERVICE_PAGE", targetUrl: "/gurgaon",
    proposedLandingUrl: "/interior-designer-gurgaon", category: "gurgaon",
    keywords: [
      "farmhouse interior designer Gurgaon", "farmhouse interior design Gurgaon",
      "luxury farmhouse interior designer Gurgaon", "farmhouse renovation Gurgaon",
      "farmhouse interior cost Gurgaon", "farmhouse furniture design Gurgaon",
      "farmhouse design and execution Gurgaon",
    ],
  }),
  ...cluster({
    cluster: "gurgaon-penthouse",
    canonicalGroup: "gurgaon-penthouse-interior-designer",
    location: "Gurgaon", intent: "commercial", priority: "A", niche: "penthouse",
    contentType: "SERVICE_PAGE", targetUrl: "/gurgaon",
    proposedLandingUrl: "/interior-designer-gurgaon", category: "gurgaon",
    keywords: [
      "penthouse interior designer Gurgaon", "penthouse interior design Gurgaon",
      "luxury penthouse interior designer Gurgaon", "penthouse renovation Gurgaon",
      "penthouse interior cost Gurgaon", "penthouse furniture design Gurgaon",
    ],
  }),
  ...cluster({
    cluster: "gurgaon-cost",
    canonicalGroup: "gurgaon-interior-cost-guide",
    location: "Gurgaon", intent: "commercial", priority: "B",
    contentType: "BLOG", targetUrl: "/gurgaon", category: "gurgaon",
    keywords: [
      "interior design cost Gurgaon", "interior designer cost Gurgaon",
      "interior design cost per sq ft Gurgaon", "2 BHK interior cost Gurgaon",
      "3 BHK interior cost Gurgaon", "4 BHK interior cost Gurgaon",
      "villa interior cost Gurgaon", "farmhouse interior cost Gurgaon",
      "penthouse interior cost Gurgaon", "turnkey interior cost Gurgaon",
    ],
  }),
  ...localityClusters(
    ["DLF Gurgaon", "Golf Course Road", "Golf Course Extension Road", "Sohna Road", "New Gurgaon"],
    "Gurgaon", "gurgaon",
    name => [
      `interior designer ${name}`, `luxury interior designer ${name}`,
      `residential interior designer ${name}`, `villa interior designer ${name}`,
    ],
  ),

  // ============================================================
  // COMMERCIAL (South Delhi + Gurgaon) — niche: "office"
  // ============================================================
  ...cluster({
    cluster: "commercial-south-delhi",
    canonicalGroup: "south-delhi-commercial-interior-designer",
    location: "South Delhi", intent: "commercial", priority: "B", niche: "office",
    contentType: "SERVICE_PAGE", targetUrl: "/delhi", category: "commercial",
    keywords: [
      "office interior designer South Delhi", "commercial interior designer South Delhi",
      "corporate interior designer South Delhi", "retail interior designer South Delhi",
      "showroom interior designer South Delhi", "restaurant interior designer South Delhi",
      "cafe interior designer South Delhi",
    ],
  }),
  ...cluster({
    cluster: "commercial-gurgaon",
    canonicalGroup: "gurgaon-commercial-interior-designer",
    location: "Gurgaon", intent: "commercial", priority: "B", niche: "office",
    contentType: "SERVICE_PAGE", targetUrl: "/gurgaon", category: "commercial",
    keywords: [
      "office interior designer Gurgaon", "commercial interior designer Gurgaon",
      "corporate interior designer Gurgaon", "retail interior designer Gurgaon",
      "showroom interior designer Gurgaon", "restaurant interior designer Gurgaon",
      "cafe interior designer Gurgaon",
    ],
  }),

  // ============================================================
  // FURNITURE / EXECUTION — niche: "furniture" / "renovation"
  // ============================================================
  ...cluster({
    cluster: "furniture-custom",
    canonicalGroup: "custom-furniture-delhi-ncr",
    location: "Delhi NCR", intent: "commercial", priority: "B", niche: "furniture",
    contentType: "BLOG", targetUrl: "/#services", category: "furniture",
    keywords: [
      "custom furniture Delhi", "custom furniture Gurgaon", "bespoke furniture Delhi",
      "luxury furniture Delhi", "custom furniture manufacturer Delhi",
      "custom wardrobe Gurgaon", "custom wardrobe South Delhi", "luxury wardrobe design Gurgaon",
    ],
  }),
  ...cluster({
    cluster: "turnkey-execution",
    canonicalGroup: "turnkey-interior-execution-delhi-ncr",
    location: "Delhi NCR", intent: "commercial", priority: "B", niche: "renovation",
    contentType: "BLOG", targetUrl: "/#about", category: "renovation",
    keywords: [
      "turnkey interior design Delhi", "turnkey interior design Gurgaon",
      "interior design and execution Delhi", "interior execution company Delhi",
      "interior execution company Gurgaon", "interior renovation company Delhi",
      "interior renovation company Gurgaon",
    ],
  }),

  // ============================================================
  // MATERIAL / TECHNICAL — SLOT 4 pool
  // techTopic values map to TECHNICAL_TOPIC_ROTATION.
  // NOTE (flag for you): the brief supplied source keywords for plywood,
  // hdhmr, laminates, kitchen, wardrobe and hardware only. No keywords were
  // given for lighting / flooring / furniture-construction / boq / execution,
  // so a small starter set is added for those five so SLOT 4's rotation
  // doesn't stall on empty topics — expand these before leaning on them.
  // ============================================================
  ...cluster({
    cluster: "material-plywood",
    canonicalGroup: "plywood-material-guide",
    location: "Delhi NCR", intent: "technical", priority: "B", techTopic: "plywood",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["best plywood for kitchen", "BWP plywood for kitchen", "best plywood for wardrobe", "best plywood brands India"],
  }),
  ...cluster({
    cluster: "material-hdhmr",
    canonicalGroup: "hdhmr-vs-plywood-comparison",
    location: "Delhi NCR", intent: "technical", priority: "B", techTopic: "hdhmr",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["HDHMR vs plywood kitchen", "HDHMR vs marine plywood", "HDHMR vs plywood wardrobe", "MDF vs HDHMR", "plywood vs HDHMR"],
  }),
  ...cluster({
    cluster: "material-laminates",
    canonicalGroup: "laminate-veneer-comparison-guide",
    location: "Delhi NCR", intent: "technical", priority: "B", techTopic: "laminates",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["best laminate brands India", "veneer vs laminate interiors", "PU polish vs laminate", "acrylic vs laminate kitchen"],
  }),
  ...cluster({
    cluster: "material-kitchen",
    canonicalGroup: "kitchen-material-cost-guide",
    location: "Delhi NCR", intent: "technical", priority: "B", techTopic: "kitchen",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["best material for kitchen cabinets", "kitchen cabinet material comparison", "modular kitchen cost Delhi", "modular kitchen cost Gurgaon", "kitchen interior cost Delhi", "kitchen interior cost Gurgaon"],
  }),
  ...cluster({
    cluster: "material-wardrobe",
    canonicalGroup: "wardrobe-material-cost-guide",
    location: "Delhi NCR", intent: "technical", priority: "B", techTopic: "wardrobe",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["wardrobe material comparison", "wardrobe cost Delhi", "wardrobe cost Gurgaon", "custom wardrobe cost Gurgaon", "custom wardrobe cost Delhi"],
  }),
  ...cluster({
    cluster: "material-hardware",
    canonicalGroup: "interior-hardware-fittings-guide",
    location: "Delhi NCR", intent: "technical", priority: "C", techTopic: "hardware",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["best hardware brands for interiors", "soft close hinges comparison", "drawer channel brands India"],
  }),
  ...cluster({
    // Starter set — no source keywords supplied, see NOTE above.
    cluster: "material-lighting",
    canonicalGroup: "interior-lighting-design-guide",
    location: "Delhi NCR", intent: "technical", priority: "C", techTopic: "lighting",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["layered lighting design for Indian homes", "false ceiling lighting design ideas"],
  }),
  ...cluster({
    cluster: "material-flooring",
    canonicalGroup: "interior-flooring-material-guide",
    location: "Delhi NCR", intent: "technical", priority: "C", techTopic: "flooring",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["best flooring material for Indian homes", "marble vs tile flooring cost"],
  }),
  ...cluster({
    cluster: "material-furniture-construction",
    canonicalGroup: "custom-furniture-construction-guide",
    location: "Delhi NCR", intent: "technical", priority: "C", techTopic: "furniture-construction",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["how custom furniture is made", "carcass construction explained"],
  }),
  ...cluster({
    cluster: "material-boq",
    canonicalGroup: "interior-boq-guide",
    location: "Delhi NCR", intent: "technical", priority: "C", techTopic: "boq",
    contentType: "BLOG", targetUrl: "/#services", category: "technical",
    keywords: ["how to read an interior design BOQ", "interior BOQ vs quotation"],
  }),
  ...cluster({
    cluster: "material-execution",
    canonicalGroup: "interior-execution-process-guide",
    location: "Delhi NCR", intent: "technical", priority: "C", techTopic: "execution",
    contentType: "BLOG", targetUrl: "/#about", category: "technical",
    keywords: ["interior execution timeline India", "site supervision during interior execution"],
  }),
];

// Display category text (was CATEGORY_MAP, keyed by category id instead of
// old KEYWORD_POOL keys — used for the "cat" badge shown on each article).
const CATEGORY_MAP = {
  south_delhi: "south delhi",
  gurgaon: "gurgaon",
  commercial: "commercial design",
  furniture: "materials",
  renovation: "process",
  technical: "materials",
};

const INTERNAL_LINKS = [
  { text: "our portfolio", url: "/#projects" },
  { text: "our services", url: "/#services" },
  { text: "contact us for a free consultation", url: "/#contact" },
  { text: "our design process", url: "/#about" },
  { text: "get in touch with our designers", url: "/#contact" },
  { text: "interior design in south delhi", url: "/delhi" },
  { text: "interior design in gurgaon", url: "/gurgaon" },
];

const EXTERNAL_LINKS = [
  { text: "architectural digest india", url: "https://www.architecturaldigest.in" },
  { text: "elle decor india", url: "https://www.elledecor.com/in" },
  { text: "indian green building council", url: "https://igbc.in" },
  { text: "national institute of design", url: "https://www.nid.edu" },
  { text: "houzz india", url: "https://www.houzz.in" },
];

// ─────────────────────────────────────────────
// IMAGE SOURCING (topic-aware)
//
// Primary: Unsplash Search API (free, 50 req/hour, requires UNSPLASH_ACCESS_KEY)
//          Get one at https://unsplash.com/oauth/applications → "New Application"
//
// Fallback: curated category-mapped Picsum IDs (works with no setup but
//           images repeat and aren't perfectly on-topic)
//
// We try Unsplash first; on any failure (no key, rate limit, network) we fall
// back to category-mapped Picsum so the workflow never breaks on images.
// ─────────────────────────────────────────────

const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY;

// Search queries per category — used by Unsplash. Pick neutral, well-photographed
// terms that exist plentifully in stock libraries.
// v9: re-keyed to the `category` values used in KEYWORD_DATABASE. `niche`
// (villa/farmhouse/penthouse/office/renovation/furniture) further refines the
// query when present — see NICHE_IMAGE_QUERIES below — so a South Delhi villa
// article gets a villa-flavoured image, not a generic South Delhi one.
const CATEGORY_IMAGE_QUERIES = {
  south_delhi: ["luxury independent house Delhi", "elegant home interior", "modern interior Delhi"],
  gurgaon:     ["luxury apartment interior", "modern interior", "elegant home interior"],
  commercial:  ["modern office interior", "luxury retail interior", "restaurant interior design"],
  furniture:   ["custom wood furniture", "luxury wardrobe interior", "bespoke furniture workshop"],
  renovation:  ["home renovation interior", "modern interior construction", "interior site execution"],
  technical:   ["plywood furniture workshop", "kitchen cabinet materials", "interior carpentry workshop"],
};

// Per-niche overrides (checked first, before CATEGORY_IMAGE_QUERIES).
const NICHE_IMAGE_QUERIES = {
  villa:     ["luxury villa interior", "modern villa living room", "premium villa home"],
  farmhouse: ["luxury farmhouse interior", "rustic luxury home", "modern farmhouse"],
  penthouse: ["luxury penthouse interior", "modern penthouse living room", "premium penthouse"],
  office:    ["modern office interior", "corporate interior design", "luxury retail interior"],
};

// Curated Picsum IDs that happen to be architecture/interior-ish. Used only as
// fallback when Unsplash is unavailable. Grouped to match category vibe loosely.
const FALLBACK_PICSUM = {
  south_delhi: ["1048", "1080", "1043"],
  gurgaon:     ["1048", "1080", "1031"],
  commercial:  ["292", "365", "431"],
  furniture:   ["1080", "1043", "490"],
  renovation:  ["1018", "1019", "1015"],
  technical:   ["1080", "1043", "490"],
};

async function fetchUnsplashImage(category, niche) {
  if (!UNSPLASH_KEY) return null;
  const queries = (niche && NICHE_IMAGE_QUERIES[niche]) || CATEGORY_IMAGE_QUERIES[category] || CATEGORY_IMAGE_QUERIES.south_delhi;
  const query = queries[Math.floor(Math.random() * queries.length)];

  try {
    const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&orientation=landscape&per_page=20&content_filter=high`;
    const res = await fetch(url, {
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });
    if (!res.ok) {
      console.warn(`  ⚠️  Unsplash HTTP ${res.status} — falling back to Picsum`);
      return null;
    }
    const data = await res.json();
    const results = data?.results || [];
    if (results.length === 0) {
      console.warn(`  ⚠️  Unsplash returned 0 results for "${query}" — falling back`);
      return null;
    }
    // Random pick from top 20 → variety across blogs in same category
    const pick = results[Math.floor(Math.random() * Math.min(results.length, 20))];
    // Use 'regular' (1080w) sized, plus the photographer credit per Unsplash license
    return {
      url: `${pick.urls.raw}&w=1200&h=675&fit=crop&q=80`,
      alt: pick.alt_description || query,
      photographer: pick.user?.name || "Unsplash",
      photographerUrl: pick.user?.links?.html || "https://unsplash.com",
      sourceUrl: pick.links?.html || "https://unsplash.com",
      query,
    };
  } catch (err) {
    console.warn(`  ⚠️  Unsplash fetch failed: ${err.message} — falling back to Picsum`);
    return null;
  }
}

function getFallbackImage(category, slug) {
  const pool = FALLBACK_PICSUM[category] || FALLBACK_PICSUM.south_delhi;
  const index = slug.split("").reduce((a, c) => a + c.charCodeAt(0), 0) % pool.length;
  return {
    url: `https://picsum.photos/id/${pool[index]}/1200/675`,
    alt: "luxury interior design",
    photographer: null,
    photographerUrl: null,
    sourceUrl: null,
    query: null,
  };
}

// Unified image getter — tries Unsplash, falls back to Picsum.
// `category` and `niche` come from the selected KEYWORD_DATABASE entry; `slug` is the blog slug.
async function resolveBlogImage(category, slug, niche) {
  const fromUnsplash = await fetchUnsplashImage(category, niche);
  if (fromUnsplash) {
    console.log(`  🖼️  Image from Unsplash: "${fromUnsplash.query}" by ${fromUnsplash.photographer}`);
    return fromUnsplash;
  }
  const fb = getFallbackImage(category, slug);
  console.log(`  🖼️  Image from fallback Picsum (set UNSPLASH_ACCESS_KEY for topic-relevant images)`);
  return fb;
}

// Deterministic-by-date PRNG (Mulberry32-style), seeded off today's date +
// an optional extra string (used to give each slot its own independent
// shuffle order while staying reproducible within a single run).
function seededRng(extra = "") {
  const seedStr = new Date().toISOString().split("T")[0] + extra;
  let seedNum = 0;
  for (const c of seedStr) seedNum = (seedNum * 31 + c.charCodeAt(0)) >>> 0;
  return function rng() {
    seedNum = (seedNum + 0x6D2B79F5) >>> 0;
    let t = seedNum;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seededShuffle(arr, extra = "") {
  const rng = seededRng(extra);
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// ─────────────────────────────────────────────
// KEYWORD SELECTOR — 4-SLOT STRUCTURE (PART 1 / PART 3 / PART 4 / PART 5)
//
// SLOT 1: a South Delhi keyword
// SLOT 2: a Gurgaon keyword
// SLOT 3: a property/service niche keyword (villa/farmhouse/penthouse/
//         apartment/office/renovation/furniture — rotated by day), pulled
//         from WHICHEVER of South Delhi / Gurgaon was NOT already used in
//         slots 1–2 that specific niche, so the day doesn't double up on
//         one city (PART 1: "do not allow all 4 to target the same location").
// SLOT 4: a technical/material keyword, rotated by TECHNICAL_TOPIC_ROTATION.
//
// Cannibalisation guards applied to every slot (PART 3 / PART 5):
//   - LANDING_PAGE and CASE_STUDY keywords are NEVER auto-selected — those
//     need a real static page / real verified project respectively, not an
//     auto-generated blog. (PART 4, PART 6/15)
//   - A canonicalGroup that was used in the last CANONICAL_COOLDOWN_DAYS days
//     is skipped, so we don't publish 3 near-duplicate articles that all
//     target the same URL's search intent.
//   - A bare keyword already in memory.usedKeywords is skipped outright.
// ─────────────────────────────────────────────
const CANONICAL_COOLDOWN_DAYS = 21;

function daysBetween(dateStr) {
  if (!dateStr) return Infinity;
  const then = new Date(dateStr).getTime();
  if (Number.isNaN(then)) return Infinity;
  return (Date.now() - then) / 86400000;
}

// Auto-generation eligibility per contentType (PART 4 / PART 6 / PART 15).
function isAutoGenerable(entry) {
  if (entry.contentType === "LANDING_PAGE") return false; // needs a real static page, not a blog
  if (entry.contentType === "CASE_STUDY") return false;   // no verified project data exists
  return true; // BLOG, SERVICE_PAGE, LOCATION_PAGE
}

function isEligible(entry, memory, usedThisRunKeywords, usedThisRunCanonicalGroups) {
  if (!isAutoGenerable(entry)) return false;
  if (memory.usedKeywords.includes(entry.keyword)) return false;
  if (usedThisRunKeywords.has(entry.keyword)) return false;
  if (usedThisRunCanonicalGroups.has(entry.canonicalGroup)) return false;
  const lastUsed = (memory.lastUsedDate || {})[entry.canonicalGroup];
  if (lastUsed && daysBetween(lastUsed) < CANONICAL_COOLDOWN_DAYS) return false;
  return true;
}

// Picks one eligible entry from `pool`, deterministically shuffled. Relaxes
// constraints in stages (skip cooldown, then skip everything except the
// bare "already published this exact keyword" check) rather than ever
// leaving a slot empty — matches PART 16's "skip is fine, empty run is not"
// spirit while still always returning something usable.
function pickFromPool(pool, memory, usedThisRunKeywords, usedThisRunCanonicalGroups, seedExtra, excludeLocations = new Set()) {
  const shuffled = seededShuffle(pool, seedExtra);

  const locationFiltered = shuffled.filter(e => !excludeLocations.has(e.location));
  const tryPool = locationFiltered.length > 0 ? locationFiltered : shuffled;

  let pick = tryPool.find(e => isEligible(e, memory, usedThisRunKeywords, usedThisRunCanonicalGroups));
  if (pick) return pick;

  // Relax: allow canonical-group cooldown to be ignored (still respects
  // "not used this exact run" + "not published this exact keyword before").
  pick = tryPool.find(e =>
    isAutoGenerable(e) &&
    !memory.usedKeywords.includes(e.keyword) &&
    !usedThisRunKeywords.has(e.keyword)
  );
  if (pick) return pick;

  // Fully relaxed fallback — never leave a slot with nothing (BLOGS_PER_DAY
  // must produce 4 attempts; failed *generation* is handled separately by
  // the retry/skip logic in main(), which is where PART 13/15 actually bite).
  return tryPool.find(isAutoGenerable) || shuffled[0];
}

function selectDailyKeywords(memory) {
  const usedThisRunKeywords = new Set();
  const usedThisRunCanonicalGroups = new Set();
  const usedThisRunLocations = new Set();
  const selections = [];

  const dayIndex = Math.floor(Date.now() / 86400000);

  for (const slot of DAILY_SLOTS) {
    let entry;

    if (slot === "south-delhi") {
      const pool = KEYWORD_DATABASE.filter(e => e.category === "south_delhi");
      entry = pickFromPool(pool, memory, usedThisRunKeywords, usedThisRunCanonicalGroups, "slot1");
    } else if (slot === "gurgaon") {
      const pool = KEYWORD_DATABASE.filter(e => e.category === "gurgaon");
      entry = pickFromPool(pool, memory, usedThisRunKeywords, usedThisRunCanonicalGroups, "slot2");
    } else if (slot === "property-niche") {
      const niche = PROPERTY_NICHE_ROTATION[dayIndex % PROPERTY_NICHE_ROTATION.length];
      const pool = KEYWORD_DATABASE.filter(e => e.niche === niche);
      // Prefer a location not already used in slots 1–2 today (PART 1).
      entry = pickFromPool(pool, memory, usedThisRunKeywords, usedThisRunCanonicalGroups, "slot3", usedThisRunLocations);
      // If the niche pool is empty entirely (e.g. "apartment" has no dedicated
      // cluster yet), fall back to any SERVICE_PAGE/BLOG keyword not yet used.
      if (!entry) {
        console.log(`  ℹ️  No dedicated cluster for niche "${niche}" yet — falling back to general commercial pool`);
        const fallbackPool = KEYWORD_DATABASE.filter(e => e.intent === "commercial");
        entry = pickFromPool(fallbackPool, memory, usedThisRunKeywords, usedThisRunCanonicalGroups, "slot3-fallback", usedThisRunLocations);
      }
    } else if (slot === "technical") {
      const topic = TECHNICAL_TOPIC_ROTATION[dayIndex % TECHNICAL_TOPIC_ROTATION.length];
      const pool = KEYWORD_DATABASE.filter(e => e.techTopic === topic);
      entry = pickFromPool(pool, memory, usedThisRunKeywords, usedThisRunCanonicalGroups, "slot4");
    }

    if (entry) {
      selections.push(entry);
      usedThisRunKeywords.add(entry.keyword);
      usedThisRunCanonicalGroups.add(entry.canonicalGroup);
      usedThisRunLocations.add(entry.location);
    } else {
      console.warn(`  ⚠️  Slot "${slot}" produced no candidate — skipping this slot today`);
    }
  }

  console.log("📌 Today's slots:");
  selections.forEach((s, i) => console.log(`   [${DAILY_SLOTS[i]}] "${s.keyword}" (${s.contentType}, ${s.canonicalGroup})`));
  return selections;
}

// ─────────────────────────────────────────────
// ANGLE SELECTOR (PART 10)
// Picks one angle PER SELECTED KEYWORD, matched to that keyword's search
// intent (commercial / informational / technical), avoiding angle repeats
// within the same run and de-prioritising angles used in recent memory.
// ─────────────────────────────────────────────
function selectAnglesForSelections(memory, selections) {
  const recentAngles = new Set(memory.lastAngles.slice(-BLOGS_PER_DAY));
  const usedToday = new Set();

  return selections.map((sel, i) => {
    const fitsIntent = a => a.intents.includes(sel.intent);
    let candidates = ANGLES.filter(a => fitsIntent(a) && !usedToday.has(a.id) && !recentAngles.has(a.id));
    if (candidates.length === 0) candidates = ANGLES.filter(a => fitsIntent(a) && !usedToday.has(a.id));
    if (candidates.length === 0) candidates = ANGLES.filter(a => !usedToday.has(a.id));
    if (candidates.length === 0) candidates = ANGLES;

    const shuffled = seededShuffle(candidates, `angle${i}`);
    const chosen = shuffled[0];
    usedToday.add(chosen.id);
    return chosen;
  });
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
// PART 7 — internal links selected BY CLUSTER, not at random, and only from
// routes confirmed to exist on the live site today (see INTERNAL_LINKS /
// the targetUrl values on KEYWORD_DATABASE). We never link to a
// proposedLandingUrl — those aren't live.
function buildInternalLinksForEntry(entry) {
  const primaryUrl = entry.targetUrl || "/#services";
  const primaryText = primaryUrl === "/delhi" ? "interior design in south delhi"
    : primaryUrl === "/gurgaon" ? "interior design in gurgaon"
    : primaryUrl === "/#about" ? "our design process"
    : "our services";
  const primary = { text: primaryText, url: primaryUrl };
  // Second link: always portfolio or contact, picked deterministically off the keyword
  const secondaryOptions = INTERNAL_LINKS.filter(l => l.url === "/#projects" || l.url === "/#contact");
  const secondary = secondaryOptions[entry.keyword.length % secondaryOptions.length];
  return [primary, secondary];
}

// PART 6 — semantic keyword variations (3-6 related terms), used so the
// model has real supporting terms to weave in instead of repeating the
// primary keyword (keyword stuffing).
function semanticVariationsFor(entry) {
  const base = entry.keyword;
  const variants = new Set([
    base.replace(/\bcost\b/i, "pricing"),
    base.replace(/\binterior designer\b/i, "interior design company"),
    base.replace(/\bdesign\b/i, "interiors"),
    `${entry.location} ${entry.niche || "interior design"}`.trim(),
    entry.cluster.replace(/-/g, " "),
  ]);
  variants.delete(base);
  return [...variants].filter(Boolean).slice(0, 5);
}

async function generateBlog(entry, angle, cityData, budgetData, attemptNum = 1) {
  const links = buildInternalLinksForEntry(entry);
  const [internalLink1, internalLink2] = links;
  const externalLink1 = EXTERNAL_LINKS[entry.keyword.length % EXTERNAL_LINKS.length];
  const semanticTerms = semanticVariationsFor(entry);

  const prompt = `Write a 1500-word SEO blog article for indéva studio (a Delhi NCR luxury interior design firm) in third person.
Do not write as "I" or claim personal authorship, a job title, or years of first-hand professional experience — write about
indéva studio and the topic from an informed, third-person, editorial voice instead. (Audit note, 2026-09-01: this prompt
previously opened with "You are a senior writer for indéva studio", a first-person framing that repeatedly produced fabricated
"as a senior designer with 15 years of experience" claims in published articles despite the PART 6 rule below telling the
model not to do this — reworded to close that loophole at the source rather than relying on the instruction alone.)

WRITE A 1500-WORD SEO BLOG.

PRIMARY KEYWORD (use exactly once as the core subject, do not repeat it more than 2-3 times total — no keyword stuffing): "${entry.keyword}"
RELATED SEMANTIC TERMS (weave 3-6 of these naturally through the article instead of repeating the primary keyword): ${semanticTerms.join(", ")}
SEARCH INTENT: ${entry.intent} (${entry.contentType === "SERVICE_PAGE" ? "reader is evaluating hiring a designer for this specific service" : entry.contentType === "LOCATION_PAGE" ? "reader wants to know if indéva studio genuinely serves this locality" : entry.intent === "technical" ? "reader wants a real technical answer, not a sales pitch" : "reader wants a genuinely useful guide"})

ANGLE: ${angle.name} — ${angle.intro}
SCENARIO (use ${cityData.area}, ${cityData.city} naturally — do not invent a fake named client or project set here): ${cityData.property} in ${cityData.area}, ${cityData.city}, illustrative budget ${budgetData.range}.

DIRECTIVE:
${angle.instruction}

CRITICAL — DO NOT FABRICATE (PART 6):
- Never invent a specific "real" Indéva client, project, or testimonial and present it as fact.
- Never claim a specific number of years of experience, a project count, or a client count unless it is a generic, unverifiable-as-false statement (e.g. avoid "15 years of experience" or "500+ projects completed").
- Never invent exact measurements, lab statistics, or certification numbers.
- If an example genuinely helps the reader, label it explicitly in the text as "HYPOTHETICAL EXAMPLE" or "ILLUSTRATIVE BUDGET" — do not present it as something that actually happened.
- Use ₹ pricing only where pricing is genuinely relevant to the topic.
- BANNED PHRASES — do not write any of these or close variants of them: "as a senior designer", "as a senior writer",
  "with 15 years of experience", "in my X years of experience", "I've worked with numerous clients", "the day a client called us".

VOICE: Lowercase brand name "indéva studio". Authoritative, warm, Indian market fluent. Grade 7-8 readability. No clichés like "delve", "in the realm of", "at the end of the day", "transformative", "seamless", "leverage", "holistic", "cutting-edge".

TITLE RULES (PART 8): Write a natural, human-readable title. Do NOT keyword-stuff or repeat the same phrase with pipes (e.g. never "X | X | Best X"). The primary keyword's intent should be clear from the title, but it must read like something a person would actually title an article.

OUTPUT EXACTLY THIS FORMAT (these labels are required):

SEO_TITLE: [60-65 chars, natural, keyword-relevant, NOT keyword-stuffed]
META_DESC: [under 155 chars, with hook]
SLUG: [hyphenated, max 8 words]
CATEGORY: [pick one: spatial logic / design intelligence / india market / kitchen design / bedroom design / villa & farmhouse / hospitality design / materials / philosophy / process]
EXCERPT: [2 plain-text sentences for the card preview]
CONTENT_SUMMARY: [1 sentence on the main argument]
---ARTICLE---
<h1>...</h1>
<p>opening matching the angle...</p>
<h2>...</h2>
... 4-5 H2 sections, H3 subsections where useful, at least one <ul>, one <blockquote> with a non-obvious insight ...
<h2>frequently asked questions</h2>
<details><summary>Q1?</summary><p>A1</p></details>
... 4 FAQs total ...
<p>Closing line with <a href="/#contact">start a project</a>.</p>
---END---

In the article body, naturally include:
- ₹ figures from the ${budgetData.range} range, only where pricing is genuinely relevant
- "${cityData.area}, ${cityData.city}" mentioned at least once
- This link: <a href="${internalLink1.url}">${internalLink1.text}</a>
- This link: <a href="${internalLink2.url}">${internalLink2.text}</a>
- This external link: <a href="${externalLink1.url}" rel="noopener noreferrer" target="_blank">${externalLink1.text}</a>

Output ONLY the labels and HTML. No preamble, no markdown fences, no commentary. Begin with "SEO_TITLE:".`;

  console.log(`  ✍️  Generating [${angle.name}]: "${entry.keyword}" (attempt ${attemptNum})`);

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      // Cap output to ~5500 tokens (≈1700 words). Combined with our shorter
      // prompt (~1500 tokens), one call uses ~7000 TPM — fits under 12K cap.
      max_completion_tokens: 5500,
      temperature: 0.75 + Math.random() * 0.2,
      messages: [
        { role: "user", content: prompt },
      ],
    }),
  });

  const data = await response.json();

  // Groq returns 429 with exact wait time. Parse it and signal a structured retry.
  if (response.status === 429) {
    const errMsg = data?.error?.message || JSON.stringify(data);
    const waitMatch = errMsg.match(/try again in ([\d.]+)s/i);
    const waitSec = waitMatch ? Math.ceil(parseFloat(waitMatch[1])) + 2 : 35;
    const err = new Error(`Groq rate limit — wait ${waitSec}s. (${errMsg.slice(0, 200)})`);
    err.isRateLimit = true;
    err.retryAfterSec = waitSec;
    throw err;
  }

  if (!response.ok) {
    throw new Error(`Groq HTTP ${response.status}: ${JSON.stringify(data).slice(0, 400)}`);
  }

  // Groq is OpenAI-compatible: { choices: [{ message: { content: "..." }, finish_reason: "stop" }] }
  const choice = data.choices?.[0];
  if (!choice) {
    throw new Error(`Groq returned no choices. Response: ${JSON.stringify(data).slice(0, 300)}`);
  }
  const text = choice.message?.content;
  const finish = choice.finish_reason;

  if (!text) {
    throw new Error(`Groq returned empty content. finish_reason=${finish}, response=${JSON.stringify(data).slice(0, 300)}`);
  }

  if (finish && finish !== "stop") {
    console.warn(`  ⚠️  Groq finish_reason=${finish} (not "stop") — content may be incomplete (${text.length} chars)`);
  } else {
    console.log(`  📥 Groq OK — ${text.length} chars, finish_reason=${finish || "stop"}`);
  }

  return text;
}

// ─────────────────────────────────────────────
// PARSE RESPONSE
// ─────────────────────────────────────────────
function parseBlogResponse(raw, entry, angle) {
  const titleMatch = raw.match(/SEO_TITLE:\s*(.+)/);
  const metaMatch = raw.match(/META_DESC:\s*(.+)/);
  const slugMatch = raw.match(/SLUG:\s*(.+)/);
  const catMatch = raw.match(/CATEGORY:\s*(.+)/);
  const excerptMatch = raw.match(/EXCERPT:\s*([\s\S]+?)(?=CONTENT_SUMMARY:|---ARTICLE---|<h1|<p>)/);
  const summaryMatch = raw.match(/CONTENT_SUMMARY:\s*(.+)/);

  // Try to find the article body. Open-source models (Llama, Mistral) often
  // skip the ---ARTICLE---/---END--- delimiters even when instructed to use them.
  // Fallback: extract everything from the first HTML tag onward, then strip any
  // trailing delimiter junk.
  let articleBody = null;
  const fencedMatch = raw.match(/---ARTICLE---([\s\S]+?)---END---/);
  if (fencedMatch) {
    articleBody = fencedMatch[1].trim();
  } else {
    // Find the first real HTML opening tag (<h1>, <p>, <h2>, <article>, <section>)
    const htmlStart = raw.search(/<(h[1-6]|p|article|section|div)[\s>]/);
    if (htmlStart !== -1) {
      articleBody = raw.slice(htmlStart).trim();
      // Strip trailing ---END--- or stray delimiters if present
      articleBody = articleBody.replace(/---END---[\s\S]*$/, "").trim();
      console.log(`  ℹ️  ---ARTICLE--- markers missing — extracted from first HTML tag (${articleBody.length} chars)`);
    }
  }

  // STRICT MODE: only fail if we can't find the absolutely-required pieces.
  // Title and slug are non-negotiable; article body falls back per above.
  const missing = [];
  if (!titleMatch) missing.push("SEO_TITLE");
  if (!slugMatch) missing.push("SLUG");
  if (!articleBody || articleBody.length < 500) missing.push("article body (<500 chars)");

  if (missing.length > 0) {
    console.warn(`  ⚠️  Parse failure — missing fields: ${missing.join(", ")}`);
    console.warn(`     Response head: ${raw.slice(0, 200).replace(/\n/g, " | ")}`);
    console.warn(`     Response tail: ${raw.slice(-200).replace(/\n/g, " | ")}`);
    throw new Error(`Malformed model output (missing: ${missing.join(", ")})`);
  }

  return {
    title: titleMatch[1].trim(),
    meta: metaMatch ? metaMatch[1].trim() : "",
    slug: slugMatch[1].trim(),
    cat: catMatch ? catMatch[1].trim() : (CATEGORY_MAP[entry.category] || "design intelligence"),
    excerpt: excerptMatch ? excerptMatch[1].trim() : "",
    summary: summaryMatch ? summaryMatch[1].trim() : "",
    article: articleBody,
    angleId: angle.id,
  };
}

// ─────────────────────────────────────────────
// QUALITY GATE (PART 14 / PART 15)
// Runs AFTER parseBlogResponse succeeds. Anything that fails here causes a
// SKIP (not a publish) — "the purpose of this system is organic SEO growth,
// not simply producing 4 URLs every day."
// ─────────────────────────────────────────────
function validateBlog(parsed, entry, allKnownTitles, allKnownSlugs) {
  const problems = [];

  if (!parsed.title || parsed.title.length < 10) problems.push("title missing or too short");
  if (!parsed.meta) problems.push("meta description missing");
  if (!parsed.slug) problems.push("slug missing");
  if (!parsed.article || parsed.article.length < 500) problems.push("article body too short");

  const plainText = (parsed.article || "").replace(/<[^>]+>/g, " ");
  const wordCount = plainText.split(/\s+/).filter(Boolean).length;
  if (wordCount < 600) problems.push(`article too short (${wordCount} words, need 600+)`);

  if (!isTitleUnique(parsed.title, allKnownTitles)) problems.push("duplicate/near-duplicate title");
  if (allKnownSlugs.includes(parsed.slug)) problems.push("duplicate slug (will be auto-suffixed, not a hard fail)");

  if (/lorem ipsum/i.test(plainText)) problems.push("contains placeholder lorem ipsum text");
  if (/```/.test(parsed.article)) problems.push("contains markdown code fences");
  if (/\[PLACEHOLDER|\[INSERT|\[TODO/i.test(parsed.article)) problems.push("contains placeholder brackets");

  // FABRICATION SIGNATURE CHECK (audit 2026-09-01, hard code-level backstop for PART 6).
  // Prompt-level instructions alone already failed silently on live pages (11 confirmed
  // as of this audit) — this is a second line of defense that forces a regeneration
  // attempt instead of letting the pattern reach publish.
  const fabricationSignatures = [
    /as a senior (designer|writer)/i,
    /\b\d+\s*years? of experience/i,
    /i(?:'ve| have) worked with (numerous|many|hundreds of) clients/i,
    /the day a client called us/i,
  ];
  const fabricationHits = fabricationSignatures.filter((re) => re.test(plainText));
  if (fabricationHits.length > 0) problems.push(`fabricated-credential/anecdote signature detected (${fabricationHits.length} pattern match(es))`);

  // Basic broken-internal-link check: any /#... or /delhi /gurgaon style hrefs
  // should match a known INTERNAL_LINKS url.
  const knownUrls = new Set(INTERNAL_LINKS.map(l => l.url));
  const hrefs = [...parsed.article.matchAll(/href="([^"]+)"/g)].map(m => m[1]);
  const brokenInternal = hrefs.filter(h => h.startsWith("/") && !knownUrls.has(h));
  if (brokenInternal.length > 0) problems.push(`possible broken internal link(s): ${brokenInternal.join(", ")}`);

  // Hard failures only (duplicate slug is soft — handled by auto-suffix in main()).
  const hardFailures = problems.filter(p => !p.startsWith("duplicate slug"));
  return { ok: hardFailures.length === 0, problems };
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
function buildInsightPage(blogData, image) {
  const date = new Date().toISOString().split("T")[0];
  const imageUrl = image.url;
  const imageAlt = image.alt || blogData.title;
  const monthYear = new Date().toLocaleDateString("en-IN", {
    month: "long", year: "numeric"
  }).toLowerCase();
  const wordCount = blogData.article.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Photographer credit (Unsplash license requires it). Empty string if from fallback.
  const photoCredit = image.photographer
    ? `<div class="photo-credit">photo by <a href="${image.photographerUrl}?utm_source=indeva_studio&utm_medium=referral" target="_blank" rel="noopener">${image.photographer}</a> on <a href="https://unsplash.com/?utm_source=indeva_studio&utm_medium=referral" target="_blank" rel="noopener">unsplash</a></div>`
    : "";

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blogData.title,
    description: blogData.meta,
    image: imageUrl,
    datePublished: date,
    author: { "@type": "Organization", name: "indéva studio", url: "https://www.indevastudio.com" },
    publisher: { "@type": "Organization", name: "indéva studio" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://www.indevastudio.com/insights/${blogData.slug}/` },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${blogData.title.toLowerCase()} — indéva studio</title>
<meta name="description" content="${blogData.meta}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://www.indevastudio.com/insights/${blogData.slug}/">
<meta property="og:title" content="${blogData.title} — indéva studio">
<meta property="og:description" content="${blogData.meta}">
<meta property="og:image" content="${imageUrl}">
<meta property="og:url" content="https://www.indevastudio.com/insights/${blogData.slug}/">
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
.article-image{padding:0 60px;position:relative;}
.article-image img{width:100%;max-height:560px;object-fit:cover;display:block;filter:brightness(0.8) saturate(0.85);}
.photo-credit{font-family:var(--mono);font-size:0.55rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--white-muted);padding:12px 0 0;text-align:right;}
.photo-credit a{color:var(--white-muted);text-decoration:none;border-bottom:1px solid rgba(240,235,227,0.15);}
.photo-credit a:hover{color:var(--gold);}
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
  <img src="${imageUrl}" alt="${imageAlt}" loading="eager" width="1200" height="675">
  ${photoCredit}
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
    // Each blog now carries its own resolved image (set in main loop)
    const imageUrl = blog.image?.url || `https://picsum.photos/id/1048/1200/675`;
    const imageAlt = blog.image?.alt || blog.title.toLowerCase();
    return `
    <a class="blog-card" href="/insights/${blog.slug}/">
      <img src="${imageUrl}" alt="${imageAlt}" class="blog-card-image">
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
    <loc>https://www.indevastudio.com/insights/${b.slug}/</loc>
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

  const urlList = newBlogs.map(b => `https://www.indevastudio.com/insights/${b.slug}/`);

  try {
    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: "www.indevastudio.com",
        key: key,
        keyLocation: `https://www.indevastudio.com/${key}.txt`,
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
  console.log("\n🌟 INDEVA STUDIO — BLOG ENGINE v9 (structured SEO content engine — Groq + Unsplash)");
  console.log("━".repeat(50));
  console.log(`📅 Date: ${new Date().toLocaleDateString("en-IN")}`);
  console.log(`🤖 Model: ${GROQ_MODEL}`);
  console.log(`📝 Target: ${BLOGS_PER_DAY} slot(s) this run — ${DAILY_SLOTS.join(" / ")}`);

  if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY not set. Get one at https://console.groq.com/keys");
    process.exit(1);
  }

  // Load memory
  const memory = loadMemory();
  console.log(`📚 Memory: ${memory.titles.length} past titles, ${memory.slugs.length} past slugs, ${memory.usedKeywords.length} used keywords, ${(memory.canonicalGroups || []).length} canonical-group entries`);
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

  // Select today's 4 slots and one intent-matched angle per slot
  const selections = selectDailyKeywords(memory);
  const angles = selectAnglesForSelections(memory, selections);

  console.log(`\n🎯 Selected ${selections.length} slot(s) for today:`);
  selections.forEach((s, i) => console.log(`   ${i + 1}. [${DAILY_SLOTS[i]}] "${s.keyword}" (${s.contentType}, ${s.location}) → angle: ${angles[i].id}`));
  console.log("");

  const dayIndex = Math.floor(Date.now() / 86400000);
  const publishedBlogs = [];
  const newTitles = [];
  const newKeywordsUsed = [];
  const newAnglesUsed = [];
  const newCanonicalGroups = [];
  const newTargetUrls = [];
  const newContentTypes = [];
  const newSearchIntents = [];
  const newLocations = [];
  const todayStr = new Date().toISOString().split("T")[0];

  for (let i = 0; i < selections.length; i++) {
    const entry = selections[i];
    const angle = angles[i];
    const cityData = LOCALITY_DATA[entry.location] || { city: entry.location, area: entry.location, property: "home" };
    const budgetData = BUDGETS[(dayIndex + i * 2) % BUDGETS.length];

    console.log(`\n[${i + 1}/${selections.length}] "${entry.keyword}" → [${angle.name}]`);

    let blogData = null;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;
      try {
        const raw = await generateBlog(entry, angle, cityData, budgetData, attempts);
        const parsed = parseBlogResponse(raw, entry, angle);

        // QUALITY GATE (PART 14) — title uniqueness is one of several checks.
        const allKnownTitles = [...memory.titles, ...newTitles];
        const allKnownSlugs = [...memory.slugs, ...publishedBlogs.map(b => b.slug)];
        const { ok, problems } = validateBlog(parsed, entry, allKnownTitles, allKnownSlugs);

        if (!ok) {
          console.log(`  ⚠️  Quality gate failed (attempt ${attempts}): ${problems.join("; ")}`);
          if (attempts < maxAttempts) {
            await new Promise(r => setTimeout(r, 2000));
            continue;
          } else {
            console.error(`  ❌ Quality gate still failing after ${maxAttempts} attempts — SKIPPING (PART 15: no bad content published)`);
            break;
          }
        }

        // SLUG UNIQUENESS — memory AND filesystem (protects if memory.json resets)
        // BUGFIX (audit 2026-09-01): this used to be a single-shot check that
        // unconditionally appended `-${angle.id}` on collision. If a slug had
        // ALREADY been auto-suffixed on a previous run (e.g. "...-case-study")
        // and collided again today with the same angle, it appended the same
        // suffix a second time, producing live URLs like
        // "...-case-study-case-study" / "...-cost-guide-cost-guide" /
        // "...-mistakes-mistakes-to". Now: never re-append a suffix already
        // present at the end of the slug, and loop with a numeric fallback
        // until the slug is actually unique instead of trusting one check.
        const slugExists = (slug) => {
          const dir = path.join(REPO_ROOT, "insights", slug);
          return memory.slugs.includes(slug) || fs.existsSync(path.join(dir, "index.html"));
        };
        if (slugExists(parsed.slug)) {
          if (!parsed.slug.endsWith(`-${angle.id}`)) {
            parsed.slug = `${parsed.slug}-${angle.id}`;
          }
          let disambiguator = 2;
          while (slugExists(parsed.slug)) {
            parsed.slug = `${parsed.slug}-${disambiguator}`;
            disambiguator++;
          }
        }

        blogData = parsed;
        blogData.keyword = entry.keyword;
        break;

      } catch (err) {
        console.error(`  ❌ Attempt ${attempts} failed: ${err.message}`);
        if (attempts < maxAttempts) {
          // If Groq told us exactly how long to wait, respect it (+2s buffer baked in)
          const waitMs = err.isRateLimit && err.retryAfterSec
            ? err.retryAfterSec * 1000
            : 3000;
          console.log(`  ⏳ Waiting ${Math.round(waitMs / 1000)}s before retry...`);
          await new Promise(r => setTimeout(r, waitMs));
        }
      }
    }

    if (!blogData) {
      // PART 13: a failed/skipped slot does NOT mark the keyword as used —
      // we only push into newKeywordsUsed etc. further below, on success.
      console.error(`  ❌ All ${maxAttempts} attempts failed or were rejected by the quality gate for "${entry.keyword}" — skipping`);
      console.error(`     If this happens repeatedly, check: 1) GROQ_API_KEY valid, 2) dedup not too strict, 3) rate limit hit`);
      // Still sleep before the next slot so we don't burn the whole run's TPM budget on retries.
      if (i < selections.length - 1) {
        await new Promise(r => setTimeout(r, INTER_BLOG_DELAY_MS));
      }
      continue;
    }

    // Resolve a topic-relevant image (Unsplash if key set, else fallback)
    const image = await resolveBlogImage(entry.category, blogData.slug, entry.niche);
    blogData.image = image;

    // Save file
    const slugDir = path.join(insightsDir, blogData.slug);
    if (!fs.existsSync(slugDir)) fs.mkdirSync(slugDir, { recursive: true });
    const html = buildInsightPage(blogData, image);
    fs.writeFileSync(path.join(slugDir, "index.html"), html);

    console.log(`  ✅ Saved: insights/${blogData.slug}/index.html`);
    publishedBlogs.push(blogData);
    newTitles.push(blogData.title);
    newKeywordsUsed.push(entry.keyword);
    newAnglesUsed.push(angle.id);
    newCanonicalGroups.push(entry.canonicalGroup);
    newTargetUrls.push(entry.targetUrl);
    newContentTypes.push(entry.contentType);
    newSearchIntents.push(entry.intent);
    newLocations.push(entry.location);

    if (i < selections.length - 1) {
      console.log(`  ⏳ Sleeping ${INTER_BLOG_DELAY_MS / 1000}s to stay under Groq's TPM cap...`);
      await new Promise(r => setTimeout(r, INTER_BLOG_DELAY_MS));
    }
  }

  // Update memory (PART 11 — extended, backward-compatible fields)
  memory.titles.push(...newTitles);
  memory.slugs.push(...publishedBlogs.map(b => b.slug));
  memory.usedKeywords.push(...newKeywordsUsed);
  memory.summaries.push(...publishedBlogs.map(b => b.summary || ""));
  memory.lastAngles.push(...newAnglesUsed);
  memory.canonicalGroups.push(...newCanonicalGroups);
  memory.targetUrls.push(...newTargetUrls);
  memory.contentTypes.push(...newContentTypes);
  memory.searchIntents.push(...newSearchIntents);
  memory.lastLocations.push(...newLocations);
  memory.lastUsedDate = memory.lastUsedDate || {};
  for (const cg of newCanonicalGroups) memory.lastUsedDate[cg] = todayStr;
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
