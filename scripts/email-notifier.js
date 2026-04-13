/**
 * INDEVA STUDIO — DAILY EMAIL NOTIFIER
 * Sends blog summary email after successful publishing
 * Uses Resend (free tier — 100 emails/day, no credit card)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

// ─────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────
const CONFIG = {
  to: "ceo@indevastudio.com",
  from: "Indéva Studio <hello@indevastudio.com>",
  subject: "Daily Blogs Published – Indeva Studio",
  baseUrl: "https://indevastudio.com",
  resendApiKey: process.env.RESEND_API_KEY,
};

// ─────────────────────────────────────────────
// 1. LOAD TODAY'S PUBLISHED BLOGS
// ─────────────────────────────────────────────
function getTodaysBlogs() {
  const indexPath = path.join(REPO_ROOT, "blogs", "index.json");

  if (!fs.existsSync(indexPath)) {
    console.log("⚠️  No blog index found. Skipping email.");
    return [];
  }

  const allBlogs = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const today = new Date().toISOString().split("T")[0];

  // Filter only today's blogs
  const todaysBlogs = allBlogs.filter((b) => b.date === today);

  console.log(`📋 Found ${todaysBlogs.length} blogs published today`);
  return todaysBlogs;
}

// ─────────────────────────────────────────────
// 2. EXTRACT EXCERPT FROM BLOG HTML FILE
// ─────────────────────────────────────────────
function extractExcerpt(slug) {
  try {
    const filePath = path.join(REPO_ROOT, "blogs", `${slug}.html`);
    if (!fs.existsSync(filePath)) return "";

    const html = fs.readFileSync(filePath, "utf8");

    // Extract first paragraph text after <article>
    const match = html.match(/<article[^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/);
    if (!match) return "";

    // Strip HTML tags
    const text = match[1]
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim();

    // Return first 200 chars
    return text.length > 200 ? text.substring(0, 200) + "..." : text;
  } catch (_) {
    return "";
  }
}

// ─────────────────────────────────────────────
// 3. BUILD EMAIL HTML
// ─────────────────────────────────────────────
function buildEmailHTML(blogs) {
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blogCards = blogs
    .map((blog, i) => {
      const url = `${CONFIG.baseUrl}/blogs/${blog.slug}`;
      const excerpt = extractExcerpt(blog.slug) || blog.meta || "";

      return `
      <div style="margin-bottom:32px; padding:24px; background:#1a1a1a; border-left:3px solid #b89a6a; border-radius:2px;">
        <p style="margin:0 0 4px 0; font-family:monospace; font-size:11px; color:#b89a6a; letter-spacing:2px; text-transform:uppercase;">
          Blog ${i + 1} of ${blogs.length}
        </p>
        <h2 style="margin:8px 0 12px 0; font-size:20px; font-weight:400; color:#f0ebe3; line-height:1.3;">
          ${blog.title}
        </h2>
        <p style="margin:0 0 16px 0; font-size:14px; color:#a09890; line-height:1.7;">
          ${excerpt}
        </p>
        <a href="${url}"
           style="display:inline-block; padding:10px 20px; background:#b89a6a; color:#0a0a0a;
                  font-family:monospace; font-size:12px; letter-spacing:1px; text-transform:uppercase;
                  text-decoration:none; border-radius:1px;">
          View Live Article →
        </a>
        <p style="margin:12px 0 0 0; font-family:monospace; font-size:11px; color:#555;">
          🔗 ${url}
        </p>
      </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#0a0a0a; font-family:Georgia, serif;">

  <div style="max-width:640px; margin:0 auto; padding:40px 20px;">

    <!-- HEADER -->
    <div style="text-align:center; margin-bottom:40px; padding-bottom:32px; border-bottom:1px solid #222;">
      <p style="margin:0 0 8px 0; font-family:monospace; font-size:11px; color:#b89a6a; letter-spacing:3px; text-transform:uppercase;">
        Indéva Studio
      </p>
      <h1 style="margin:0 0 8px 0; font-size:28px; font-weight:300; color:#f0ebe3; font-style:italic;">
        Daily Blog Report
      </h1>
      <p style="margin:0; font-family:monospace; font-size:12px; color:#555;">
        ${date}
      </p>
    </div>

    <!-- SUMMARY BAR -->
    <div style="background:#111; border:1px solid #222; padding:20px 24px; margin-bottom:32px; border-radius:2px;">
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="text-align:center; padding:0 16px 0 0; border-right:1px solid #222;">
            <p style="margin:0; font-size:32px; font-weight:300; color:#b89a6a;">${blogs.length}</p>
            <p style="margin:4px 0 0 0; font-family:monospace; font-size:10px; color:#555; text-transform:uppercase; letter-spacing:1px;">Blogs Published</p>
          </td>
          <td style="text-align:center; padding:0 16px;">
            <p style="margin:0; font-size:32px; font-weight:300; color:#b89a6a;">✓</p>
            <p style="margin:4px 0 0 0; font-family:monospace; font-size:10px; color:#555; text-transform:uppercase; letter-spacing:1px;">All Live</p>
          </td>
          <td style="text-align:center; padding:0 0 0 16px; border-left:1px solid #222;">
            <p style="margin:0; font-size:32px; font-weight:300; color:#b89a6a;">4AM</p>
            <p style="margin:4px 0 0 0; font-family:monospace; font-size:10px; color:#555; text-transform:uppercase; letter-spacing:1px;">Published At</p>
          </td>
        </tr>
      </table>
    </div>

    <!-- BLOG CARDS -->
    ${blogCards}

    <!-- FOOTER -->
    <div style="margin-top:40px; padding-top:24px; border-top:1px solid #1a1a1a; text-align:center;">
      <p style="margin:0 0 8px 0; font-family:monospace; font-size:11px; color:#333;">
        This is an automated report from your blog publishing system.
      </p>
      <a href="${CONFIG.baseUrl}/blogs/"
         style="font-family:monospace; font-size:11px; color:#b89a6a; text-decoration:none;">
        View All Blogs →
      </a>
    </div>

  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 4. SEND EMAIL VIA RESEND
// ─────────────────────────────────────────────
async function sendEmail(blogs) {
  if (!CONFIG.resendApiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  const html = buildEmailHTML(blogs);

  // Plain text fallback
  const text = blogs
    .map(
      (b, i) =>
        `${i + 1}. ${b.title}\n   ${CONFIG.baseUrl}/blogs/${b.slug}\n   ${b.meta}\n`
    )
    .join("\n");

  const payload = {
    from: CONFIG.from,
    to: [CONFIG.to],
    subject: `${CONFIG.subject} (${blogs.length} articles)`,
    html,
    text,
  };

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONFIG.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(`Resend API error: ${JSON.stringify(result)}`);
  }

  return result;
}

// ─────────────────────────────────────────────
// 5. SEND WITH RETRY
// ─────────────────────────────────────────────
async function sendWithRetry(blogs, attempts = 2) {
  for (let i = 1; i <= attempts; i++) {
    try {
      console.log(`📧 Sending email (attempt ${i}/${attempts})...`);
      const result = await sendEmail(blogs);
      console.log(`✅ Email sent successfully! ID: ${result.id}`);
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${i} failed:`, err.message);
      if (i < attempts) {
        console.log("⏳ Retrying in 5 seconds...");
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }
  console.error("❌ All email attempts failed. Moving on.");
  return false;
}

// ─────────────────────────────────────────────
// 6. MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("\n📬 INDEVA STUDIO — EMAIL NOTIFIER");
  console.log("━".repeat(40));

  const blogs = getTodaysBlogs();

  if (blogs.length === 0) {
    console.log("⏭️  No blogs published today. No email sent.");
    return;
  }

  await sendWithRetry(blogs);
  console.log("━".repeat(40));
}

main().catch(console.error);
