# Hero headline update + 404 diagnosis

## 1. What's in this package

`index.html` — updated with the new hero headline/subheading. Upload this
to the repo root exactly the way DEPLOY.md describes (GitHub web UI →
"Add file" → "Upload files" → drag this in → commit). This will overwrite
the current root `index.html`.

New hero copy:
- Headline: "Architecture led interiors. Designed to be built."
- Subheading: "We design and deliver residential, commercial and hospitality
  spaces — from planning and interiors to furniture, drawings and execution."

(Shortened from what was given, and the hyphen in "Architecture-led" removed
per your instruction — it now reads "Architecture led".)

This file also carries forward everything from the last several rounds of
chat edits that were made to a local copy of index.html but never
re-uploaded to this repo: the two-CTA hero ("view our work" /
"discuss your project"), the stat-block credibility strip ("Ratings" instead
of "Google Reviews"), the dual-direction testimonial marquee, the
location/budget/project-type fields on the lead popup, and the vendor page
rename. If you only wanted the headline changed and not those other things
re-applied, say so and I'll split them apart — right now this file is the
single most current version of the site.

## 2. The /furniture and /contact 404s — diagnosis, not a code bug

I checked this thoroughly and the code is already correct:

- `vercel.json` already has rewrite rules for both `/furniture` and
  `/contact` → `/index.html`
- The page divs (`id="furniture"`, `id="contact"`) exist in `index.html`
- The client-side router's path-to-page map correctly includes both routes
- Both the 404 screenshots you sent show *your own branded* 404 page
  (from `404.html` in the repo), not a generic Vercel 404 — which confirms
  Vercel is falling through to that file rather than applying the rewrite

Given all of that is correct in the repo, the most likely explanation is
that Vercel simply hasn't deployed this current state of the repo yet, or
the last deploy failed silently. The repo has exactly one commit
("Add files via upload", made recently) — if that upload didn't trigger a
successful Vercel build, the live site is still serving whatever was
deployed before it.

**What to check on your end (I don't have access to your Vercel dashboard):**

1. Log into vercel.com → your indevastudio project → **Deployments** tab
2. Confirm there's a deployment matching the latest commit, and that its
   status is "Ready," not "Error" or "Building" stuck
3. If the latest deployment shows an error, open its build log — that will
   say exactly what failed
4. If there's no recent deployment at all, check **Settings → Git** to
   confirm the GitHub repo is actually connected and auto-deploy is enabled
   for the branch you're pushing to
5. If a deployment does show as "Ready" but the site still 404s, try a hard
   refresh / incognito window — Vercel's edge cache can occasionally serve
   a stale response for a few minutes after deploy

Once this `index.html` is uploaded (see step 1), that upload itself should
also trigger a fresh deploy — worth checking the Deployments tab right after
to confirm it actually goes green.
