/**
 * INDEVA STUDIO — EMAIL NOTIFIER
 * File: scripts/email-notifier.js
 *
 * Sends a daily summary email after the blog engine commits new posts.
 * Reads the most recent entries from content/blog-memory.json and emails
 * a styled HTML report.
 *
 * Required env vars:
 *   RESEND_API_KEY  — get from https://resend.com (free tier: 3000 emails/month)
 *
 * Optional env vars:
 *   NOTIFY_TO       — recipient email (defaults to hello@indevastudio.com)
 *   NOTIFY_FROM     — sender email (defaults to onboarding@resend.dev for testing,
 *                     change to your verified domain like hello@indevastudio.com)
 *   BLOGS_PER_DAY   — how many recent blogs to include in the summary (default 2)
 *
 * SAFETY NOTE:
 * If the very first character of this file is "(" instead of "/",
 * something pasted a `git apply` command into the file. Delete everything
 * and re-paste from a clean source. The file MUST start with the
 * comment block above.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const MEMORY_FILE = path.join(REPO_ROOT, "content", "blog-memory.json");

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const NOTIFY_TO = process.env.NOTIFY_TO || "ceo@indevastudio.com";
const NOTIFY_FROM = process.env.NOTIFY_FROM || "onboarding@resend.dev";
const BLOGS_PER_DAY = parseInt(process.env.BLOGS_PER_DAY || "2", 10);
const SITE_URL = "https://indevastudio.com";

function loadRecentBlogs() {
  if (!fs.existsSync(MEMORY_FILE)) {
    console.log("ℹ️  No memory file — nothing to report");
    return [];
  }
  try {
    const memory = JSON.parse(fs.readFileSync(MEMORY_FILE, "utf8"));
    const slugs = memory.slugs || [];
    const titles = memory.titles || [];

    // Take the last N entries — those are today's publications
    const recentSlugs = slugs.slice(-BLOGS_PER_DAY);
    const recentTitles = titles.slice(-BLOGS_PER_DAY);

    return recentSlugs.map((slug, i) => ({
      slug,
      title: recentTitles[i] || slug.replace(/-/g, " "),
      url: `${SITE_URL}/insights/${slug}/`,
    }));
  } catch (err) {
    console.warn(`⚠️  Could not parse memory file: ${err.message}`);
    return [];
  }
}

function buildEmailHTML(blogs) {
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const blogCards = blogs.map(b => `
    <div style="background:#141414;border:1px solid rgba(184,154,106,0.2);padding:32px;margin-bottom:16px;">
      <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7250;margin-bottom:12px;">india market</div>
      <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:22px;font-weight:400;color:#f0ebe3;margin:0 0 12px 0;line-height:1.3;">${b.title.toLowerCase()}</h2>
      <a href="${b.url}" style="display:inline-block;font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a6a;text-decoration:none;border:1px solid rgba(184,154,106,0.3);padding:10px 20px;margin-top:8px;">read article ↗</a>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Daily Insights Report — indéva studio</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#f0ebe3;">
  <div style="max-width:600px;margin:0 auto;padding:48px 32px;">

    <div style="text-align:center;margin-bottom:48px;">
      <div style="font-family:'DM Mono',monospace;font-size:10px;letter-spacing:0.3em;text-transform:uppercase;color:#8a7250;margin-bottom:12px;">indéva studio · new delhi</div>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:36px;font-weight:400;font-style:italic;margin:0;color:#f0ebe3;">daily insights report</h1>
      <div style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.15em;color:#a8a39a;margin-top:8px;">${today}</div>
    </div>

    <div style="display:flex;justify-content:space-around;background:#141414;border:1px solid rgba(184,154,106,0.15);padding:32px 16px;margin-bottom:48px;text-align:center;">
      <div>
        <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:300;color:#b89a6a;line-height:1;">${blogs.length}</div>
        <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7250;margin-top:8px;">insights published</div>
      </div>
      <div>
        <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:300;color:#b89a6a;line-height:1;">✓</div>
        <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7250;margin-top:8px;">live on site</div>
      </div>
      <div>
        <div style="font-family:'Cormorant Garamond',Georgia,serif;font-size:32px;font-weight:300;color:#b89a6a;line-height:1;">4am</div>
        <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7250;margin-top:8px;">published at</div>
      </div>
    </div>

    ${blogCards}

    <div style="text-align:center;margin-top:48px;padding-top:32px;border-top:1px solid rgba(240,235,227,0.08);">
      <div style="font-family:'DM Mono',monospace;font-size:9px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7250;margin-bottom:16px;">automated daily report — indéva studio blog engine</div>
      <a href="${SITE_URL}/insights/" style="font-family:'DM Mono',monospace;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#b89a6a;text-decoration:none;">view all insights ↗</a>
    </div>

  </div>
</body>
</html>`;
}

function buildSubjectLine(blogs) {
  const today = new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `Daily Insights Published — Indeva Studio (${blogs.length} article${blogs.length === 1 ? "" : "s"} · ${today})`;
}

async function sendEmail(blogs) {
  if (!RESEND_API_KEY) {
    console.warn("⚠️  RESEND_API_KEY not set — skipping email");
    return;
  }
  if (blogs.length === 0) {
    console.log("ℹ️  No new blogs to report — skipping email");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: NOTIFY_FROM,
      to: [NOTIFY_TO],
      subject: buildSubjectLine(blogs),
      html: buildEmailHTML(blogs),
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    console.error(`❌ Resend HTTP ${response.status}: ${JSON.stringify(data).slice(0, 400)}`);
    // Do not exit non-zero — this is a non-critical step.
    return;
  }

  console.log(`✅ Email sent to ${NOTIFY_TO} — Resend ID: ${data.id}`);
}

async function main() {
  console.log("\n📧 INDEVA STUDIO — EMAIL NOTIFIER");
  console.log("━".repeat(50));

  const blogs = loadRecentBlogs();
  console.log(`📚 Found ${blogs.length} recent blog(s) to report`);
  blogs.forEach((b, i) => console.log(`   ${i + 1}. ${b.title} → ${b.url}`));

  await sendEmail(blogs);
}

main().catch(err => {
  // Email failures should never break the workflow — log and exit clean.
  console.error("❌ Email notifier failed:", err.message);
  process.exit(0);
});
