# Indeva Studio — Technical SEO, Service & Location Pages: Implementation Report

Date: 13 October 2026
Repository: `github.com/indevastudio/indevastudio` (commit `fdbe088` as baseline)
Scope of this report: what was **actually** changed and tested in the repository. Nothing here has been deployed by me — this session has read access to the repo, no push access, and the Vercel API returned 403 for the project's team scope.

---

## A. Baseline findings (before any change)

**Architecture**
- Plain static HTML on Vercel (`framework: null`, `outputDirectory: "."`, `cleanUrls: true`, `trailingSlash: false`). No framework, no SSR. Cloudflare sits in front of Vercel (DNS/proxy).
- The core pages (`/`, `/about`, `/services`, `/process`, `/philosophy`, `/contact`, `/furniture`, `/vendors`) are a single-page app: every one was a **556 KB copy of the same document** containing all ten sections, with JavaScript switching the visible section after load.
- Project case studies are separate static files (`project-*.html`, rewritten to `/projects/<slug>`); city pages are separate static files (`delhi.html`, `gurgaon.html`, …); ~300 insight articles live under `insights/<slug>/index.html`, published by a GitHub Actions bot.

**Issues found**

| # | Issue | Evidence |
|---|---|---|
| 1 | Every core page shared one H1 ("Architecture led interiors…") and near-identical HTML | `about.html`, `services.html` etc. byte-identical bodies; live `/about` confirmed the homepage H1 |
| 2 | A builder that fixes #1 (`build-pages.cjs`) existed but had **never run**: its workflow (`seo-build.yml`) and helper (`seo-apply.cjs`) were uploaded to the repo root instead of `.github/workflows/` and `scripts/`, so neither ever executed | file locations; `seo-apply.cjs` resolves paths relative to `scripts/` |
| 3 | Main navigation on the live homepage was `<button onclick>` — not crawlable links | live `index.html` vs `site-app.html` |
| 4 | **Mislabelled project photos**: Gurgaon page and the Services section showed the Mini Farmhouse (Delhi) living room as "DLF Crest Penthouse, Gurgaon"; the Noida page presented Mini Farmhouse and Gurgaon studio photos as Noida projects | perceptual-hash match of `project-images-for-website/living area.webp`, `Master bedroom design.webp`, `Studio Workspace.webp` against the case-study images |
| 5 | Noida page carried unverifiable claims: "6 Projects Delivered", "5★ Average Client Rating", "No subcontractors", "Sector 150 is one of our most active Noida markets", Noida testimonials | `noida.html` |
| 6 | Structured data: self-serving `AggregateRating` on the business entity (not eligible for review rich results), a `SearchAction` for a site search that does not exist, invalid `additionalType: schema.org/InteriorDesigner`, an empty `<script type="application/ld+json">` block on every SPA page, and a separate `LocalBusiness` with a different `url` on each city page | `site-app.html`, city pages |
| 7 | Latent sitemap bug: `build-sitemap.cjs` wrote a sitemap **index** + 4 child files, but the blog workflow only commits `sitemap.xml` — the next bot run would have published an index pointing to missing files | `.github/workflows/auto-generate.yml` |
| 8 | Repo `sitemap.xml` listed 25 URLs that 301-redirect and 4 that are `noindex` | sitemap vs `vercel.json` |
| 9 | Two stray `insights/<slug>.html` files shadow their folder versions; one served an indexable page whose canonical pointed at a trailing-slash (redirecting) URL | `insights/modern-cafe-interior-design-delhi-ncr.html` |
| 10 | `/services` was ambiguous: both `services.html` and an older `services/index.html` existed | file system |
| 11 | ~300 internal links across insights/city pages pointed at `/#section` anchors or at URLs that 301-redirect | `seo-apply.cjs` dry run |
| 12 | Homepage "insights" cards were `<div onclick>` opening an in-page overlay instead of links to the real `/insights/<slug>` pages; every core page shipped 210 KB of inline article text for that overlay | `site-app.html` |
| 13 | City-page heroes started at `opacity:0` (`.reveal`) until JavaScript ran, delaying the visible H1/hero (LCP); hero images lacked width/height; section titles were `<h3>` directly under the `<h1>` | `delhi.html`, `gurgaon.html`, etc. |
| 14 | No dedicated service pages (only `/services` hub) and no Narela or Vasant Kunj location pages | routes |
| 15 | Lead-tracking: homepage form fires `lead_form_submit`; no tracking on phone/WhatsApp clicks on city/project pages | page scripts |
| 16 | Live site ≠ repo: the live sitemap has 331 URLs vs 193 in the repo, i.e. the deploy is out of step with `main` (the known deploy-lag/Cloudflare issue) | WebFetch of live `/sitemap.xml` |

Not verified at baseline (no access): Google Search Console, GA4 reports, Vercel deployment history, real-user Core Web Vitals.

---

## B. Files changed

**Build pipeline / config**
- `vercel.json` — 7 new 301s: `/locations/{delhi,gurgaon,noida,sonipat,south-delhi}` → existing city URLs, `/services/custom-furniture` → `/furniture`, `/site-app` → `/`. Existing rules untouched.
- `.vercelignore` — excludes `site-app.html` (source file, was a duplicate homepage), `services/index.html` (superseded), unused `pshow*` files, root `*.cjs/*.yml/*.py`.
- `seo-apply.cjs` → **moved** to `scripts/seo-apply.cjs`; `seo-build.yml` → **moved** to `.github/workflows/seo-build.yml` (+ landing-page build step, new path triggers, commits `services/` and `locations/`).
- `build-pages.cjs` — also strips the unused 210 KB article-overlay payload from built pages.
- `build-sitemap.cjs` — writes one `<urlset>` (no index/children), includes service and location pages, deletes stale `sitemap-*.xml`.
- `llms.txt` — services and new locations added.

**Source + generated core pages**
- `site-app.html` (source) — business JSON-LD rebuilt (single `HomeAndConstructionBusiness` with `@id`, no AggregateRating/SearchAction/invalid type), empty JSON-LD placeholder removed, mislabelled "DLF Crest" image replaced with a correctly captioned Hotel Silk photo, new "services in detail" block linking all service + location pages, `locations` added to every footer, homepage insight cards converted to real links.
- Regenerated from it by `build-pages.cjs`: `index.html`, `about.html`, `services.html`, `process.html`, `philosophy.html`, `contact.html`, `furniture.html`, `vendors.html` (each now has only its own section, own H1, title, description, canonical).

**City / project pages**
- `delhi.html`, `gurgaon.html`, `sonipat.html`, `south-delhi-interior-designer.html` — via `scripts/seo/fix-location-pages.py`: Gurgaon featured project replaced with the real Gurgaon project (Studio Workspace), Delhi's Vasant Kunj blurb corrected ("parents' bedroom", not "full residential"), schema normalised, hero visible without JS + image dimensions, `<h3>`→`<h2>` section titles, links to service pages and new locations, drawer-shadow fix.
- `noida.html` — **rebuilt** on the new template with honest copy (see C).
- `project-*.html` (7) — related service + location links, new locations in footer (`scripts/seo/fix-project-pages.py`). `projects.html` footer updated.
- `insights/**` (≈290 files), `insights/index.html`, `insights.html`, `404.html`, `interior-designer-*.html` — produced by running the existing `scripts/seo-apply.cjs`: `/#section` links → real URLs, links to redirected URLs → final URL, extra `<h1>`s in 59 articles demoted, listing cards removed for 6 redirected/noindex articles and added for 31 orphan articles, Instagram handle normalised.
- `insights/modern-cafe-interior-design-delhi-ncr.html`, `insights/premium-living-room-design-gurgaon.html` — canonical/og:url trailing slash removed.

**New**
- `scripts/landing/data.cjs` (all page content, with editing rules), `scripts/landing/build.cjs` (generator), `scripts/landing/landing.src.css`, `scripts/landing/purge-css.cjs`
- `assets/landing.css` (18.5 KB, shared/cached), `assets/landing.js` (reveal, nav, enquiry form, click tracking)
- `services/*.html` (6), `locations.html`, `locations/narela.html`, `locations/vasant-kunj.html`
- `scripts/seo/vercel-local.py` (local Vercel routing emulator), `scripts/seo/crawl-check.py` (SEO crawler), the two fix scripts above
- `sitemap.xml` (regenerated)

---

## C. New pages

| Page type | URL | Search intent | Status |
|---|---|---|---|
| Service | `/services/residential-interior-design` | home / apartment / DDA flat interior design, Delhi NCR | Built & tested locally |
| Service | `/services/commercial-interior-design` | office & retail interior design (covers the proposed "office" page) | Built & tested locally |
| Service | `/services/hospitality-interior-design` | hotel / hospitality interior design & fit-out | Built & tested locally |
| Service | `/services/interior-design-execution` | turnkey interior execution / fit-out contractor | Built & tested locally |
| Service | `/services/farmhouse-interior-design` | farmhouse interior design, Delhi NCR | Built & tested locally |
| Service | `/services/modular-kitchen-design` | modular kitchen design | Built & tested locally |
| Service | `/services/custom-furniture` | custom furniture | **Not created** — `/furniture` already serves this intent; 301 to `/furniture` |
| Service | `/services/villa-interior-design` | villa interiors | **Not created** — no published villa project to support it |
| Service | `/services/office-interior-design` | office interiors | **Not created separately** — one office project; folded into commercial to avoid a thin page |
| Location hub | `/locations` | "interior designer Delhi NCR" / area index | Built & tested locally |
| Location | `/locations/narela` | interior design Narela (studio's own location) | Built & tested locally |
| Location | `/locations/vasant-kunj` | interior design Vasant Kunj | Built & tested locally |
| Location | `/noida` (existing URL) | interior design Noida | Rebuilt & tested locally |
| Location | `/locations/delhi`, `/gurgaon`, `/noida`, `/sonipat`, `/south-delhi` | — | 301 to the established `/delhi`, `/gurgaon`, `/noida`, `/sonipat`, `/south-delhi-interior-designer` (history preserved, no duplicates) |

Every new page has: unique title/description, one H1, self-canonical, OG/Twitter tags, visible breadcrumbs, `BreadcrumbList` + `Service` + `FAQPage` + `WebPage` JSON-LD referencing the single business entity, real project cards linking to case studies, FAQs, related guides/services/locations, and a mobile-friendly enquiry form (name, phone/email, location, property type, area, start, optional budget).

**Content rules followed:** every fact is taken from the published case studies, the studio's own About/Process/Services copy, or the studio's stated service areas. Where a location has no published project (Narela, Noida), the page says so and labels the photos as from elsewhere. No prices, ratings, reviews, timelines or offices were invented; durations are quoted only as what specific projects took.

---

## D. Technical SEO status

| Area | Status |
|---|---|
| Metadata | Done. All 173 indexable pages crawled have a title, description and one H1; **0 duplicate titles** (was 9 core pages sharing one H1). |
| Canonicals | Done. All indexable pages self-canonical, absolute `https://www`, no trailing slash. |
| robots.txt | Unchanged — already correct (`Allow: /`, sitemap referenced; private pages handled with `X-Robots-Tag`). |
| XML sitemap | Done. Single file, 173 URLs, all 200 + canonical + indexable; 25 redirecting and 4 noindex URLs removed; 9 new pages added; `lastmod` only where a page states a real date. |
| Redirects | 7 added (above). No chains: crawler found 0 internal links to redirects and 0 chains. All 193 URLs from the old sitemap still resolve to a 200 (directly or via one redirect). |
| Structured data | Done. One business entity (`HomeAndConstructionBusiness`, `@id …/#business`) used site-wide; AggregateRating, SearchAction, invalid type and empty block removed; all JSON-LD on crawled pages parses. Not run through Google's Rich Results Test (needs a live URL). |
| Internal linking | Done. Services hub → 6 service pages; every service ↔ projects ↔ locations; project pages → services + location; city pages → services + new locations; footers list services and locations. Crawler: 0 broken links, 0 orphans in sitemap. |
| Indexability | No new page is noindex; private cost builders/ledger stay noindex. |
| Images | New pages: responsive `srcset`, width/height on every image, hero preloaded with `fetchpriority=high`, everything else lazy. City heroes now have dimensions. Insights listing (117 images) still lacks width/height — not changed. |
| Core Web Vitals | Lab only (below). No field data accessed. |

**Lighthouse lab results** (Lighthouse 12, mobile simulation, local server; Google Fonts/GA blocked in the sandbox, so absolute numbers are indicative — compare before/after only):

| Page | Before | After |
|---|---|---|
| `/about` | score 71, LCP 5.0 s, 567 KiB | score 88, LCP 2.8 s, 254 KiB |
| `/` | score 74, LCP 4.2 s, 567 KiB | score 86, LCP 3.5 s, 279 KiB |
| `/noida` | 97, LCP 1.7 s | 99, LCP 1.6 s |
| `/gurgaon` | 97, LCP 2.0 s | 96, LCP 2.0 s |
| `/services/residential-interior-design` | — | 99, LCP 1.6 s, CLS 0 |
| `/locations/narela` | — | 99, LCP 1.7 s, CLS 0 |

CLS was 0 on every measured page. These are lab numbers; they do not show that real users meet LCP ≤ 2.5 s / INP ≤ 200 ms / CLS ≤ 0.1.

---

## E. Testing

**Passed (local)**
- All build scripts run cleanly: `scripts/seo-apply.cjs`, `build-pages.cjs`, `scripts/landing/build.cjs`, `build-sitemap.cjs`. (The repo has no lint or test suite; `package.json` scripts belong to the blog generator.)
- `vercel.json` valid JSON; `sitemap.xml` well-formed.
- Crawl of the site through a local emulation of Vercel's routing (`.vercelignore`, trailingSlash, cleanUrls, redirects, rewrites, headers): **178 pages, 0 errors, 0 warnings** — status codes, canonicals, robots, titles, H1s, JSON-LD, img alt, sitemap membership, broken links, redirect links.
- Redirect spot checks (`/locations/*`, `/services/custom-furniture`, `/site-app`, `/services/`, `/about.html`, legacy project/city URLs) all return the intended 301/308.
- Headless Chromium: new pages have no JavaScript errors and no horizontal scroll at 390 px, 1024 px and 1440 px; screenshots checked for layout.
- Mobile drawer opens/closes (incl. Escape); form validation messages work; location pre-selected per page; `lead_form_start`, `lead_form_error`, `phone_click` events fire.
- Core pages render the right section, title, H1 and canonical after JavaScript runs.

**Failed / not verifiable here**
- Form **success** path: EmailJS's CDN is blocked in this sandbox, so only the error path (which shows WhatsApp/call fallbacks) was exercised. It uses the same EmailJS account, service and template as the homepage form.
- Core pages log `createClient`/`emailjs is not defined` errors here because Supabase/EmailJS CDNs are blocked; the same scripts load on the live site. Not introduced by these changes.
- Production behaviour: Vercel's exact precedence when both `services.html` and a `services/` folder exist is assumed (standard `cleanUrls`); verify after deploy.
- Rich Results Test, PageSpeed Insights (field data), Search Console: need the live URLs/access.

---

## F. Search Console & analytics

Search Console was **not accessed** (no connection in this session); no GSC data in this report. GA4 (`G-HR4CCENYLM`) is already on the site — not duplicated; new pages use the same tag.

New GA4 events on service/location pages: `lead_form_start`, `lead_form_submit` (same name as the homepage form), `lead_form_error`, `phone_click`, `whatsapp_click`, `email_click`. No personal data is sent to GA.

Manual checks after deploy:
1. Sitemaps → resubmit `https://www.indevastudio.com/sitemap.xml`; expect 173 discovered URLs.
2. URL Inspection → test live + request indexing: `/services`, the 6 `/services/*` pages, `/locations`, `/locations/narela`, `/locations/vasant-kunj`, `/noida`, `/about`.
3. Pages report → watch "Duplicate, Google chose different canonical" for `/about`, `/process`, etc. (should clear as pages recrawl).
4. Rich Results Test on one service page (Breadcrumb, FAQ markup valid).
5. GA4 → Admin → Events: mark `lead_form_submit` (and optionally `whatsapp_click`, `phone_click`) as **key events**; build an exploration of organic sessions by landing page.
6. Core Web Vitals report / PageSpeed Insights field data for `/` and `/about` after 28 days.

---

## G. Remaining work (and what's needed)

| Item | Why open | Needed |
|---|---|---|
| Deploy | No push or Vercel access from this session | Upload the bundle; confirm the Vercel deploy finished; purge Cloudflare cache |
| GitHub Actions secret | `seo-build.yml` calls `VERCEL_DEPLOY_HOOK`; it will warn and skip deploy if the secret is missing | Check the secret exists |
| Hashtag Restaurant / Jaypee Penthouse / DLF Crest Penthouse | Removed from the Noida and Gurgaon pages because the photos shown belonged to other projects. They may be real projects | Confirm and supply real photos → publish as case studies, then link from Noida/Gurgaon |
| Narela case study | Studio is in Narela but no Narela project is published | Publish one completed Narela project (with client consent) |
| Villa / office service pages | No supporting project evidence yet | A completed villa project; a second office project |
| Restaurants & cafés claim | Hospitality page says the studio takes on restaurants/cafés; only Hotel Silk is published | Confirm, or remove that FAQ line |
| Response time | Homepage says "within 24 hours", contact page "within 48 hours" | Pick one; update `site-app.html` |
| Insight duplication | ~170 near-duplicate articles remain (ISSUE-12 in `ISSUES.md`) — editorial merge, not mechanical | Editorial review |
| Core pages still ~250 KB with ~125 KB inline CSS | Splitting the SPA stylesheet is a larger refactor | Move shared CSS to a cached file |
| Insights listing images | 117 images without width/height | Add dimensions in the listing generator |
| Non-www → www | Done by client-side JavaScript in `site-app.html`, not a server redirect | Add a domain-level redirect in Vercel (Domains → redirect `indevastudio.com` to `www`) |
| Root clutter | Old copies (`seo-apply.cjs`, `seo-build.yml`) remain at the repo root if the upload can't delete them | Delete them in GitHub (now excluded from deploy anyway) |

---

## H. Next 30 days (highest impact first)

1. **Deploy and verify** — upload, confirm the Vercel deploy, purge Cloudflare, then spot-check `/about` (should show "we don't have a legacy…" as H1), `/services/residential-interior-design`, `/locations/narela`, `/sitemap.xml`.
2. **Search Console** — resubmit the sitemap and request indexing for the 10 new/rebuilt pages; record a baseline of impressions per page today.
3. **Google Business Profile** — make sure categories, service areas (Delhi, Gurgaon, Noida, Sonipat, Narela) and the website link match the site; link GBP to `/locations/narela` or the homepage.
4. **Publish one Narela and one Noida project** — the biggest gap in local proof; the page templates are ready to show them.
5. **Mark lead events as key events in GA4** and review which service/location pages produce enquiries after 2–3 weeks.
6. **Fix the remaining performance debt on core pages** (external stylesheet, insights image dimensions) and re-measure with PageSpeed Insights.
