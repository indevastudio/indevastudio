# indéva studio — SEO fix bundle, 2026-09-01

Verified against a real `git clone` of the repo, not against ISSUES.md's old claims —
see the "CORRECTION" note near the top of `ISSUES.md` in this bundle for why that
distinction matters this time.

## How to upload

Same process as before: `github.com/indevastudio/indevastudio` → **Add file** →
**Upload files**. This bundle preserves the folder structure (`projects/mini-farmhouse/index.html`
etc.) — when you drag the whole bundle folder in, GitHub's uploader keeps the paths, so
each file lands in the right place automatically. If your browser only lets you drop
individual files, recreate the folders manually and upload into them.

**19 content/config files + this README.** Give the commit a message like
`"fix generator bug, strip fabricated credentials, add project/services pages, redirects"`.
Vercel auto-deploys in 30-60 seconds after commit, same as always.

## What's in this bundle, and why

### 1. `scripts/generate-blogs.js` — two real bugs fixed
- **Slug-stacking bug**: could append the same suffix twice on a repeat collision,
  producing URLs like `...-case-study-case-study`. Now loops properly and never
  re-appends an existing suffix.
- **Fabrication bug**: the prompt opened with "You are a senior writer for indéva
  studio" (first-person), which kept producing "as a senior designer with 15 years of
  experience..." claims despite an existing rule telling it not to. Reworded to
  third-person, added a banned-phrase list, and added a hard regex check in
  `validateBlog()` as a second line of defense — a prompt instruction alone had already
  failed silently on multiple live posts.

### 2. `vercel.json` — 9 new redirects
The 9 live URLs produced by the slug-stacking bug above, each 301'd to its root
article. Verified every destination page actually exists before adding the redirect.
Did **not** touch the existing `redirects`/`rewrites` entries.

### 3. `sitemap.xml` — cleaned up and expanded
Removed the 9 now-redirected bug URLs, added the 8 new pages below. 384 + 8 = 392 URLs,
validated as well-formed XML.

### 4. 9 `insights/*/index.html` files — fabricated credentials stripped
Found by scanning every live insight page directly (not trusting the changelog) for
"as a senior designer" / "N years of experience" patterns. 11 matched, 2 were false
positives on inspection (generic, non-first-person mentions) and were left alone. The
other 9 had the fabricated clause removed, keeping the substantive point that followed
each one so the sentence still reads naturally.

### 5. `projects/` — 6 real case-study pages + an index, all new
Built entirely from the real `window.PROJECTS` array already in `index.html` (confirmed
as the actual current data source via `patel-nagar-project-entry.txt`, which explains
that `projects.html` is an older, disconnected duplicate). No invented projects,
numbers, or client details — every fact, image, and description here already existed
somewhere in the codebase; this just gives each project a real, indexable page instead
of a dead link. New pages:
- `/projects/` (index/hub)
- `/projects/mini-farmhouse/`
- `/projects/resham-hotel/`
- `/projects/studio-workspace/`
- `/projects/dda-apartment/`
- `/projects/patel-nagar/`
- `/projects/vasant-kunj/`

Each has Article + BreadcrumbList JSON-LD, a real image gallery, and links to related
projects of the same typology.

### 6. `services/` — new, built from the real content already in `index.html`
The SPA's `#services` anchor section already had three well-written, real service
descriptions (Architecture & Interior Design, Furniture & Joinery, Project Execution &
Delivery) with real image references — they just weren't independently crawlable/
rankable, since `/services` only existed as a same-page anchor. This repackages that
exact copy as a real page with Service + `hasOfferCatalog` + BreadcrumbList JSON-LD.
Nothing was invented; it's the same words already live on the homepage.

### 7. `ISSUES.md` — corrected
Added a note at the top: this session found that ISSUE-5, ISSUE-6, and ISSUE-7 were
marked "✅ Resolved" in this file but the actual fixes weren't present in the repo when
checked directly. Rather than removing that history, added a correction note plus
ISSUE-9 through ISSUE-12 documenting what was actually verified and fixed this session.

## Verify after deploy (same pattern as before)

- `https://www.indevastudio.com/services/`
- `https://www.indevastudio.com/projects/`
- `https://www.indevastudio.com/projects/vasant-kunj/` (spot-check one case study)
- `https://www.indevastudio.com/insights/luxury-bedroom-design-cost-delhi-ncr-case-study-case-study/`
  should now 301 to `.../luxury-bedroom-design-cost-delhi-ncr/`
- `https://www.indevastudio.com/sitemap.xml` — should show 392 `<url>` entries

## What this does NOT include (deliberately)

- The other ~170 near-duplicate `/insights/` pages flagged in the full audit
  (rotating-suffix pattern, genuinely different body text so not safe to batch-redirect)
  — that needs manual content review/merging per topic, not a mechanical fix. Full list
  is in the audit spreadsheet shared separately.
- `projects.html` and `pshow.html`/`pshow.js` — the older, disconnected duplicate
  project-listing files. Left untouched; flagged as future cleanup debt.
- Splitting `/services/` into 9 individual service pages (villa, farmhouse, office,
  etc.) per the original architecture brief — only 3 services have real copy to draw
  from right now; the rest would need to be written from scratch, which isn't something
  to do without your input on positioning/pricing for each.
- Faridabad and Greater Noida location pages — no existing content or confirmed project
  history to build them from yet.
