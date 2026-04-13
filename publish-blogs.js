/**
 * VERCEL CRON JOB — Auto Blog Publisher
 * File: /api/cron/publish-blogs.js
 *
 * Setup in vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/publish-blogs",
 *     "schedule": "0 4 * * *"
 *   }]
 * }
 *
 * This runs at 4:00 AM IST (UTC 22:30 prev day) every day.
 * Vercel Cron requires Pro plan (free for hobby with limits).
 */

export const config = {
  runtime: "nodejs",
};

// ─── Keyword Pool (same as generate-blogs.js) ──
const KEYWORD_POOL = {
  interior_design: [
    "interior design cost in Delhi 2025",
    "luxury interior designers in Delhi NCR",
    "modular interior design ideas for Indian homes",
    "interior design services price list India",
    "full home interior design cost Gurgaon",
    "affordable luxury interior design India",
  ],
  modular_kitchen: [
    "modular kitchen design ideas for Indian homes",
    "modular kitchen cost in Delhi 2025",
    "L-shaped modular kitchen design small space",
    "modular kitchen materials comparison India",
    "open kitchen design ideas Indian homes",
  ],
  living_room: [
    "modern living room design ideas India 2025",
    "luxury living room interior design Delhi",
    "small living room design ideas Indian apartment",
    "living room TV unit design ideas India",
    "false ceiling design for living room India",
  ],
  bedroom: [
    "master bedroom interior design ideas India",
    "bedroom design cost in Delhi NCR",
    "luxury bedroom design ideas Indian homes",
    "wardrobe design ideas for bedroom India",
  ],
  home_salon: [
    "home salon interior design ideas India",
    "beauty parlour interior design small space",
    "home salon setup cost India 2025",
    "home beauty studio design ideas India",
  ],
  local_seo: [
    "interior designer in Gurgaon for home",
    "interior design company Noida residential",
    "best interior designer Dehradun homes",
    "interior design services Delhi NCR reviews",
  ],
};

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
  return selected;
}

function toSlug(keyword) {
  return keyword
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

async function generateBlog(keyword) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-opus-4-5",
      max_tokens: 4000,
      messages: [
        {
          role: "user",
          content: `You are a senior content writer for Indéva Studio, a premium luxury interior design firm in Delhi NCR, India. 

Write a complete SEO-optimized blog article for keyword: "${keyword}"

Brand voice: luxury, refined, expert. No AI clichés. Grade 6-8 readability. Indian context (rupees, Indian cities).

Output EXACTLY this format:
SEO_TITLE: [60-65 chars, keyword-first]
META_DESC: [under 155 chars with CTA]
SLUG: [hyphenated keyword slug]
---ARTICLE---
[Full HTML <article> with:
- <h1> with primary keyword
- Emotional hook introduction  
- 4-5 <h2> sections with <h3> where needed
- Bullet lists for scannable content
- Cost estimates in INR (realistic 2025 Indian market rates)
- Internal link: <a href="/index.html#projects">our portfolio</a>
- Internal link: <a href="/index.html#contact">get in touch with our designers</a>
- External link: <a href="https://www.architecturaldigest.in" rel="noopener noreferrer" target="_blank">architectural digest</a>
- FAQ section with 4 questions using <details><summary> tags
- CTA section at end with link to /index.html#contact
]
---END---

Write the COMPLETE article now. No truncation.`,
        },
      ],
    }),
  });

  const data = await response.json();
  return data.content[0].text;
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

function buildHTMLPage(blogData, keyword) {
  const date = new Date().toISOString().split("T")[0];
  const readableDate = new Date().toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const imageUrl = `https://source.unsplash.com/1200x675/?luxury+interior+design&sig=${blogData.slug.length + Date.now() % 100}`;

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blogData.title,
    description: blogData.meta,
    datePublished: date,
    author: { "@type": "Organization", name: "Indéva Studio" },
    publisher: { "@type": "Organization", name: "Indéva Studio" },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://indevastudio.com/blog/${blogData.slug}`,
    },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${blogData.title} | Indéva Studio</title>
  <meta name="description" content="${blogData.meta}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://indevastudio.com/blog/${blogData.slug}" />
  <meta property="og:title" content="${blogData.title}" />
  <meta property="og:description" content="${blogData.meta}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:type" content="article" />
  <script type="application/ld+json">${schema}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/blog/blog-style.css" />
</head>
<body>
  <nav class="blog-nav">
    <a href="/" class="blog-nav__logo">Indéva Studio</a>
    <div class="blog-nav__links">
      <a href="/index.html#projects">Portfolio</a>
      <a href="/index.html#services">Services</a>
      <a href="/blog/">Journal</a>
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
    <div class="blog-container">${blogData.article}</div>
  </main>
  <section class="blog-cta-banner">
    <div class="blog-cta-banner__inner">
      <h2>Ready to Transform Your Space?</h2>
      <p>Our design consultants are available for a complimentary 30-minute discovery session.</p>
      <a href="/index.html#contact" class="blog-cta-banner__btn">Book Free Consultation →</a>
    </div>
  </section>
  <footer class="blog-footer">
    <p>© ${new Date().getFullYear()} Indéva Studio · <a href="/">indevastudio.com</a></p>
    <p><a href="/blog/">← Back to Journal</a></p>
  </footer>
</body>
</html>`;
}

// ── GITHUB PUSH (triggers Vercel auto-deploy) ──
async function pushToGitHub(files) {
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
  const REPO = "indevastudio/indevastudio";
  const BASE_URL = `https://api.github.com/repos/${REPO}/contents`;

  for (const file of files) {
    // Check if file exists (need SHA for updates)
    let sha = null;
    try {
      const check = await fetch(`${BASE_URL}/${file.path}`, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      if (check.ok) {
        const data = await check.json();
        sha = data.sha;
      }
    } catch (_) {}

    // Push file
    const body = {
      message: `🤖 Auto-publish: ${file.path} [${new Date().toISOString().split("T")[0]}]`,
      content: Buffer.from(file.content, "utf8").toString("base64"),
      ...(sha ? { sha } : {}),
    };

    await fetch(`${BASE_URL}/${file.path}`, {
      method: "PUT",
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    console.log(`✅ Pushed: ${file.path}`);
  }
}

// ── MAIN HANDLER ──────────────────────────────
export default async function handler(req, res) {
  // Security: only allow Vercel cron or admin calls
  const authHeader = req.headers.authorization;
  if (
    req.headers["x-vercel-cron"] !== "1" &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    console.log("🌟 Indéva Blog Engine — Vercel Cron Start");
    const keywords = selectDailyKeywords();
    const filesToPush = [];
    const publishedBlogs = [];

    for (const keyword of keywords) {
      console.log(`Processing: "${keyword}"`);
      try {
        const raw = await generateBlog(keyword);
        const blogData = parseBlogResponse(raw, keyword);
        const html = buildHTMLPage(blogData, keyword);

        filesToPush.push({
          path: `blog/${blogData.slug}.html`,
          content: html,
        });

        publishedBlogs.push({
          title: blogData.title,
          slug: blogData.slug,
          meta: blogData.meta,
          date: new Date().toISOString().split("T")[0],
          keyword,
        });

        await new Promise((r) => setTimeout(r, 1500));
      } catch (err) {
        console.error(`Failed for "${keyword}":`, err.message);
      }
    }

    // Build updated index JSON
    filesToPush.push({
      path: "content/blogs/index.json",
      content: JSON.stringify(publishedBlogs, null, 2),
    });

    // Push all files to GitHub → triggers Vercel build
    await pushToGitHub(filesToPush);

    return res.status(200).json({
      success: true,
      published: publishedBlogs.length,
      blogs: publishedBlogs.map((b) => b.slug),
    });
  } catch (err) {
    console.error("Cron job failed:", err);
    return res.status(500).json({ error: err.message });
  }
}
