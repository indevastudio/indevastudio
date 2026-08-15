# Indéva Studio — Site Issues

Tracked here instead of GitHub Issues: this environment has no `gh` CLI and no
GitHub auth token, so issues can't be filed on the repo's tracker directly.
Copy these into GitHub Issues manually if you want them there, or share a
token/PAT and I can file them via the API next time.

All of these were discovered during the Phase 2 SEO landing-page build
(see `/interior-designer-south-delhi` etc.) — none were introduced by that work.

---

## ISSUE-1 — `delhi.html` and `interior-designer-delhi.html` are byte-identical duplicate pages
**Status: ✅ Resolved**
**Severity: High (confirmed live duplicate content, both indexed)**

Both files were 100% identical (`diff` returned no output), both live and
indexed at `/delhi` and `/interior-designer-delhi`, both self-declaring
`/interior-designer-delhi` as canonical.

**Fix applied:** Added a 301 redirect `/interior-designer-delhi → /delhi` in
`vercel.json`, and updated `delhi.html`'s own canonical/og:url/breadcrumb to
self-reference `/delhi`. `interior-designer-delhi.html` is left in the repo
(not deleted, per "don't remove existing pages") but is no longer reachable
as a separate route — Vercel redirects resolve before the filesystem match.
The footer nav link "Interior Designer Delhi" across the site now points to
`/delhi`.

---

## ISSUE-2 — `gurgaon.html` and `noida.html` (the good, full pages) declare their
## own canonical/og:url/breadcrumb as the *broken* stub URL
**Status: ✅ Resolved**
**Severity: High — this actively tells Google to consolidate ranking signal
onto the worse page**

`gurgaon.html` (1,049 lines, correct content) declares canonical
`https://www.indevastudio.com/interior-designer-gurgaon` — which serves
`interior-designer-gurgaon.html`, a 515-line stub with the wrong city in its
H1 ("Luxury Interior Design in New Delhi"). Same pattern for
`noida.html` → `/interior-designer-noida`. This is very likely why Google may
be preferring the weaker stub pages in search results over the fuller ones.

**Fix applied:** `gurgaon.html` and `noida.html` now self-reference
(canonical, og:url, breadcrumb schema all point to `/gurgaon` and `/noida`
respectively). This does **not** touch `interior-designer-gurgaon.html` —
per your earlier instruction to leave that file untouched, I left it fully
alone.

---

## ISSUE-3 — `interior-designer-noida.html` has the same copy-paste "New Delhi" H1 bug as the Gurgaon stub
**Status: ✅ Resolved**
**Severity: Medium**

`<h1>` read "Luxury Interior Design in New Delhi" on a page whose canonical,
title and meta all say Noida.

**Fix applied:** Corrected the H1 to "Luxury Interior Design in Noida." This
is a factual-accuracy fix to existing text, not a rebuild or a routing
decision, so I made it — but I did **not** touch the equivalent Gurgaon file
(`interior-designer-gurgaon.html`), since you asked me to leave that one
untouched and this issue list doesn't override that.

---

## ISSUE-4 — `interior-designer-gurgaon.html` is still a broken 515-line stub with the wrong H1
**Status: ⏸ Deliberately not resolved — left exactly as you instructed**
**Severity: Medium (same class of bug as ISSUE-3, fixed there)**

This is the same bug as ISSUE-3, on the Gurgaon file. When I flagged the
`/interior-designer-gurgaon` conflict before building the Phase 2 pages, you
said: *"Leave it untouched — I'll handle it separately."* I'm holding that
instruction here rather than reinterpreting "resolve the issues" as
overriding it. If you'd like it fixed now (either repair the stub in place,
or redirect it to `/gurgaon` the way I did for the Delhi duplicate), say the
word and I'll do it in the same pass.

---

## ISSUE-5 — `/projects` and `/services` are linked site-wide but don't exist
**Status: ✅ Resolved**
**Severity: High (site-wide dead links — footer nav, every "View Complete Case Study" button)**

No `projects.html`, `services.html`, or `/projects/<slug>` files existed
anywhere in the repo, despite being linked from every city page's footer and
every project card's case-study button. `vercel.json`'s rewrite config even
explicitly excludes these paths from the SPA fallback, so they almost
certainly 404'd in production.

**Fix applied:** Built `/projects` (portfolio hub, listing all 6 real
projects on record) and `/services` (service-offering hub), plus individual
case-study pages at `/projects/studio-workspace`, `/projects/dlf-crest-penthouse`,
`/projects/shanti-villa`, `/projects/mini-farmhouse`,
`/projects/hashtag-restaurant`, `/projects/jaypee-penthouse` — using only
real project data already present in the codebase (same descriptions,
images, locations, areas and years used elsewhere on the site). No
fabricated projects, numbers, or claims were added.

---

## ISSUE-6 — Some published `insights/` blog posts contain fabricated-sounding client anecdotes and invented author credentials
**Status: ⏸ Not resolved — flagging for your review, not auto-fixing**
**Severity: Medium–High (brand/trust risk + conflicts with your own no-fabrication rule)**

Examples found during research: a post attributing a specific ₹30 lakh
"client called us mid-project, frantic" story to a Golf Course Road villa
project not documented anywhere else on the site; another written in first
person as "a senior designer with 15 years of experience" citing specific
past clients "in Sector 150, Noida" with no such project on record.

**Why I'm not fixing this automatically:** there are dozens of `insights/`
posts (the automated content pipeline publishes ~4/day), and safely
resolving this means reading each one and distinguishing genuine general
advice from invented specifics — not something I can do reliably by pattern-
matching without risking either false positives (flattening legitimate
illustrative writing) or missing subtler fabrications. This is better done
as its own reviewed pass, ideally with input on which anecdotes (if any) are
real. Happy to start that as a separate task if you want — I'd suggest
starting with a search across `insights/` for first-person "client" stories
and named-but-undocumented projects, then reviewing each one with you before
editing.
