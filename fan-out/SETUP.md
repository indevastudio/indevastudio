# Tier 1 Fan-out Publishing — Setup Guide

Drop the `.github/workflows/fan-out-publish.yml` file and the `fan-out/`
folder into the root of your `indevastudio.com` repo (same repo your
existing `generate-blogs.js` pipeline lives in). No other repo changes
are needed — this triggers on the same `feed.xml` commit your current
pipeline already produces.

## 1. Create/verify accounts

Under Indéva Studio's identity, create (or confirm you already have)
a business/brand account on: Medium, Blogger, Tumblr, WordPress.com,
Pinterest.

## 2. Get credentials for each platform

| Platform | What you need | Where to get it |
|---|---|---|
| Medium | Integration token | Medium → Settings → Security and apps → **Integration tokens** |
| Blogger | OAuth client ID + secret + refresh token + blog ID | Client ID/secret from [Google Cloud Console](https://console.cloud.google.com/apis/credentials) (enable the Blogger API v3). Get a refresh token once via the OAuth2 consent flow ([google-auth-library](https://github.com/googleapis/google-auth-library-nodejs) has a `getToken` playground script for this). Blog ID is in your Blogger dashboard URL. |
| Tumblr | Consumer key + secret, OAuth token + secret, blog name | Register an app at [tumblr.com/oauth/apps](https://www.tumblr.com/oauth/apps) for the consumer key/secret, then run Tumblr's OAuth1 flow once to get the token/secret (the `tumblr.js` README has a copy-paste script for this). |
| WordPress.com | Bearer token + site identifier | [developer.wordpress.com/apps](https://developer.wordpress.com/apps/) → create an app → OAuth2 flow for the token. Site identifier is your `yoursite.wordpress.com` mirror blog's domain. |
| Pinterest | API token + board ID | [developers.pinterest.com](https://developers.pinterest.com/) → create an app (needs a Pinterest **business** account) → OAuth token. Board ID from the board's URL or the `/v5/boards` list endpoint. |

## 3. Store credentials as GitHub secrets

Repo → Settings → Secrets and variables → Actions → **New repository secret**.
Add all of:

```
MEDIUM_TOKEN
BLOGGER_CLIENT_ID
BLOGGER_CLIENT_SECRET
BLOGGER_REFRESH_TOKEN
BLOGGER_BLOG_ID
TUMBLR_CONSUMER_KEY
TUMBLR_CONSUMER_SECRET
TUMBLR_TOKEN
TUMBLR_TOKEN_SECRET
TUMBLR_BLOG_NAME
WORDPRESS_TOKEN
WORDPRESS_SITE
PINTEREST_TOKEN
PINTEREST_BOARD_ID
```

Never commit any of these to the repo itself.

## 4. Test before wiring into the live trigger

Run each script locally first with a dummy `feed.xml` entry:

```bash
cd fan-out
npm install
MEDIUM_TOKEN=xxx node publish-medium.js
```

Repeat per platform with its own env vars. Fix any auth errors before
merging the workflow file — once it's live it fires on every real post.

## 5. Merge and monitor

Once each script runs clean locally, merge the workflow file. Watch the
Actions tab for the first week — the two things that break this kind of
pipeline are API rate limits and OAuth token expiry (Blogger/WordPress
refresh tokens can go stale; Tumblr tokens generally don't expire).
Each publish step has `continue-on-error: true` so one platform failing
doesn't block the others.

## Not automated by this script set (from the blueprint)

- **Flipboard** — no code needed. Go to Flipboard → Create a Magazine →
  "Import from RSS" → point it at `https://www.indevastudio.com/feed.xml`.
  Truly one-time, ~15 minutes.
- **LinkedIn** — already live via your existing RSS feed, per the
  blueprint.
- **Facebook Page / X (Twitter)** — nofollow reach channels, not
  included here since the blueprint marks them lower priority than the
  five dofollow platforms above. Same pattern (Meta Graph API / X API
  v2) if you want them added later — say the word and I'll build those
  two scripts the same way.
- **Editorial placements (ArchDaily, AD India, etc.)** and **directory
  submissions** are explicitly out of scope for Tier 1 — human pitching
  and spam-signal risk respectively.
