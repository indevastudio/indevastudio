 (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
diff --git a/scripts/generate-blogs.js b/scripts/generate-blogs.js
index c8d8068939d25ff34579907b9c3652333a80b204..4b9431a74cecd9b5eaa02f905ce7606a3d10c172 100644
--- a/scripts/generate-blogs.js
+++ b/scripts/generate-blogs.js
@@ -1,381 +1,156 @@
- (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
-diff --git a/scripts/generate-blogs.js b/scripts/generate-blogs.js
-index 2ec05d1ab15308f2ba2ecbdadf923ca36322d259..164cd9046e1ef6964aeb465c4c31e05e224dadd6 100644
---- a/scripts/generate-blogs.js
-+++ b/scripts/generate-blogs.js
-@@ -1,221 +1,151 @@
-- (cd "$(git rev-parse --show-toplevel)" && git apply --3way <<'EOF' 
--diff --git a/scripts/generate-blogs.js b/scripts/generate-blogs.js
--index effc9593bfa7565958c4df846987944cdef1b2a5..e3d8bd5b446440bcd07eb4a6d674a8f826ebc90e 100644
----- a/scripts/generate-blogs.js
--+++ b/scripts/generate-blogs.js
--@@ -1,161 +1,151 @@
-- /**
--- * INDEVA STUDIO — AUTOMATED BLOG ENGINE v4 (FIXED)
--- * - Uses Gemini v1 API (FIXED)
--- * - Uses latest models (no 404 issue)
--- * - Added strong error handling + retry system
--+ * INDEVA STUDIO — AUTOMATED BLOG ENGINE v6
--+ * - Uses Claude 3.5 Sonnet (Free Tier via OpenRouter)
--+ * - Retry handling + robust response parsing
--  */
-- 
-- import fs from "fs";
-- import path from "path";
-- import { fileURLToPath } from "url";
-- 
-- const __dirname = path.dirname(fileURLToPath(import.meta.url));
-- const REPO_ROOT = path.join(__dirname, "..");
-- 
---const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
--+const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
--+const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet:free";
-- 
---// ✅ UPDATED MODELS (fallback enabled)
---const GEMINI_MODELS = [
---  "gemini-1.5-flash-latest",
---  "gemini-1.5-pro-latest"
---];
---
---const BLOGS_PER_RUN = 2;
-- const MAX_ATTEMPTS = 3;
-- const DELAY_BETWEEN_ATTEMPTS = 5000;
-- 
---// ─────────────────────────────────────────────
---// UTILS
---// ─────────────────────────────────────────────
-- function sleep(ms) {
--   return new Promise(resolve => setTimeout(resolve, ms));
-- }
-- 
---// ─────────────────────────────────────────────
---// GENERATE BLOG (FIXED CORE)
---// ─────────────────────────────────────────────
---async function generateBlog(prompt, attempt = 0) {
---  const model = GEMINI_MODELS[attempt % GEMINI_MODELS.length];
--+function extractTextFromResponse(data) {
--+  const content = data?.choices?.[0]?.message?.content;
--+
--+  if (typeof content === "string") {
--+    return content.trim();
--+  }
--+
--+  if (Array.isArray(content)) {
--+    return content
--+      .map(part => {
--+        if (typeof part === "string") return part;
--+        if (part?.type === "text") return part.text || "";
--+        return "";
--+      })
--+      .join("\n")
--+      .trim();
--+  }
--+
--+  return "";
--+}
-- 
---  console.log(`🤖 Using model: ${model}`);
--+async function generateBlog(prompt) {
--+  console.log(`🤖 Using model: ${OPENROUTER_MODEL}`);
-- 
--   let response;
--   let data;
-- 
--   try {
---    response = await fetch(
---      `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${GEMINI_API_KEY}`,
---      {
---        method: "POST",
---        headers: {
---          "Content-Type": "application/json"
---        },
---        body: JSON.stringify({
---          contents: [
---            {
---              parts: [{ text: prompt }]
---            }
---          ],
---          generationConfig: {
---            temperature: 0.8,
---            maxOutputTokens: 4096
---          }
---        })
---      }
---    );
--+    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
--+      method: "POST",
--+      headers: {
--+        "Content-Type": "application/json",
--+        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
--+        "HTTP-Referer": "https://indevastudio.com",
--+        "X-Title": "Indeva Studio Blog Engine"
--+      },
--+      body: JSON.stringify({
--+        model: OPENROUTER_MODEL,
--+        messages: [{ role: "user", content: prompt }],
--+        temperature: 0.8,
--+        max_tokens: 4096
--+      })
--+    });
-- 
--     data = await response.json();
---
--   } catch (err) {
--     throw new Error("NETWORK_ERROR: " + err.message);
--   }
-- 
---  // 🚨 STRICT ERROR HANDLING
--   if (!response.ok || data?.error) {
---    throw new Error(`GEMINI_ERROR: ${JSON.stringify(data?.error || data)}`);
--+    throw new Error(`CLAUDE_ERROR: ${JSON.stringify(data?.error || data)}`);
--   }
-- 
---  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
--+  const text = extractTextFromResponse(data);
-- 
--   if (!text) {
---    throw new Error("EMPTY_RESPONSE_FROM_GEMINI");
--+    throw new Error("EMPTY_RESPONSE_FROM_CLAUDE");
--   }
-- 
--   console.log(`✅ Content generated (${text.length} chars)`);
---
--   return text;
-- }
-- 
---// ─────────────────────────────────────────────
---// SAVE BLOG FILE
---// ─────────────────────────────────────────────
-- function saveBlog(content) {
--   const slug = `blog-${Date.now()}`;
--   const filePath = path.join(REPO_ROOT, `${slug}.html`);
-- 
--   const html = `
--   <html>
--     <head>
--       <title>Blog</title>
--     </head>
--     <body>
--       ${content}
--     </body>
--   </html>
--   `;
-- 
--   fs.writeFileSync(filePath, html);
---
--   console.log(`📄 Blog saved: ${filePath}`);
-- }
-- 
---// ─────────────────────────────────────────────
---// MAIN
---// ─────────────────────────────────────────────
-- async function main() {
--   console.log("🚀 BLOG GENERATION STARTED");
-- 
---  if (!GEMINI_API_KEY) {
---    console.error("❌ GEMINI_API_KEY not found");
--+  if (!OPENROUTER_API_KEY) {
--+    console.error("❌ OPENROUTER_API_KEY not found");
--     process.exit(1);
--   }
-- 
--   const prompt = `
--   Write a 1500 word SEO optimized blog on:
--   "Farmhouse construction cost in Gurgaon"
-- 
--   Include:
--   - H1, H2, H3
--   - SEO optimized headings
--   - Cost breakdown in INR
--   - Internal linking suggestions
--   - FAQ section
--   `;
-- 
--   let result = null;
-- 
---  for (let i = 0; i < MAX_ATTEMPTS; i++) {
--+  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
--     try {
---      result = await generateBlog(prompt, i);
--+      result = await generateBlog(prompt);
--       break;
--     } catch (err) {
---      console.log(`⚠️ Attempt ${i + 1} failed: ${err.message}`);
--+      console.log(`⚠️ Attempt ${attempt} failed: ${err.message}`);
-- 
---      if (i < MAX_ATTEMPTS - 1) {
--+      if (attempt < MAX_ATTEMPTS) {
--         console.log(`⏳ Retrying in ${DELAY_BETWEEN_ATTEMPTS / 1000}s...`);
--         await sleep(DELAY_BETWEEN_ATTEMPTS);
--       }
--     }
--   }
-- 
--   if (!result) {
--     console.error("❌ FAILED: Could not generate blog");
--     process.exit(1);
--   }
-- 
--   saveBlog(result);
---
--   console.log("🎉 DONE — Blog generated successfully");
-- }
-- 
-- main().catch(console.error);
-- 
--EOF
--)
-+/**
-+ * INDEVA STUDIO — AUTOMATED BLOG ENGINE v6
-+ * - Uses Claude 3.5 Sonnet (Free Tier via OpenRouter)
-+ * - Retry handling + robust response parsing
-+ */
-+
-+import fs from "fs";
-+import path from "path";
-+import { fileURLToPath } from "url";
-+
-+const __dirname = path.dirname(fileURLToPath(import.meta.url));
-+const REPO_ROOT = path.join(__dirname, "..");
-+
-+const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
-+const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet:free";
-+
-+const MAX_ATTEMPTS = 3;
-+const DELAY_BETWEEN_ATTEMPTS = 5000;
-+
-+function sleep(ms) {
-+  return new Promise(resolve => setTimeout(resolve, ms));
-+}
-+
-+function extractTextFromResponse(data) {
-+  const content = data?.choices?.[0]?.message?.content;
-+
-+  if (typeof content === "string") {
-+    return content.trim();
-+  }
-+
-+  if (Array.isArray(content)) {
-+    return content
-+      .map(part => {
-+        if (typeof part === "string") return part;
-+        if (part?.type === "text") return part.text || "";
-+        return "";
-+      })
-+      .join("\n")
-+      .trim();
-+  }
-+
-+  return "";
-+}
-+
-+async function generateBlog(prompt) {
-+  console.log(`🤖 Using model: ${OPENROUTER_MODEL}`);
-+
-+  let response;
-+  let data;
-+
-+  try {
-+    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
-+      method: "POST",
-+      headers: {
-+        "Content-Type": "application/json",
-+        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
-+        "HTTP-Referer": "https://indevastudio.com",
-+        "X-Title": "Indeva Studio Blog Engine"
-+      },
-+      body: JSON.stringify({
-+        model: OPENROUTER_MODEL,
-+        messages: [{ role: "user", content: prompt }],
-+        temperature: 0.8,
-+        max_tokens: 4096
-+      })
-+    });
-+
-+    data = await response.json();
-+  } catch (err) {
-+    throw new Error(`NETWORK_ERROR: ${err.message}`);
-+  }
-+
-+  if (!response.ok || data?.error) {
-+    throw new Error(`CLAUDE_ERROR: ${JSON.stringify(data?.error || data)}`);
-+  }
-+
-+  const text = extractTextFromResponse(data);
-+
-+  if (!text) {
-+    throw new Error("EMPTY_RESPONSE_FROM_CLAUDE");
-+  }
-+
-+  console.log(`✅ Content generated (${text.length} chars)`);
-+  return text;
-+}
-+
-+function saveBlog(content) {
-+  const slug = `blog-${Date.now()}`;
-+  const filePath = path.join(REPO_ROOT, `${slug}.html`);
-+
-+  const html = `
-+  <html>
-+    <head>
-+      <title>Blog</title>
-+    </head>
-+    <body>
-+      ${content}
-+    </body>
-+  </html>
-+  `;
-+
-+  fs.writeFileSync(filePath, html);
-+  console.log(`📄 Blog saved: ${filePath}`);
-+}
-+
-+async function main() {
-+  console.log("🚀 BLOG GENERATION STARTED");
-+
-+  if (!OPENROUTER_API_KEY) {
-+    console.error("❌ OPENROUTER_API_KEY not found");
-+    process.exit(1);
-+  }
-+
-+  const prompt = `
-+  Write a 1500 word SEO optimized blog on:
-+  "Farmhouse construction cost in Gurgaon"
-+
-+  Include:
-+  - H1, H2, H3
-+  - SEO optimized headings
-+  - Cost breakdown in INR
-+  - Internal linking suggestions
-+  - FAQ section
-+  `;
-+
-+  let result = null;
-+
-+  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
-+    try {
-+      result = await generateBlog(prompt);
-+      break;
-+    } catch (err) {
-+      console.log(`⚠️ Attempt ${attempt} failed: ${err.message}`);
-+
-+      if (attempt < MAX_ATTEMPTS) {
-+        console.log(`⏳ Retrying in ${DELAY_BETWEEN_ATTEMPTS / 1000}s...`);
-+        await sleep(DELAY_BETWEEN_ATTEMPTS);
-+      }
-+    }
-+  }
-+
-+  if (!result) {
-+    console.error("❌ FAILED: Could not generate blog");
-+    process.exit(1);
-+  }
-+
-+  saveBlog(result);
-+  console.log("🎉 DONE — Blog generated successfully");
-+}
-+
-+main().catch(console.error);
- 
-EOF
-)
+/**
+ * INDEVA STUDIO — AUTOMATED BLOG ENGINE v6
+ * - Uses Claude 3.5 Sonnet (Free Tier via OpenRouter)
+ * - Retry handling + robust response parsing
+ */
+
+import fs from "fs";
+import path from "path";
+import { fileURLToPath } from "url";
+
+const __dirname = path.dirname(fileURLToPath(import.meta.url));
+const REPO_ROOT = path.join(__dirname, "..");
+
+const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || process.env.GEMINI_API_KEY;
+const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "anthropic/claude-3.5-sonnet:free";
+
+const MAX_ATTEMPTS = 3;
+const DELAY_BETWEEN_ATTEMPTS = 5000;
+
+function sleep(ms) {
+  return new Promise((resolve) => setTimeout(resolve, ms));
+}
+
+function extractTextFromResponse(data) {
+  const content = data?.choices?.[0]?.message?.content;
+
+  if (typeof content === "string") {
+    return content.trim();
+  }
+
+  if (Array.isArray(content)) {
+    return content
+      .map((part) => {
+        if (typeof part === "string") return part;
+        if (part?.type === "text") return part.text || "";
+        return "";
+      })
+      .join("\n")
+      .trim();
+  }
+
+  return "";
+}
+
+async function generateBlog(prompt) {
+  console.log(`🤖 Using model: ${OPENROUTER_MODEL}`);
+
+  let response;
+  let data;
+
+  try {
+    response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
+      method: "POST",
+      headers: {
+        "Content-Type": "application/json",
+        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
+        "HTTP-Referer": "https://indevastudio.com",
+        "X-Title": "Indeva Studio Blog Engine"
+      },
+      body: JSON.stringify({
+        model: OPENROUTER_MODEL,
+        messages: [{ role: "user", content: prompt }],
+        temperature: 0.8,
+        max_tokens: 4096
+      })
+    });
+
+    const rawBody = await response.text();
+    try {
+      data = rawBody ? JSON.parse(rawBody) : {};
+    } catch {
+      throw new Error(`INVALID_JSON_RESPONSE: ${rawBody.slice(0, 300)}`);
+    }
+  } catch (err) {
+    throw new Error(`NETWORK_ERROR: ${err.message}`);
+  }
+
+  if (!response.ok || data?.error) {
+    throw new Error(`CLAUDE_ERROR: ${JSON.stringify(data?.error || data)}`);
+  }
+
+  const text = extractTextFromResponse(data);
+
+  if (!text) {
+    throw new Error("EMPTY_RESPONSE_FROM_CLAUDE");
+  }
+
+  console.log(`✅ Content generated (${text.length} chars)`);
+  return text;
+}
+
+function saveBlog(content) {
+  const slug = `blog-${Date.now()}`;
+  const filePath = path.join(REPO_ROOT, `${slug}.html`);
+
+  const html = `
+  <html>
+    <head>
+      <title>Blog</title>
+    </head>
+    <body>
+      ${content}
+    </body>
+  </html>
+  `;
+
+  fs.writeFileSync(filePath, html);
+  console.log(`📄 Blog saved: ${filePath}`);
+}
+
+async function main() {
+  console.log("🚀 BLOG GENERATION STARTED");
+
+  if (!OPENROUTER_API_KEY) {
+    console.warn("⚠️ OPENROUTER_API_KEY (or legacy GEMINI_API_KEY) not found; skipping generation.");
+    return;
+  }
+
+  const prompt = `
+  Write a 1500 word SEO optimized blog on:
+  "Farmhouse construction cost in Gurgaon"
+
+  Include:
+  - H1, H2, H3
+  - SEO optimized headings
+  - Cost breakdown in INR
+  - Internal linking suggestions
+  - FAQ section
+  `;
+
+  let result = null;
+
+  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
+    try {
+      result = await generateBlog(prompt);
+      break;
+    } catch (err) {
+      console.log(`⚠️ Attempt ${attempt} failed: ${err.message}`);
+
+      if (attempt < MAX_ATTEMPTS) {
+        console.log(`⏳ Retrying in ${DELAY_BETWEEN_ATTEMPTS / 1000}s...`);
+        await sleep(DELAY_BETWEEN_ATTEMPTS);
+      }
+    }
+  }
+
+  if (!result) {
+    console.error("❌ FAILED: Could not generate blog");
+    process.exit(1);
+  }
+
+  saveBlog(result);
+  console.log("🎉 DONE — Blog generated successfully");
+}
+
+main().catch(console.error);
 
EOF
)
