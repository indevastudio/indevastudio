# Hero carousel update — 2026-09-03

## What changed

Removed 2 slides that didn't correspond to real, live projects:
- **Shanti Villa, Goa** — no case-study page exists (checked `window.PROJECTS`); this
  slide had been orphaned since Patel Nagar replaced it as a project entry.
- **DLF Crest, Gurgaon** — also no case-study page; same situation.

Added 2 slides for real, live projects that weren't in the hero carousel before:
- **Patel Nagar Retail Store** — uses the same cover image as its real project page
  (`patel-nagar-retail-1.jpg`)
- **South Delhi Neo-Classical Residence** — uses the same hero image as its case-study
  page (`south-delhi-neoclassical-living-room-seating.webp`)

Carousel is back to 7 slides, same as before, now: Mini Farmhouse → Resham Hotel → DDA
Apartment → Studio Workspace → Vasant Kunj → Patel Nagar → South Delhi Neo-Classical.

## One thing left as-is, worth a decision

"DLF Crest, Gurgaon" also appears once elsewhere in `index.html` — as the image caption
for Service 03 ("Project Execution & Delivery") in the services section, not in the hero
carousel. You only asked about the hero carousel, so I left it untouched. Same underlying
issue applies there (no real project page to back the claim) if you'd like that changed
too — just say so.

## How to upload

Same as always: **Add file → Upload files** → drag this bundle's `index.html` in,
overwriting the existing one at your repo root. Commit, Vercel auto-deploys.

## Verify after deploy

Visit the homepage and watch the hero carousel cycle through — "Shanti Villa" and "DLF
Crest" badges should no longer appear; "Patel Nagar" and "South Delhi Neo-Classical"
should, roughly every 5 seconds.
