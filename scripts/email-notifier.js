/**
 * INDEVA STUDIO — DAILY EMAIL NOTIFIER
 * Fixed to read tracking.json format correctly
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const CONFIG = {
  to: "ceo@indevastudio.com",
  from: "Indéva Studio <hello@indevastudio.com>",
  subject: "Daily Blogs Published – Indeva Studio",
  baseUrl: "https://indevastudio.com",
  resendApiKey: process.env.RESEND_API_KEY,
};

// ─────────────────────────────────────────────
// 1. LOAD BLOGS FROM tracking.json
// ─────────────────────────────────────────────
function getBlogs() {
  const trackingPath = path.join(REPO_ROOT, "blogs", "tracking.json");

  if (!fs.existsSync(trackingPath)) {
    console.log("⚠️  No tracking.json found. Skipping email.");
    return [];
  }

  const data = JSON.parse(fs.readFileSync(trackingPath, "utf8"));

  // tracking.json has { all_posts: [...] }
  const allPosts = data.all_posts || data || [];

  if (allPosts.length === 0) {
    console.log("⚠️  No posts found in tracking.json.");
    return [];
  }

  // Get today's date
  const today = new Date().toISOString().split("T")[0];

  // Try to find today's blogs first
  let blogs = allPosts.filter((b) => b.date_iso === today);

  // If none today, use the 4 most recent
  if (blogs.length === 0) {
    console.log(`ℹ️  No blogs for today (${today}). Sending latest 4.`);
    blogs = allPosts.slice(0, 4);
  }

  console.log(`📋 Sending email for ${blogs.length} blogs`);
  return blogs;
}

// ─────────────────────────────────────────────
// 2. BUILD EMAIL HTML
// ─────────────────────────────────────────────
function buildEmailHTML(blogs) {
  const date = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const blogCards = blogs.map((blog, i) => {
    const title = blog.title || "Untitled";
    const slug = blog.slug || "";
    const excerpt = blog.meta_description || blog.meta || blog.lead || "";
    const url = `${CONFIG.baseUrl}/blogs/${slug}`;

    return `
    <div style="margin-bottom:32px; padding:24px; background:#1a1a1a; border-left:3px solid #b89a6a; border-radius:2px;">
      <p style="margin:0 0 4px 0; font-family:monospace; font-size:11px; color:#b89a6a; letter-spacing:2px; text-transform:uppercase;">
        Blog ${i + 1} of ${blogs.length}
      </p>
      <h2 style="margin:8px 0 12px 0; font-size:20px; font-weight:400; color:#f0ebe3; line-height:1.3;">
        ${title}
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
  }).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin:0; padding:0; background:#0a0a0a; font-family:Georgia, serif;">
  <div style="max-width:640px; margin:0 auto; padding:40px 20px;">

    <div style="text-align:center; margin-bottom:40px; padding-bottom:32px; border-bottom:1px solid #222;">
      <p style="margin:0 0 8px 0; font-family:monospace; font-size:11px; color:#b89a6a; letter-spacing:3px; text-transform:uppercase;">Indéva Studio</p>
      <h1 style="margin:0 0 8px 0; font-size:28px; font-weight:300; color:#f0ebe3; font-style:italic;">Daily Blog Report</h1>
      <p style="margin:0; font-family:monospace; font-size:12px; color:#555;">${date}</p>
    </div>

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

    ${blogCards}

    <div style="margin-top:40px; padding-top:24px; border-top:1px solid #1a1a1a; text-align:center;">
      <p style="margin:0 0 8px 0; font-family:monospace; font-size:11px; color:#333;">This is an automated report from your blog publishing system.</p>
      <a href="${CONFIG.baseUrl}/blogs/" style="font-family:monospace; font-size:11px; color:#b89a6a; text-decoration:none;">View All Blogs →</a>
    </div>

  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 3. SEND EMAIL VIA RESEND
// ─────────────────────────────────────────────
async function sendEmail(blogs) {
  if (!CONFIG.resendApiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const html = buildEmailHTML(blogs);
  const text = blogs.map((b, i) =>
    `${i + 1}. ${b.title}\n   ${CONFIG.baseUrl}/blogs/${b.slug}\n   ${b.meta_description || ""}\n`
  ).join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONFIG.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONFIG.from,
      to: [CONFIG.to],
      subject: `${CONFIG.subject} (${blogs.length} articles)`,
      html,
      text,
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Resend error: ${JSON.stringify(result)}`);

  console.log(`✅ Email sent! ID: ${result.id}`);
  return result;
}

// ─────────────────────────────────────────────
// 4. SEND WITH RETRY
// ─────────────────────────────────────────────
async function sendWithRetry(blogs, attempts = 2) {
  for (let i = 1; i <= attempts; i++) {
    try {
      console.log(`📧 Sending email (attempt ${i}/${attempts})...`);
      await sendEmail(blogs);
      return true;
    } catch (err) {
      console.error(`❌ Attempt ${i} failed:`, err.message);
      if (i < attempts) {
        console.log("⏳ Retrying in 5 seconds...");
        await new Promise((r) => setTimeout(r, 5000));
      }
    }
  }
  console.error("❌ All attempts failed.");
  return false;
}

// ─────────────────────────────────────────────
// 5. MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("\n📬 INDEVA STUDIO — EMAIL NOTIFIER");
  console.log("━".repeat(40));

  const blogs = getBlogs();
  if (blogs.length === 0) {
    console.log("⏭️  Nothing to send. Exiting.");
    return;
  }

  await sendWithRetry(blogs);
  console.log("━".repeat(40));
}

main().catch(console.error);
