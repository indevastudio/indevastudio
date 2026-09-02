# New project: South Delhi Neo-Classical Residence — 2026-09-02

## What this adds

A 7th real project case study, built entirely from what you provided (project brief +
16 renders, 14 of them unique — 2 pairs were byte-identical duplicate files, verified
by checksum, so only one of each was used).

**New live page:** `/projects/south-delhi-neoclassical/`

## How to upload

Same GitHub web-UI flow as before. This bundle has **4 files to overwrite** and
**1 new folder of 14 images**:

| File in this bundle | Where it goes |
|---|---|
| `index.html` | repo root (overwrite — added the project to `window.PROJECTS`, the real data source your homepage's project section renders from) |
| `sitemap.xml` | repo root (overwrite — added the new page) |
| `projects/index.html` | `projects/` folder (overwrite — added the new project card + breadcrumb entry) |
| `projects/south-delhi-neoclassical/index.html` | new folder `projects/south-delhi-neoclassical/` |
| `south-delhi-neoclassical-images/*.webp` (14 files) | new folder `south-delhi-neoclassical-images/` at repo root |

Upload the images folder first (or alongside), then the 4 HTML/XML files, then commit.
Vercel auto-deploys as usual.

## What I did with your images

Renamed all 14 unique files from generic names (`kitchen.webp`, `CUPBOARD.webp`,
`MASTER_BEDROOM_1.webp`) to descriptive ones (`south-delhi-neoclassical-kitchen.webp`,
`south-delhi-neoclassical-wardrobe-interior-detail.webp`,
`south-delhi-neoclassical-master-bedroom-tv-unit.webp`) — per the image-SEO rule this
site already follows, and so each one is individually meaningful to Google Images
rather than a generic export name. Each also got real, descriptive (non-keyword-stuffed)
ALT text on the case-study page.

**Duplicates found and dropped:** `BEDROOM_1-2__1_.webp` / `BEDROOM_1-2__2_.webp` were
byte-identical (same MD5), as were `BEDROOM_4-1.webp` / `BEDROOM_4-1__1_.webp`. Only one
of each pair was kept — publishing the same image twice under two filenames doesn't add
anything and just bloats the page.

## What I did NOT invent

- **Year/status**: your brief gave a timeline (3 months) but not a specific year or
  completion status. I set `year: 2026` and `status: Completed` as the most defensible
  default — correct this in `window.PROJECTS` (in `index.html`) or the case-study page
  if that's wrong.
- **Budget**: your ₹20 Lakhs figure is published as a real fact on the page — this is
  the first project page on the site to include a budget figure, since you provided one
  explicitly and it's consistent with the cost-guide content strategy already running.
  If you'd rather keep this project's budget private, say so and I'll pull it before
  you upload.
- **Design highlights / brief / approach text**: written directly from your supplied
  "Project Overview" and "Design Highlights" content, not invented from scratch.

## Verify after deploy

- `https://www.indevastudio.com/projects/south-delhi-neoclassical/`
- `https://www.indevastudio.com/projects/` — new card should appear as the 7th project
- `https://www.indevastudio.com/sitemap.xml` — should show 393 `<url>` entries
- Homepage `/projects` section (the `window.PROJECTS`-rendered carousel/grid) should
  also show the new project once you spot-check it live
