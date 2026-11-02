# Indéva Studio — SEO repair: implementation report

Date: 2 November 2026 · Branch: `seo-repair-2026-11` (from `main` at `9fa92e9`) · Audit: `SEO_PRE_REPAIR_AUDIT.md`
Previous report (13 Oct 2026): `SEO_IMPLEMENTATION_REPORT_2026-10-13.md`

**Nothing has been deployed.** Pushing to `main` deploys straight to production, so all work is on the branch above, waiting for your approval to merge.

**Statuses used:**

| Status | Meaning |
|---|---|
| **FIXED AND VERIFIED** | Tested here, through a local emulation of Vercel's routing (`scripts/seo/vercel-route.py`), the crawler (`scripts/seo/crawl-check.py`) and headless Chrome at 390 px and 1440 px. |
| **IMPLEMENTED BUT NOT VERIFIED** | The change is made, but proving it needs the live site, which this session could not fetch. |
| **BLOCKED** | Could not be done here; the blocker is stated. |

None of this shows any change in Google indexing, rankings or traffic. That needs Search Console and analytics evidence after deploy.

---

## 1. Initial problems found

Twelve groups of problems, listed in `SEO_PRE_REPAIR_AUDIT.md`:
- Two location URLs returned 404.
- `/locations` and `/noida` rendered unstyled because of missing assets.
- Project pages depended on rewrites that have repeatedly failed on the live site.
- Cost-article arithmetic was wrong, and the articles contained invented quotations, statistics and company policies.
- 972 dead `/#section` links.
- Double H1s, orphans, a stray duplicate page and a duplicate title.
- Homepage carousel duplicates were exposed to screen readers, and the project cards were not links.
- Mobile horizontal scroll on `/`, `/services` and `/furniture`.
- Blog-generator defects that would recreate several of these.

## 2–4. Pages restored, created and repaired

| # | URL | File(s) | What changed | Tested | Status |
|---|---|---|---|---|---|
| 1–9 | `/projects/hotel-silk-murthal`, `/projects/south-delhi-neoclassical-residence`, `/projects/vasant-kunj-dda-residence`, `/projects/mini-farmhouse-delhi`, `/projects/dda-apartment-delhi`, `/projects/studio-workspace-gurgaon`, `/projects/patel-nagar-retail-store`, plus `/projects/villa-narela` and `/projects/indeva-studio-office-narela` | `project-<slug>.html` → `projects/<slug>.html` (git move, content unchanged); `vercel.json` (9 rewrites removed); `.vercelignore` (now ignores only the old `projects/<old-folder>/` copies and `projects/index.html`, not the whole folder) | Each case study is now a real file at its URL, so it no longer depends on rewrites, which have repeatedly failed on this site while real files have worked. The old `/project-<slug>` and `/projects/<old-slug>` 301s still lead to these pages, with no chains. | Emulator: all 9 return 200 directly; `.html` and trailing-slash variants 308 to the clean URL. Headless Chrome: loads and refreshes, 1 H1, no horizontal scroll at 390 px. | **FIXED AND VERIFIED** (repo). Live 200: **IMPLEMENTED BUT NOT VERIFIED** — check after deploy. |
| 10 | `/locations/narela` (new) | `locations/narela.html`, built by `scripts/build-location-pages.py` | Content: the studio's real address, the two published Narela projects (Villa Project and the studio office), services and FAQs. It states plainly that there is one studio and no branch offices. It carries Breadcrumb, WebPage, FAQ and business JSON-LD, uses only real photos, and includes call, WhatsApp and email links with GA4 events. | 200; 1 H1; self-canonical; valid JSON-LD; no overflow at 390/1440 px; Lighthouse lab: perf 99 / a11y 100 / SEO 100. | **FIXED AND VERIFIED** (repo) |
| 11 | `/locations/vasant-kunj` (new) | `locations/vasant-kunj.html` (same builder) | Built from the published Vasant Kunj parents'-bedroom case study (5 real photos). Covers DDA-flat planning, storage, joinery, lighting, kitchens and bedrooms, related services and FAQs. It says the kitchen example comes from the Delhi DDA apartment, not Vasant Kunj, so no Vasant Kunj kitchen work is implied. | As above; Lighthouse lab 99 / 100 / 100. | **FIXED AND VERIFIED** (repo) |
| 12 | `/locations` (repaired) | `locations.html` (same builder) | It loaded `/assets/landing.css` and `/assets/landing.js`, which were never committed, so it rendered unstyled (1,194 px wider than a phone). It now uses the self-contained service-page template. The broken inline form is replaced with links to `/contact`, phone, WhatsApp and email. Narela now lists its real projects. | 0 px overflow at 390 px (was 1,194); Lighthouse a11y 96 → 100. | **FIXED AND VERIFIED** (repo) |
| 13 | `/noida` (repaired) | `noida.html` (same builder) | Same missing-asset problem. The existing honest copy is kept, including "no published Noida case study yet", on the new template. | 200; 0 overflow; Lighthouse lab 100 / 100 / 100. | **FIXED AND VERIFIED** (repo) |

**Duplicate-intent check:** no other page targets Narela or Vasant Kunj. `/locations/delhi`, `/gurgaon`, `/noida`, `/sonipat` and `/south-delhi` keep their existing 301s to the established city pages.

## 5. Redirects implemented

| From | To | Why | Status |
|---|---|---|---|
| `/insights/flat-interior-design-delhi-cost` | `/insights/flat-interior-design-delhi-cost-per-sqft` (301) | Both had the same H1 and intent. The newer one (May 2026) is folded into the older one (April), which the service pages already link to. | **FIXED AND VERIFIED** (emulator) |
| two existing 301s that pointed at the page above | now point straight at the final URL | Prevents a redirect chain | **FIXED AND VERIFIED**: crawler finds 0 chains |
| 9 rewrites `/projects/<slug>` → `/project-<slug>` | removed | Replaced by real files | **FIXED AND VERIFIED** |

Two stray files, `insights/modern-cafe-interior-design-delhi-ncr.html` and `insights/premium-living-room-design-gurgaon.html`, shadowed their folder versions. One of them had a trailing-slash canonical. They are now excluded in `.vercelignore` rather than deleted, so the folder versions are served. **FIXED AND VERIFIED** (emulator).

## 6. Broken links fixed

| What | Count | Files | Status |
|---|---|---|---|
| Footer and nav links to `/locations/narela` and `/locations/vasant-kunj` | Now resolve (pages exist) | — | **FIXED AND VERIFIED** |
| `href="/#contact"`, `/#about`, `/#services`, `/#projects`, `/#process`, `/#philosophy` | **972 links in 409 files** | `insights/**` via `scripts/seo/clean-insights.py` | **FIXED AND VERIFIED** (0 remain) |
| Internal links to redirected URLs → final URL | 14 | listing, service and location pages, via `scripts/seo/fix-insight-structure.py` | **FIXED AND VERIFIED** (0 remain) |
| Homepage project cards: `<div onclick>`, 5 of 7 opening the generic projects view | 7 real links to each case study (+7 decorative loop copies) | `site-app.html` via `scripts/seo/fix-homepage-carousels.py`, rebuilt by `build-pages.cjs` | **FIXED AND VERIFIED** |
| Generator would keep creating these | `/#…` targets → real pages; new listing cards no longer link to trailing-slash URLs | `scripts/generate-blogs.js` | **IMPLEMENTED BUT NOT VERIFIED** (syntax checked; needs the next scheduled run) |

**Crawler after the changes:** 180 pages, 251 URLs, **0 broken internal links, 0 links to redirects, 0 redirect chains, 0 sitemap orphans.**
**Before:** 2 broken, 12 to redirects, 31 orphans.

## 7. Content calculations corrected

**`/insights/interior-design-cost-south-delhi-guide`** — `scripts/seo/fix-south-delhi-cost-guide.py`. **FIXED AND VERIFIED**: the script asserts every figure.
- Table recomputed: low % of ₹1 crore to high % of ₹3 crore.

  | Category | Range |
  |---|---|
  | Living & dining | ₹25–90 lakh |
  | Master suite | ₹15–54 lakh |
  | Guest bedrooms | ₹10–36 lakh |
  | Kitchen | ₹12–45 lakh |
  | Bathrooms | ₹8–30 lakh |
  | Service areas | ₹5–21 lakh |
  | Contingency | ₹5–30 lakh |

- The page now explains that the percentage ranges sum to 80–102%, so readers choose values that total 100%.
- Example rescaled to add up: ₹30 + 80 + 40 + 60 + 30 lakh = **₹2.4 crore** (was ₹3.6 crore labelled ₹2.4 crore). Built-up area aligned to 4,000 sq ft, which is about ₹6,000 per sq ft. It is labelled as a made-up example, not an Indéva project.
- Added what the figures include and exclude, and a disclaimer.
- Removed the invented "senior cost consultant" quote and the unsourced "10–30% markup".
- Title: "2024" removed. `datePublished` 2026-08-22 is kept; `dateModified` 2026-11-02 and a visible correction note are added. Link text updated on the 4 pages that cite it.

**Three other local articles** — `scripts/seo/fix-local-cost-articles.py`. **FIXED AND VERIFIED** (asserted arithmetic). Each gets `dateModified` and a visible update note.
- **Defence Colony:**
  - Project management corrected to 10% × ₹1.64 crore = ₹16.4 lakh (was ₹20 lakh).
  - Total stated correctly as **₹1.95 crore** (was a range "₹1.6–2.4 crore" that matched nothing).
  - "Averages from recent market data" claim removed.
  - Unsourced 30–50% and 8–12% figures removed.
  - Invented quote removed; unsupported 6–10 month timeline removed.
- **Greater Kailash:**
  - Room items rewritten so each room adds up to its table row: ₹22 lakh low, ₹39 lakh high, totals shown worked out.
  - Room shares restated from the actual numbers.
  - "62% survey" removed.
  - Unverified **"10% discount on a fixed-price contract"** policy removed.
  - "Vetted supplier list" and "free consultation" claims removed.
  - Invented quote removed.
- **Hauz Khas:**
  - Budget labelled as an example.
  - Unsupported 10–14 week timelines replaced with "agree a written schedule".
  - Unattributed quote removed.
  - "Licensed architect must be engaged" corrected to a structural engineer's check.

**Site-wide quotation clean-up:** `scripts/seo/clean-insights.py`. **FIXED AND VERIFIED**
- 144 pull-quotes had their invented attribution and quotation marks removed. Examples: "– senior designer, indéva studio" (82 Indéva-attributed), "– industry analyst", and false citations of Architectural Digest India and NID.
- The sentence stays as the article's own pull-quote; nothing else in those articles changed.
- One quote written in markdown outside a `<blockquote>` was fixed by hand.
- Two non-attributions were correctly left alone.

## 8. Metadata changes

- **31 indexable articles** had two H1s; the second is now an H2 (90 extra H1s across all article files). **FIXED AND VERIFIED.**
- **New and rebuilt pages:** each has a unique title and description, one H1, a self-canonical, and Open Graph and Twitter tags with real project images.
- **Crawler:** 0 missing titles, descriptions or canonicals; 0 duplicate titles (was 1); 0 non-self canonicals (was 1).
- **Generator fix:** every new article was written with a trailing-slash canonical, `og:url`, schema `@id`, sitemap `<loc>` and IndexNow URL. The trailing-slash URL redirects, so new posts were also being left out of the sitemap. All of these now use the clean URL. **IMPLEMENTED BUT NOT VERIFIED** (next scheduled run).

## 9. Schema changes

- **New location pages:** BreadcrumbList, WebPage and FAQPage, referencing the existing business entity `@id …/#business`.
- **`/locations/narela`:** also carries the business node. Its address, phone and email are the ones already on every page of the site.
- **Not added:** ratings, reviews, hours, awards or offices.
- **Checks:** all JSON-LD on crawled pages parses. **FIXED AND VERIFIED** (syntax). Google's Rich Results Test needs the live URL: **BLOCKED** until deploy.

## 10. Sitemap and robots

- **`sitemap.xml`:** valid XML, 174 URLs, all canonical, indexable and 200. The two 404s are now real pages, and the one redirected article is dropped.
- **`build-sitemap.cjs`:** now reads `projects/*.html` directly. **FIXED AND VERIFIED.**
- **`robots.txt`:** unchanged, already correct. **NOT APPLICABLE.**

## 11. Performance and mobile changes

Changes, all made in `site-app.html` and rebuilt with `node build-pages.cjs` unless noted:
- Homepage enquiry form: one column under 600 px.
- `/services` detail images: never wider than their column.
- `/furniture` catalogue buttons: one column under 700 px.
- `/insights` listing (edited directly in `insights/index.html`): 117 listing images given width/height and lazy loading after the first row, plus a grid `min-width` fix.

Horizontal overflow at 390 px:

| Page | Before | After |
|---|---|---|
| `/` | 78 px | 0 |
| `/services` | 300 px | 0 |
| `/furniture` | 106 px | 0 |
| `/locations` | 1,194 px | 0 |

**FIXED AND VERIFIED** in headless Chrome.

**Lighthouse 12 lab results** (mobile simulation, local server; Google Fonts, GA, CDNs and Unsplash blocked in this sandbox, so the numbers are indicative only):

| Page | main (before) | branch (after) |
|---|---|---|
| `/` | perf 86, a11y 80, SEO 100, LCP 3.4 s, CLS 0.005 | perf 88, a11y 80, SEO 100, LCP 3.0 s, CLS 0 |
| `/locations` | 99 / 96 / 100, LCP 1.8 s | 99 / 100 / 100, LCP 1.6 s |
| `/insights` | 98 / 91 / 100 | 97 / 91 / 100 (within run-to-run noise) |
| `/locations/narela` | 404 | 99 / 100 / 100, LCP 1.9 s, CLS 0 |
| `/locations/vasant-kunj` | 404 | 99 / 100 / 100, LCP 1.9 s, CLS 0 |
| `/noida` | unstyled | 100 / 100 / 100 |
| `/projects/hotel-silk-murthal` | — | 100 / 100 / 100 |

These are lab numbers from one run each; they say nothing about real-user Core Web Vitals.

## 12. Build and testing results

| Check | Result |
|---|---|
| `node build-pages.cjs`, `node build-sitemap.cjs`, `python3 scripts/build-location-pages.py`, all fix scripts | Run cleanly |
| `node --check scripts/generate-blogs.js` | Passes |
| `vercel.json` | Valid JSON |
| `sitemap.xml` | Well-formed |
| Crawl through Vercel routing emulation | 180 pages · 0 broken links · 0 redirect links · 0 chains · 0 orphans · 0 duplicate titles · 0 bad canonicals · all pages 1 H1 · all JSON-LD parses |
| Direct navigation and refresh (local server with production routing) | Every project and location URL returns 200; old URLs return one 301; unknown URLs return 404 |
| Headless Chrome, 12 key pages × 2 viewports | All 200, 1 H1, 0 horizontal scroll, no broken local images, no focusable elements inside `aria-hidden` |
| Console | The only errors are `createClient` / `emailjs` undefined on core pages, because the Supabase and EmailJS CDNs are blocked in this sandbox. Pre-existing and identical on `main`. |
| Homepage carousels | Look and animation unchanged. The loop copies are now `aria-hidden` and out of the tab order; the real cards are links. |

The site has no lint or test suite, and `package.json` belongs to the blog generator.

## 13. Unresolved issues

| Item | Status | Needed |
|---|---|---|
| Live HTTP status of every URL | **BLOCKED**: the live domain and Vercel URLs can't be fetched from this session | After merging: open each `/projects/<slug>` and `/locations/*` URL in a private window, then purge the Cloudflare cache |
| Deploy | Waiting for your approval | Merge `seo-repair-2026-11` into `main`; Vercel deploys automatically |
| Service pages (Phase 7) | Audited: 6 unique pages with unique titles and H1s, related projects, locations and CTA. **FAQs not added** | FAQs should come from questions clients actually ask; send a list and they can be added in the same style as the location pages |
| Blog bot silent since 5 Oct | Not investigated (out of scope) | Check the GitHub Actions log for "Auto Blog Publisher" |
| ~170 near-duplicate insight articles | Not changed: an editorial merge, not a mechanical one | Editorial review (`ISSUES.md` ISSUE-12) |
| "Complimentary discovery session" in every article's footer CTA; company-voice pull-quotes ("we offer a free consultation", "a dedicated project manager") | Left: not invented people, but company claims | Confirm they're true, or ask for removal |
| Article hero images are Unsplash stock | Left: articles don't claim them as projects | Optional: swap in studio photography |
| Root-level `generate-blogs.js` (an older copy; the workflow uses `scripts/generate-blogs.js`) | Left | Delete when convenient |
| Search Console, GA4, Rich Results Test | **BLOCKED**: no access | See below |

## 14. Recommended next actions

1. **Merge and verify:** after merging, confirm the deploy is READY, purge Cloudflare, then open the 9 project URLs, `/locations/narela`, `/locations/vasant-kunj`, `/locations`, `/noida` and `/sitemap.xml`.
2. **Search Console:** resubmit `sitemap.xml` (expect 174). Use URL Inspection → Request indexing for `/locations/narela`, `/locations/vasant-kunj`, `/locations`, `/noida` and two project pages. Note today's impressions per page as a baseline.
3. **Rich Results Test:** run it on `/locations/narela` (Breadcrumb, FAQ).
4. **Blog bot:** find out why it stopped on 5 Oct. The generator fixes in this branch take effect on its next run.
5. **Service-page FAQs** from real client questions.
6. **Google Business Profile:** make its categories, Narela address and service areas match `/locations/narela`.
