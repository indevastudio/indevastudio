// fan-out/lib/feed.js
// Shared helper: reads the newest entry from feed.xml so every
// platform script pulls the same title/body/canonical/tags/hero image.

const Parser = require("rss-parser");

const FEED_URL = process.env.FEED_URL || "https://www.indevastudio.com/feed.xml";

function extractHeroImage(item) {
  if (item.enclosure && item.enclosure.url) return item.enclosure.url;
  if (item["media:content"] && item["media:content"].$ && item["media:content"].$.url) {
    return item["media:content"].$.url;
  }
  const html = item["content:encoded"] || item.content || "";
  const match = html.match(/<img[^>]+src="([^">]+)"/i);
  return match ? match[1] : null;
}

async function getLatestPost() {
  const parser = new Parser({
    customFields: {
      item: [["media:content", "media:content", { keepArray: false }]],
    },
  });

  const feed = await parser.parseURL(FEED_URL);
  const latest = feed.items && feed.items[0];
  if (!latest) throw new Error(`No entries found in ${FEED_URL}`);

  return {
    title: latest.title,
    canonicalUrl: latest.link,
    html: latest["content:encoded"] || latest.content || "",
    tags: (latest.categories && latest.categories.length)
      ? latest.categories
      : ["interior design", "delhi", "home decor"],
    heroImage: extractHeroImage(latest),
  };
}

module.exports = { getLatestPost, FEED_URL };
