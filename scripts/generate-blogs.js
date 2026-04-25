/**
 * INDEVA STUDIO — AUTOMATED BLOG ENGINE v4 (FIXED)
 * - Uses Gemini v1 API (FIXED)
 * - Uses latest models (no 404 issue)
 * - Added strong error handling + retry system
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// ✅ UPDATED MODELS (fallback enabled)
const GEMINI_MODELS = [
  "gemini-1.5-flash-latest",
  "gemini-1.5-pro-latest"
];

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
// GENERATE BLOG (FIXED CORE)
// ─────────────────────────────────────────────
async function generateBlog(prompt, attempt = 0) {
  const model = GEMINI_MODELS[attempt % GEMINI_MODELS.length];

  console.log(`🤖 Using model: ${model}`);

  let response;
  let data;

  try {
    response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }]
            }
          ],
          generationConfig: {
            temperature: 0.8,
            maxOutputTokens: 4096
          }
        })
      }
    );

    data = await response.json();

  } catch (err) {
    throw new Error("NETWORK_ERROR: " + err.message);
  }

  // 🚨 STRICT ERROR HANDLING
  if (!response.ok || data?.error) {
    throw new Error(`GEMINI_ERROR: ${JSON.stringify(data?.error || data)}`);
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error("EMPTY_RESPONSE_FROM_GEMINI");
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

  if (!GEMINI_API_KEY) {
    console.error("❌ GEMINI_API_KEY not found");
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
      result = await generateBlog(prompt, i);
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
