/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE v5
 * - Uses Claude 3.5 Sonnet (Free Tier via OpenRouter)
 * - Retry handling + robust error checks
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_MODEL = "anthropic/claude-3.5-sonnet:free";

const BLOGS_PER_RUN = 2;
const MAX_ATTEMPTS = 3;
const DELAY_BETWEEN_ATTEMPTS = 5000;

// ─────────────────────────────────────────────
// UTILS
// ─────────────────────────────────────────────
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ─────────────────────────────────────────────
// GENERATE BLOG
// ─────────────────────────────────────────────
async function generateBlog(prompt) {
  console.log(`🤖 Using model: ${OPENROUTER_MODEL}`);

  let response;
  let data;

  try {
    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": "https://indevastudio.com",
        "X-Title": "Indeva Studio Blog Engine"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 4096
      })
    });

    data = await response.json();
  } catch (err) {
    throw new Error("NETWORK_ERROR: " + err.message);
  }

  if (!response.ok || data?.error) {
    throw new Error(`CLAUDE_ERROR: ${JSON.stringify(data?.error || data)}`);
  }

  const text = data?.choices?.[0]?.message?.content;

  if (!text) {
    throw new Error("EMPTY_RESPONSE_FROM_CLAUDE");
  }

  console.log(`✅ Content generated (${text.length} chars)`);

  return text;
}

// ─────────────────────────────────────────────
// SAVE BLOG FILE
// ─────────────────────────────────────────────
function saveBlog(content) {
  const slug = `blog-${Date.now()}`;
  const filePath = path.join(REPO_ROOT, `${slug}.html`);

  const html = `
  <html>
    <head>
      <title>Blog</title>
    </head>
    <body>
      ${content}
    </body>
  </html>
  `;

  fs.writeFileSync(filePath, html);

  console.log(`📄 Blog saved: ${filePath}`);
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log("🚀 BLOG GENERATION STARTED");
  console.log(`🧮 Blogs per run: ${BLOGS_PER_RUN}`);

  if (!OPENROUTER_API_KEY) {
    console.error("❌ OPENROUTER_API_KEY not found");
    process.exit(1);
  }

  const prompt = `
  Write a 1500 word SEO optimized blog on:
  "Farmhouse construction cost in Gurgaon"

  Include:
  - H1, H2, H3
  - SEO optimized headings
  - Cost breakdown in INR
  - Internal linking suggestions
  - FAQ section
  `;

  let result = null;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      result = await generateBlog(prompt);
      break;
    } catch (err) {
      console.log(`⚠️ Attempt ${i + 1} failed: ${err.message}`);

      if (i < MAX_ATTEMPTS - 1) {
        console.log(`⏳ Retrying in ${DELAY_BETWEEN_ATTEMPTS / 1000}s...`);
        await sleep(DELAY_BETWEEN_ATTEMPTS);
      }
    }
  }

  if (!result) {
    console.error("❌ FAILED: Could not generate blog");
    process.exit(1);
  }

  saveBlog(result);

  console.log("🎉 DONE — Blog generated successfully");
}

main().catch(console.error);
