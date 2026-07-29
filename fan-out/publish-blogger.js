// fan-out/publish-blogger.js
// Dofollow, Google-owned, indexed fast. Blogger API v3 has no native
// canonical field, so we inject a <link rel="canonical"> tag into the
// body itself — most crawlers still pick it up even outside <head>.

const { google } = require("googleapis");
const { getLatestPost } = require("./lib/feed");

async function publishToBlogger() {
  const post = await getLatestPost();

  const oauth2Client = new google.auth.OAuth2(
    process.env.BLOGGER_CLIENT_ID,
    process.env.BLOGGER_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.BLOGGER_REFRESH_TOKEN });

  const blogger = google.blogger({ version: "v3", auth: oauth2Client });

  const bodyWithCanonical =
    `<link rel="canonical" href="${post.canonicalUrl}" />\n` + post.html;

  const res = await blogger.posts.insert({
    blogId: process.env.BLOGGER_BLOG_ID,
    requestBody: {
      title: post.title,
      content: bodyWithCanonical,
      labels: post.tags,
    },
  });

  console.log(`✅ Blogger: published "${post.title}" → ${res.data.url}`);
}

publishToBlogger().catch((err) => {
  console.error("❌ Blogger publish error:", err.message);
  process.exit(1);
});
