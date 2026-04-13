/**
 * INDEVA STUDIO — DAILY EMAIL NOTIFIER
 * Reads newly published insights from /insights/ folder
 * Sends daily report to ceo@indevastudio.com
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const CONFIG = {
  to: "ceo@indevastudio.com",
  from: "indéva studio <hello@indevastudio.com>",
  subject: "Daily Insights Published – Indeva Studio",
  baseUrl: "https://indevastudio.com",
  resendApiKey: process.env.RESEND_API_KEY,
};

// ─────────────────────────────────────────────
// 1. FIND TODAY'S PUBLISHED INSIGHTS
// ─────────────────────────────────────────────
function getTodaysBlogs() {
  const insightsDir = path.join(REPO_ROOT, "insights");
  const today = new Date().toISOString().split("T")[0];

  if (!fs.existsSync(insightsDir)) {
    console.log("⚠️  insights/ folder not found. Skipping email.");
    return [];
  }

  const allBlogs = [];
  const entries = fs.readdirSync(insightsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const slug = entry.name;
    const indexPath = path.join(insightsDir, slug, "index.html");
    if (!fs.existsSync(indexPath)) continue;

    const html = fs.readFileSync(indexPath, "utf8");

    // Extract title
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    const rawTitle = titleMatch
      ? titleMatch[1].replace("— indéva studio", "").trim()
      : slug;

    // Extract meta description
    const metaMatch = html.match(/<meta name="description" content="([^"]+)"/);
    const meta = metaMatch ? metaMatch[1] : "";

    // Extract date from JSON-LD schema
    const dateMatch = html.match(/"datePublished"\s*:\s*"([^"]+)"/);
    const datePublished = dateMatch ? dateMatch[1] : "";

    // Extract category
    const catMatch = html.match(/class="article-cat"[^>]*>([^<]+)<\/span>/);
    const cat = catMatch ? catMatch[1].trim() : "design intelligence";

    allBlogs.push({
      title: rawTitle,
      slug,
      meta,
      date: datePublished,
      cat,
      url: `${CONFIG.baseUrl}/insights/${slug}/`,
    });
  }

  // Sort newest first
  allBlogs.sort((a, b) => (b.date > a.date ? 1 : -1));

  // Try today's blogs first
  let todaysBlogs = allBlogs.filter((b) => b.date === today);

  if (todaysBlogs.length === 0) {
    console.log(`ℹ️  No insights for today (${today}). Sending latest 4.`);
    todaysBlogs = allBlogs.slice(0, 4);
  }

  console.log(`📋 Sending email for ${todaysBlogs.length} insights`);
  return todaysBlogs;
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
    return `
    <div style="margin-bottom:32px; padding:24px; background:#111111; border-left:3px solid #b89a6a;">
      <p style="margin:0 0 4px 0; font-family:monospace; font-size:10px; color:#8a7250; letter-spacing:2px; text-transform:uppercase;">
        ${blog.cat}
      </p>
      <h2 style="margin:8px 0 12px 0; font-size:19px; font-weight:300; color:#f0ebe3; line-height:1.3; font-style:italic;">
        ${blog.title}
      </h2>
      <p style="margin:0 0 20px 0; font-size:13px; color:#a09890; line-height:1.75;">
        ${blog.meta}
      </p>
      <a href="${blog.url}"
         style="display:inline-block; padding:10px 22px; background:#b89a6a; color:#0a0a0a;
                font-family:monospace; font-size:11px; letter-spacing:1px; text-transform:uppercase;
                text-decoration:none;">
        read article ↗
      </a>
      <p style="margin:12px 0 0 0; font-family:monospace; font-size:10px; color:#444;">
        ${blog.url}
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
  <div style="max-width:640px; margin:0 auto; padding:48px 24px;">

    <div style="text-align:center; margin-bottom:48px; padding-bottom:32px; border-bottom:1px solid #1a1a1a;">
      <p style="margin:0 0 8px 0; font-family:monospace; font-size:10px; color:#8a7250; letter-spacing:4px; text-transform:uppercase;">indéva studio · new delhi</p>
      <h1 style="margin:0 0 8px 0; font-size:32px; font-weight:300; color:#f0ebe3; font-style:italic; letter-spacing:-0.02em;">daily insights report</h1>
      <p style="margin:0; font-family:monospace; font-size:11px; color:#444; letter-spacing:0.1em;">${date}</p>
    </div>

    <div style="background:#111; border:1px solid #1a1a1a; padding:24px; margin-bottom:40px;">
      <table style="width:100%; border-collapse:collapse;">
        <tr>
          <td style="text-align:center; padding:0 16px 0 0; border-right:1px solid #1a1a1a;">
            <p style="margin:0; font-size:36px; font-weight:300; color:#b89a6a; font-family:Georgia,serif;">${blogs.length}</p>
            <p style="margin:6px 0 0 0; font-family:monospace; font-size:9px; color:#444; text-transform:uppercase; letter-spacing:1px;">insights published</p>
          </td>
          <td style="text-align:center; padding:0 16px;">
            <p style="margin:0; font-size:36px; font-weight:300; color:#b89a6a;">✓</p>
            <p style="margin:6px 0 0 0; font-family:monospace; font-size:9px; color:#444; text-transform:uppercase; letter-spacing:1px;">live on site</p>
          </td>
          <td style="text-align:center; padding:0 0 0 16px; border-left:1px solid #1a1a1a;">
            <p style="margin:0; font-size:36px; font-weight:300; color:#b89a6a; font-family:monospace;">4am</p>
            <p style="margin:6px 0 0 0; font-family:monospace; font-size:9px; color:#444; text-transform:uppercase; letter-spacing:1px;">published at</p>
          </td>
        </tr>
      </table>
    </div>

    ${blogCards}

    <div style="margin-top:48px; padding-top:24px; border-top:1px solid #1a1a1a; text-align:center;">
      <p style="margin:0 0 12px 0; font-family:monospace; font-size:10px; color:#333; letter-spacing:0.1em;">
        automated daily report · indéva studio blog engine
      </p>
      <a href="${CONFIG.baseUrl}/insights/"
         style="font-family:monospace; font-size:10px; color:#b89a6a; text-decoration:none; letter-spacing:0.1em;">
        view all insights ↗
      </a>
    </div>

  </div>
</body>
</html>`;
}

// ─────────────────────────────────────────────
// 3. PLAIN TEXT VERSION
// ─────────────────────────────────────────────
function buildEmailText(blogs) {
  return [
    "INDÉVA STUDIO — DAILY INSIGHTS REPORT",
    "━".repeat(40),
    "",
    ...blogs.map((b, i) =>
      `${i + 1}. ${b.title}\n   ${b.url}\n   ${b.meta}\n`
    ),
    "",
    `View all insights: ${CONFIG.baseUrl}/insights/`,
  ].join("\n");
}

// ─────────────────────────────────────────────
// 4. SEND EMAIL VIA RESEND
// ─────────────────────────────────────────────
async function sendEmail(blogs) {
  if (!CONFIG.resendApiKey) {
    throw new Error("RESEND_API_KEY is not set");
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CONFIG.resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: CONFIG.from,
      to: [CONFIG.to],
      subject: `${CONFIG.subject} (${blogs.length} articles · ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" })})`,
      html: buildEmailHTML(blogs),
      text: buildEmailText(blogs),
    }),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(`Resend error: ${JSON.stringify(result)}`);
  console.log(`✅ Email sent! ID: ${result.id}`);
  return result;
}

// ─────────────────────────────────────────────
// 5. SEND WITH RETRY
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
// 6. MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("\n📬 INDEVA STUDIO — EMAIL NOTIFIER");
  console.log("━".repeat(40));

  const blogs = getTodaysBlogs();

  if (blogs.length === 0) {
    console.log("⏭️  Nothing to send. Exiting.");
    return;
  }

  await sendWithRetry(blogs);
  console.log("━".repeat(40));
}

main().catch(console.error);
