# Indeva Studio — SEO fix pack 1.1 (hotfix)

Replaces pack 1. Upload at the repo root, overwrite when GitHub asks.

## Why the hotfix
Pack 1 turned on trailing slashes. Your pages' canonical tags use no slash
(e.g. canonical `/delhi`), so every page was redirecting away from its own canonical.
This pack switches trailing slashes off to match the site.

## Files to upload (overwrite)
- `vercel.json` — trailingSlash: false, 153 article redirects, noindex on 137 thin articles
- `public/sitemap.xml` — 121 URLs: pages, 7 projects, 5 city pages, 102 kept articles (no redirects, no noindex)
- `scripts/build-sitemap.mjs` and `scripts/seo-exclusions.json`
- `insights-merge-map.csv` — every article and its decision

## One manual edit
Open the insights index file (likely `public/insights/index.html`) and change
`<link rel="canonical" href="https://www.indevastudio.com/insights/">`
to `https://www.indevastudio.com/insights` (no slash). Same for its `og:url`.

## Check after deploy + Cloudflare purge
- `/delhi` stays on `/delhi` (no redirect to `/delhi/`)
- `/insights/penthouse-cost-guide-gurgaon` → `/insights/penthouse-interior-cost-gurgaon-guide`
- `/sitemap.xml` has 121 `<loc>` lines and contains no `penthouse-cost-guide-gurgaon`
