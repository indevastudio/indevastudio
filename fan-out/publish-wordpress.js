// fan-out/publish-wordpress.js
// Dofollow, very high DA. WordPress.com's REST API doesn't expose a
// canonical field either, so we inject the same <link rel="canonical">
// approach used for Blogger.

const fetch = require("node-fetch");
const { getLatestPost } = require("./lib/feed");

async function publishToWordPress() {
  const post = await getLatestPost();

  const bodyWithCanonical =
    `<link rel="canonical" href="${post.canonicalUrl}" />\n` + post.html;

  const res = await fetch(
    `https://public-api.wordpress.com/rest/v1.1/sites/${process.env.WORDPRESS_SITE}/posts/new`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WORDPRESS_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: post.title,
        content: bodyWithCanonical,
        tags: post.tags.join(","),
        status: "publish",
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`WordPress publish failed: ${res.status} ${await res.text()}`);
  }
  const data = await res.json();
  console.log(`✅ WordPress.com: published "${post.title}" → ${data.URL}`);
}

publishToWordPress().catch((err) => {
  console.error("❌ WordPress.com publish error:", err.message);
  process.exit(1);
});
