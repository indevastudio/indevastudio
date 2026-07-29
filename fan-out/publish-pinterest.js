// fan-out/publish-pinterest.js
// Nofollow, but design/home-decor is Pinterest's strongest niche —
// worth automating for referral traffic and long content shelf-life.

const fetch = require("node-fetch");
const { getLatestPost } = require("./lib/feed");

async function publishToPinterest() {
  const post = await getLatestPost();

  if (!post.heroImage) {
    console.log("⚠️  Pinterest: no hero image found in feed entry, skipping pin.");
    return;
  }

  const res = await fetch("https://api.pinterest.com/v5/pins", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PINTEREST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      board_id: process.env.PINTEREST_BOARD_ID,
      title: post.title,
      description: post.tags.join(", "),
      link: post.canonicalUrl,
      media_source: { source_type: "image_url", url: post.heroImage },
    }),
  });

  if (!res.ok) {
    throw new Error(`Pinterest publish failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  console.log(`✅ Pinterest: pinned "${post.title}" (id ${data.id})`);
}

publishToPinterest().catch((err) => {
  console.error("❌ Pinterest publish error:", err.message);
  process.exit(1);
});
