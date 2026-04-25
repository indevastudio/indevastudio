diff --git a/scripts/email-notifier.js b/scripts/email-notifier.js
index f8a88b968ff63c8ecfee977c4263439719f9cc9d..e8b18712c777016ab60566d5dc97d928dd900f47 100644
--- a/scripts/email-notifier.js
+++ b/scripts/email-notifier.js
@@ -1,41 +1,41 @@
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
-  to: "ceo@indevastudio.com",
-  from: "indéva studio <hello@indevastudio.com>",
+  to: process.env.EMAIL_TO || "ceo@indevastudio.com",
+  from: process.env.EMAIL_FROM || "Indeva Studio <hello@indevastudio.com>",
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
@@ -222,37 +222,46 @@ async function sendEmail(blogs) {
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
 
+  console.log(`📮 Recipient: ${CONFIG.to}`);
+
   const blogs = getTodaysBlogs();
 
   if (blogs.length === 0) {
     console.log("⏭️  Nothing to send. Exiting.");
     return;
   }
 
-  await sendWithRetry(blogs);
+  const sent = await sendWithRetry(blogs);
+  if (!sent) {
+    throw new Error("Email delivery failed after retries");
+  }
+
   console.log("━".repeat(40));
 }
 
-main().catch(console.error);
+main().catch((error) => {
+  console.error("❌ Email notifier failed:", error);
+  process.exit(1);
+});
