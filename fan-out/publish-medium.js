// fan-out/publish-medium.js
// Dofollow, canonical-tag supported natively.

const fetch = require("node-fetch");
const { getLatestPost } = require("./lib/feed");

async function publishToMedium() {
  const post = await getLatestPost();

  const meRes = await fetch("https://api.medium.com/v1/me", {
    headers: { Authorization: `Bearer ${process.env.MEDIUM_TOKEN}` },
  });
  if (!meRes.ok) {
    throw new Error(`Medium /me failed: ${meRes.status} ${await meRes.text()}`);
  }
  const { data: user } = await meRes.json();

  const postRes = await fetch(`https://api.medium.com/v1/users/${user.id}/posts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MEDIUM_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: post.title,
      contentFormat: "html",
      content: post.html,
      canonicalUrl: post.canonicalUrl,
      tags: post.tags.slice(0, 5), // Medium allows a maximum of 5 tags
      publishStatus: "public",
    }),
  });

  if (!postRes.ok) {
    throw new Error(`Medium publish failed: ${postRes.status} ${await postRes.text()}`);
  }
  console.log(`✅ Medium: published "${post.title}"`);
}

publishToMedium().catch((err) => {
  console.error("❌ Medium publish error:", err.message);
  process.exit(1);
});
