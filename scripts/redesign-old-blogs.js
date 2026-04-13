/**
 * INDEVA STUDIO — BLOG REDESIGN SCRIPT
 * One-time script to rewrite all old plain blogs
 * with the new dark luxury design
 * Run once: node scripts/redesign-old-blogs.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const BLOGS_DIR = path.join(REPO_ROOT, "blogs");

// ── IMAGE URLS PER BLOG TOPIC ──────────────────
const IMAGE_QUERIES = [
  "luxury+interior+design",
  "modern+indian+home",
  "elegant+living+room",
  "luxury+bedroom+design",
  "contemporary+home+design",
  "indian+luxury+villa",
];

function getImageUrl(slug) {
  const seed = slug.length * 7 + 42;
  const query = IMAGE_QUERIES[seed % IMAGE_QUERIES.length];
  return `https://source.unsplash.com/1200x675/?${query}&sig=${seed}`;
}

// ── EXTRACT CONTENT FROM OLD BLOG HTML ─────────
function extractOldContent(html) {
  // Extract title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/);
  const title = titleMatch
    ? titleMatch[1].replace(" | Indéva Studio", "").replace(" | indéva Studio", "").trim()
    : "Interior Design Insights";

  // Extract meta description
  const metaMatch = html.match(/<meta name="description" content="([^"]+)"/);
  const meta = metaMatch ? metaMatch[1] : "";

  // Extract date from content or filename
  const dateMatch = html.match(/(\d{4}-\d{2}-\d{2})/);
  const dateIso = dateMatch ? dateMatch[1] : new Date().toISOString().split("T")[0];

  // Extract the main article body
  // Try to get content between <article> tags first
  let articleContent = "";
  const articleMatch = html.match(/<article[^>]*>([\s\S]+?)<\/article>/i);
  if (articleMatch) {
    articleContent = articleMatch[1].trim();
  } else {
    // Fall back to extracting main content
    const bodyMatch = html.match(/<body[^>]*>([\s\S]+?)<\/body>/i);
    if (bodyMatch) {
      // Remove nav, header, footer elements
      articleContent = bodyMatch[1]
        .replace(/<nav[\s\S]*?<\/nav>/gi, "")
        .replace(/<header[\s\S]*?<\/header>/gi, "")
        .replace(/<footer[\s\S]*?<\/footer>/gi, "")
        .replace(/<script[\s\S]*?<\/script>/gi, "")
        .trim();
    }
  }

  return { title, meta, dateIso, articleContent };
}

// ── BUILD NEW DARK LUXURY HTML ──────────────────
function buildNewHTML(slug, title, meta, dateIso, articleContent, imageUrl) {
  const readableDate = new Date(dateIso + "T00:00:00").toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: meta,
    datePublished: dateIso,
    dateModified: dateIso,
    author: { "@type": "Organization", name: "Indéva Studio", url: "https://indevastudio.com" },
    publisher: { "@type": "Organization", name: "Indéva Studio" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://indevastudio.com/blogs/${slug}` },
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | Indéva Studio</title>
  <meta name="description" content="${meta}" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://indevastudio.com/blogs/${slug}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${meta}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:url" content="https://indevastudio.com/blogs/${slug}" />
  <meta property="og:type" content="article" />
  <script type="application/ld+json">${schema}</script>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet" />
  <style>
    *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
    :root{
      --black:#0a0a0a;--black-card:#161616;
      --gold:#b89a6a;--gold-light:#d4b896;
      --white:#f0ebe3;--white-muted:#c8c0b4;--white-dim:rgba(240,235,227,0.55);
      --serif:'Cormorant Garamond',Georgia,serif;
      --mono:'DM Mono','Courier New',monospace;
    }
    html{scroll-behavior:smooth}
    body{background:var(--black);color:var(--white);font-family:var(--serif);font-weight:300;line-height:1.75;-webkit-font-smoothing:antialiased}
    .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:0 clamp(1.5rem,5vw,4rem);height:68px;background:rgba(10,10,10,0.95);backdrop-filter:blur(16px);border-bottom:1px solid rgba(184,154,106,0.1)}
    .nav__logo{font-family:var(--serif);font-size:1.1rem;font-weight:400;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);text-decoration:none}
    .nav__links{display:flex;align-items:center;gap:2rem}
    .nav__links a{font-family:var(--mono);font-size:0.68rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--white-muted);text-decoration:none;transition:color 0.2s}
    .nav__links a:hover{color:var(--gold)}
    .nav__cta{padding:0.45rem 1.1rem;border:1px solid var(--gold)!important;color:var(--gold)!important;transition:all 0.2s!important}
    .nav__cta:hover{background:var(--gold)!important;color:var(--black)!important}
    .back-bar{position:fixed;top:68px;left:0;right:0;z-index:90;padding:0.6rem clamp(1.5rem,5vw,4rem);background:rgba(10,10,10,0.85);border-bottom:1px solid rgba(184,154,106,0.07);display:flex;align-items:center;justify-content:space-between}
    .back-bar a{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold);text-decoration:none}
    .back-bar__meta{font-family:var(--mono);font-size:0.62rem;color:var(--white-dim);letter-spacing:0.08em}
    .hero{margin-top:110px;position:relative;height:clamp(300px,52vh,540px);overflow:hidden}
    .hero img{width:100%;height:100%;object-fit:cover;filter:brightness(0.35);display:block}
    .hero__overlay{position:absolute;inset:0;display:flex;flex-direction:column;justify-content:flex-end;padding:clamp(1.5rem,4vw,3rem) clamp(1.5rem,8vw,8rem)}
    .hero__eyebrow{font-family:var(--mono);font-size:0.62rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--gold);margin-bottom:0.75rem}
    .hero__title{font-size:clamp(1.8rem,4vw,3.2rem);font-weight:300;font-style:italic;color:var(--white);line-height:1.15;max-width:800px;margin-bottom:1rem}
    .hero__date{font-family:var(--mono);font-size:0.65rem;color:var(--white-dim);letter-spacing:0.08em}
    .article-wrap{max-width:760px;margin:0 auto;padding:4rem clamp(1.5rem,5vw,3rem) 6rem}
    .article-wrap h1{font-size:clamp(1.8rem,3.5vw,2.8rem);font-weight:300;font-style:italic;color:var(--white);line-height:1.2;margin-bottom:2rem}
    .article-wrap h2{font-size:clamp(1.3rem,2.2vw,1.8rem);font-weight:400;color:var(--gold-light);margin:3rem 0 1rem}
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
    .article-wrap blockquote{border-left:2px solid var(--gold);padding:1rem 1.5rem;margin:2rem 0;font-style:italic;color:var(--white);font-size:1.1rem}
    .article-wrap strong{color:var(--white);font-weight:500}
    .cta-banner{background:linear-gradient(135deg,#14100a 0%,#0a0a0a 100%);border-top:1px solid rgba(184,154,106,0.18);border-bottom:1px solid rgba(184,154,106,0.18);padding:5rem clamp(1.5rem,5vw,4rem);text-align:center}
    .cta-banner h2{font-size:clamp(1.6rem,3vw,2.4rem);font-weight:300;font-style:italic;color:var(--white);margin-bottom:0.75rem}
    .cta-banner p{font-family:var(--mono);font-size:0.72rem;color:var(--white-dim);letter-spacing:0.05em;margin-bottom:2rem}
    .cta-banner a{display:inline-block;padding:0.9rem 2.25rem;background:var(--gold);color:var(--black);font-family:var(--mono);font-size:0.7rem;letter-spacing:0.15em;text-transform:uppercase;text-decoration:none;transition:background 0.2s,transform 0.2s}
    .cta-banner a:hover{background:var(--gold-light);transform:translateY(-1px)}
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
    <img src="${imageUrl}" alt="${title} — Indéva Studio" loading="eager" width="1200" height="675" />
    <div class="hero__overlay">
      <p class="hero__eyebrow">Interior Design Journal</p>
      <h2 class="hero__title">${title}</h2>
      <p class="hero__date">${readableDate} · By Indéva Studio</p>
    </div>
  </div>
  <main class="article-wrap">
    ${articleContent}
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

// ── MAIN ────────────────────────────────────────
async function main() {
  console.log("\n🎨 INDEVA STUDIO — BLOG REDESIGN SCRIPT");
  console.log("━".repeat(50));

  if (!fs.existsSync(BLOGS_DIR)) {
    console.error("❌ blogs/ folder not found");
    process.exit(1);
  }

  // Get all HTML files in blogs/ folder
  const files = fs.readdirSync(BLOGS_DIR).filter(f =>
    f.endsWith(".html") && f !== "index.html"
  );

  console.log(`📁 Found ${files.length} blog files to redesign\n`);

  let fixed = 0;
  let skipped = 0;

  for (const file of files) {
    const filePath = path.join(BLOGS_DIR, file);
    const slug = file.replace(".html", "");
    const html = fs.readFileSync(filePath, "utf8");

    // Skip files that already have the new dark design
    if (html.includes("--black:#0a0a0a") || html.includes("var(--black)")) {
      console.log(`  ⏭️  Already styled: ${file}`);
      skipped++;
      continue;
    }

    // Extract old content
    const { title, meta, dateIso, articleContent } = extractOldContent(html);
    const imageUrl = getImageUrl(slug);

    // Build new styled HTML
    const newHtml = buildNewHTML(slug, title, meta, dateIso, articleContent, imageUrl);

    // Save
    fs.writeFileSync(filePath, newHtml);
    console.log(`  ✅ Redesigned: ${file}`);
    fixed++;
  }

  console.log(`\n🎉 DONE!`);
  console.log(`   Redesigned: ${fixed} blogs`);
  console.log(`   Already styled: ${skipped} blogs`);
  console.log("━".repeat(50));
}

main().catch(console.error);
