# Indeva Studio — SEO fix pack 1

## What's inside

| File | What it does |
|---|---|
| `public/robots.txt` | Allows all crawling and points Google to the sitemap. Blocks nothing. |
| `public/sitemap.xml` | 91 real, indexable URLs: homepage, /insights/, the South Delhi case study and the 88 articles being kept. |
| `vercel.json` | Clean URLs + trailing slashes, 146 article redirects (292 rules, with/without slash), and `noindex` on 71 thin articles. |
| `scripts/build-sitemap.mjs` | Rebuilds the sitemap from the files that actually exist in `public/`, skipping redirected and noindexed pages. |
| `scripts/seo-exclusions.json` | The list the sitemap script reads to skip merged, removed and noindexed articles. |
| `.github/workflows/sitemap.yml` | Runs the script on every push to `main`, so new pages land in the sitemap automatically. |
| `insights-merge-map.csv` | Every article and what happens to it: keep, 301, or noindex — with the reason. |

## Before uploading — check vercel.json

If the repo **already has a `vercel.json`**, don't overwrite it blindly. Open it on GitHub:
- If it only has old `rewrites` that never worked, replacing it is fine.
- If it has anything you rely on (headers, rewrites, functions), merge: keep your sections and add
  `cleanUrls`, `trailingSlash`, `redirects` and `headers` from this file.

## Upload order (GitHub → indevastudio/indevastudio → Add file → Upload files)

1. Pause the blog bot first: **Actions → the blog-publishing workflow → ··· → Disable workflow**.
   Otherwise it keeps publishing new near-duplicates and re-listing removed ones.
2. Upload the contents of this zip at the repo root (keep the folder structure).
3. Wait for the Vercel deploy to finish, then **purge Cloudflare's cache** (Caching → Configuration → Purge Everything).

## Check it worked

- `https://www.indevastudio.com/robots.txt` shows the 4 lines above
- `https://www.indevastudio.com/sitemap.xml` loads as XML
- `https://www.indevastudio.com/insights/penthouse-cost-guide-gurgaon/` redirects to `/insights/penthouse-interior-cost-gurgaon-guide/`
- `https://www.indevastudio.com/insights` redirects to `/insights/`

## Then, in Google Search Console

1. Sitemaps → submit `https://www.indevastudio.com/sitemap.xml`
2. URL Inspection → request indexing for the homepage and /insights/

## Still to do (next packs)

- Delete the 21 removed article folders once the redirects are live (the redirects already hide them).
- Rewrite or delete the 71 noindexed articles; remove an article from `noindex` only after it's rewritten.
- Update the /insights/ index and the blog generator so they stop linking to merged/removed articles.
- Move the legacy city/about/contact pages into `public/` (not vendors.html) — `cleanUrls` will then serve them at /delhi/, /about/ etc.
- Crawlable project pages, service pages and /locations/ pages.
