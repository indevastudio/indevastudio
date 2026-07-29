// fan-out/publish-tumblr.js
// Dofollow, high DA. Tumblr strips <link> tags from post bodies, so the
// canonical reference has to be a visible backlink instead.

const tumblr = require("tumblr.js");
const { getLatestPost } = require("./lib/feed");

async function publishToTumblr() {
  const post = await getLatestPost();

  const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET,
  });

  const bodyWithBacklink =
    post.html +
    `\n<p>Originally published at <a href="${post.canonicalUrl}" rel="canonical">indevastudio.com</a></p>`;

  return new Promise((resolve, reject) => {
    client.createTextPost(
      process.env.TUMBLR_BLOG_NAME,
      { title: post.title, body: bodyWithBacklink, tags: post.tags.join(",") },
      (err, resp) => {
        if (err) return reject(err);
        console.log(`✅ Tumblr: published "${post.title}" (id ${resp.id})`);
        resolve(resp);
      }
    );
  });
}

publishToTumblr().catch((err) => {
  console.error("❌ Tumblr publish error:", err.message);
  process.exit(1);
});
