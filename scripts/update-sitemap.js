/**
 * INDEVA STUDIO — SITEMAP UPDATER
 * Reads tracking.json and rebuilds sitemap.xml
 * with every blog URL included
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const BASE_URL = "https://indevastudio.com";

function buildSitemap() {
  // Load blogs from tracking.json
  const trackingPath = path.join(REPO_ROOT, "blogs", "tracking.json");
  let blogUrls = [];

  if (fs.existsSync(trackingPath)) {
    const data = JSON.parse(fs.readFileSync(trackingPath, "utf8"));
    const posts = data.all_posts || [];

    blogUrls = posts.map((post) => ({
      url: `${BASE_URL}/blogs/${post.slug}`,
      lastmod: post.date_iso || new Date().toISOString().split("T")[0],
      priority: "0.8",
      changefreq: "monthly",
    }));
  }

  // Static pages
  const staticPages = [
    { url: `${BASE_URL}/`, priority: "1.0", changefreq: "weekly" },
    { url: `${BASE_URL}/blogs/`, priority: "0.9", changefreq: "daily" },
    { url: `${BASE_URL}/interior-designer-delhi`, priority: "0.9", changefreq: "monthly" },
    { url: `${BASE_URL}/interior-designer-gurgaon`, priority: "0.9", changefreq: "monthly" },
    { url: `${BASE_URL}/interior-designer-noida`, priority: "0.9", changefreq: "monthly" },
  ];

  const today = new Date().toISOString().split("T")[0];

  // Build XML
  const urlEntries = [...staticPages, ...blogUrls]
    .map((page) => `
  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastmod || today}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`)
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  // Save sitemap
  const sitemapPath = path.join(REPO_ROOT, "sitemap.xml");
  fs.writeFileSync(sitemapPath, xml);

  console.log(`✅ Sitemap updated with ${blogUrls.length} blogs + ${staticPages.length} static pages`);
  console.log(`📍 Total URLs: ${blogUrls.length + staticPages.length}`);
}

buildSitemap();
