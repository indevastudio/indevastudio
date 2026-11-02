# Indéva Studio — SEO pre-repair audit

Date: 2 November 2026
Baseline: `main` at `9fa92e9` (31 Oct 2026), which is also the current production deployment on Vercel (`dpl_A6zehkLzjYYH8Pxn9ZJcLKY35uG8`, READY).

## How this was audited

- **Repository:** read in full. Routing was tested with a local emulation of Vercel's static routing (`.vercelignore`, `cleanUrls`, `trailingSlash: false`, redirects, rewrites), now saved as `scripts/seo/vercel-route.py`. A crawler that follows every internal link through that emulation is saved as `scripts/seo/crawl-check.py`.
- **Rendering:** pages were rendered in headless Chrome at 390 px and 1440 px.
- **Live site — not reachable from this session.** Fetches of `www.indevastudio.com` and the deployment URLs were refused. The Vercel API confirmed only which commit is in production. So "live" statements below come from that deployment record plus the repository, not from fetching the pages.

## Architecture

| Item | Finding |
|---|---|
| Framework / build | None: plain static HTML on Vercel (`framework: null`, `outputDirectory: "."`, `cleanUrls: true`, `trailingSlash: false`). There is no build step on Vercel, so the files committed are the files served. |
| Core pages | `/`, `/about`, `/services`, `/process`, `/philosophy`, `/contact`, `/furniture` and `/vendors` are generated from one source, `site-app.html`, by `build-pages.cjs`. They had drifted: only `about.html` had been rebuilt after the 31 Oct edits. |
| Projects | `projects.html` is `/projects`. Nine case studies were root-level `project-<slug>.html` files, reached at `/projects/<slug>` only through `rewrites` in `vercel.json`. |
| Locations | City pages are `delhi.html`, `gurgaon.html`, `noida.html`, `sonipat.html` and `south-delhi-interior-designer.html`, plus the `locations.html` hub. |
| Services | `services/*.html` (6 pages), each self-contained with inline CSS. |
| Insights | 473 `insights/<slug>/index.html` folders, published twice a day by `scripts/generate-blogs.js` (`.github/workflows/auto-generate.yml`). |
| Sitemap / robots | `build-sitemap.cjs` writes one `<urlset>` (175 URLs). `robots.txt` allows everything and references the sitemap. Private pages are `noindex` through `X-Robots-Tag` headers. |
| Schema | A single `HomeAndConstructionBusiness` entity (`@id …/#business`). `BlogPosting` on articles. `BreadcrumbList`, `Service` and `WebPage` on service pages. |
| Deploy | Every push to `main` deploys to production. Cloudflare sits in front of Vercel. |

## 1. Broken routes

| URL | Status in repo | Cause |
|---|---|---|
| `/locations/narela` | **404** | `locations/narela.html` was never committed. The 13 Oct work describes it, but the upload missed the `locations/` folder. |
| `/locations/vasant-kunj` | **404** | Same cause. |
| `/projects/<slug>` (7 listed in the brief, plus `villa-narela` and `indeva-studio-office-narela`) | 200 in the emulator; **reported 404 live** | These depend on `rewrites` to root-level `project-*.html` files. The site has a documented history of rewrites not taking effect live while real files at the path always work (see the `indevastudio-website` notes in the repo history and `ISSUES.md`). I could not fetch the live URLs to confirm which applies today. |

## 2. Missing pages and assets

- `locations/narela.html` and `locations/vasant-kunj.html` are missing.
- `/assets/landing.css` and `/assets/landing.js` are missing. `locations.html` and `noida.html` load them, so both pages render **unstyled**: at 390 px, `/locations` was 1,194 px wider than the screen. Their enquiry forms also have no script.

## 3. Broken internal links

- 2 broken links in visible navigation: `/locations/narela` and `/locations/vasant-kunj`, linked from the footer of every city, service and project page and from the `/locations` hub.
- 972 links in 409 insight files point at `/#contact`, `/#about`, `/#services`, `/#projects`, `/#process` or `/#philosophy`. These are homepage sections that no longer exist as anchors, so the links land on the top of the homepage.
- 12 internal links point at URLs that 301-redirect.
- **Project cards on the homepage** are `<div onclick>`, so crawlers cannot follow them. Five of the seven open the generic projects view instead of their own case study.
- `scripts/generate-blogs.js` hard-codes the `/#section` links. It also writes every new article's canonical, `og:url`, schema `@id`, listing card and IndexNow URL with a trailing slash, which is a 308 redirect.

## 4. Metadata

- All crawled pages have a title, a description and a self-referencing canonical, with one exception. `/insights/modern-cafe-interior-design-delhi-ncr` is served from a stray `insights/modern-cafe-interior-design-delhi-ncr.html`, which shadows the folder version and has a trailing-slash canonical.
- 31 indexable articles have two `<h1>`s (90 extra H1s across all article files, including noindexed ones).
- One duplicate title: `flat-interior-design-delhi-cost` and `flat-interior-design-delhi-cost-per-sqft` have the same H1 and the same search intent.

## 5. Duplicate or weak content

- **Homepage:** the offerings marquee and the projects carousel each repeat every card once, so the CSS loop is seamless. That is intended visually, but the copies were exposed to screen readers. They were also keyboard-focusable (project cards) and read as duplicate content.
- **Insights:** about 170 near-duplicate articles remain (ISSUE-12 in `ISSUES.md`). This is an editorial job and was not changed.

## 6. Schema

No invalid JSON-LD was found on crawled pages. The new location pages had none, because they didn't exist.

## 7. Sitemap and robots

- `sitemap.xml` listed `/locations/narela` and `/locations/vasant-kunj`, both 404.
- 31 sitemap articles had no internal link from any page (orphans).
- `robots.txt` is correct.

## 8. Performance and mobile (lab, headless Chrome, 390 px)

| Page | Problem | Cause |
|---|---|---|
| `/` | 78 px horizontal scroll | Two-column enquiry form grid |
| `/services` | 300 px horizontal scroll | Detail image sets its grid column's minimum width |
| `/furniture` | 106 px horizontal scroll | Three-column catalogue buttons |
| `/locations`, `/noida` | Unstyled | Missing CSS |
| `/insights` | 117 listing images without width/height | Causes layout shift as images load |

The core pages are about 260–300 KB each, mostly inline CSS and JS.

## 9. Content inaccuracies

- **`/insights/interior-design-cost-south-delhi-guide`:**
  - Every rupee range in the cost table is 10× too high. For example, 25–30% of a ₹1–3 crore budget is shown as "₹2.5–9 crore".
  - The "₹2.4 crore" example adds up to ₹3.6 crore.
  - The example is 4,500 sq ft; the table is 4,000 sq ft.
  - It contains an invented quotation from a "senior cost consultant, indéva studio" and an unsourced "10–30% markup" figure.
  - The title says "2024" on an article first published on 22 Aug 2026.
- **`/insights/defence-colony-interior-design-cost-guide`:**
  - "Grand total range ₹1.6–2.4 crore", but its items add up to ₹1.99 crore.
  - "Project management (10%): ₹20 lakh", but 10% of the ₹1.64 crore of work is ₹16.4 lakh.
  - "Figures are averages derived from recent market data" is untrue.
  - Unsourced 30–50% and 8–12% figures.
  - An invented "senior consultant at indéva studio" quotation.
- **`/insights/luxury-interior-designer-greater-kailash-cost-guide`:**
  - An unsourced "recent survey shows 62%".
  - The room-by-room items don't add up to their own table.
  - The table total (₹22 lakh) is outside the stated ₹25–50 lakh envelope.
  - An **unverified company policy**: "indéva studio often suggests a 10% discount… fixed-price contract".
  - An unverified "vetted supplier list".
  - An invented "senior project manager, indéva studio" quotation.
- **`/insights/hiring-home-interior-designer-hauz-khas`:**
  - An unattributed "industry insight" quotation.
  - The "realistic range" claim and timelines are unsupported.
  - It says a "licensed architect must be engaged" for load-bearing changes; this is a structural engineer's job.
- **Site-wide:** 144 pull-quotes in insight articles attribute words to people who cannot be identified. 82 of these are "senior <role>, indéva studio"; the rest are "industry analyst", "a seasoned professional", or a publication such as Architectural Digest or NID. The blog generator's prompt didn't forbid this.

## 10. Risks and regressions to watch

- **Every push to `main` deploys to production.** So no change was pushed to `main`. The work is on branch `seo-repair-2026-11`.
- **Moving `project-*.html` into `projects/`:** any external tool that fetched the old root file names would now get a 301 (the redirects already existed).
- **Core pages are generated.** Editing `index.html` and the other outputs directly is lost on the next `node build-pages.cjs`. All core-page changes were made in `site-app.html`.
- **Cloudflare can serve stale copies** after a deploy. Purge its cache after merging.
- **The blog bot's last publish was 5 Oct 2026** (commit `418fda6`). The twice-daily workflow has not committed for four weeks. This was not investigated (out of scope); worth checking the Actions log.
