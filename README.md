# Fix for /about, /projects, /furniture, /contact 404s

## What this is

Four real static HTML files — `about.html`, `projects.html`,
`furniture.html`, `contact.html` — each a full working copy of the current
`index.html`, with only the `<title>`, meta description, canonical URL, and
Open Graph tags changed to match that specific page.

## Why this fixes it, guaranteed

Vercel's routing precedence is: **real static files win over `rewrites`
entries, every time.** The `vercel.json` rewrites for these four paths were
already correct — but something about the deploy meant they weren't taking
effect (see the diagnosis from earlier). Rather than keep guessing at why a
rewrite isn't firing on a deployment I can't inspect, this sidesteps the
problem entirely: once `about.html` exists as a real file, a request to
`/about` resolves to it directly via Vercel's clean-URL file matching,
before rewrites are even considered. It cannot 404 for the same reason
`/delhi` or `/vendors` don't 404 — they work today for exactly this reason,
they're real files.

Once the file loads in the browser, the site's own router JS (already in
the file, unchanged) reads the URL, sees it's on `/about`, and shows the
About section automatically — same as normal in-app navigation, just
triggered on first load instead of a button click.

This is also better for SEO than the rewrite approach would have been even
if it worked: each of these pages now has its own correct `<title>` and meta
description present in the raw HTML Google fetches, not just set by
JavaScript after the page loads.

## How to deploy

Same process as always — GitHub web UI → "Add file" → "Upload files" →
drag in all four files → commit. No changes needed to `vercel.json`.

After it deploys, verify:
- `https://www.indevastudio.com/about`
- `https://www.indevastudio.com/projects`
- `https://www.indevastudio.com/furniture`
- `https://www.indevastudio.com/contact`

## If /services, /process, /philosophy need the same fix

I only built the four paths you've actually seen 404 in screenshots so far.
If those three are also affected (same underlying cause, so they likely
are), say so and I'll generate `services.html`, `process.html`, and
`philosophy.html` the same way — it's the same mechanical fix.

## One more thing worth knowing (not fixed here)

`vendors.html` already exists as a real static file in your repo — an
older, differently-styled page (Helvetica/Georgia, different colors) built
before the current site design. Because real files always win over
rewrites, `/vendors` has been serving that old file the whole time, not the
newer "Material & Vendor Network" version we built inside the SPA over the
last several rounds of edits. That SPA version has likely never been live.
If you want the newer version live at `/vendors`, I can either overwrite
`vendors.html` the same way as this fix, or merge the two — just say which.
