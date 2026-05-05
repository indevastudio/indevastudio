# indéva studio — SEO fix deployment guide

this is the order to deploy the changes. each step is small. nothing requires you to write code.

---

## step 1 — upload the new files to your github repo

go to your github repo: `github.com/indevastudio/indevastudio`

upload these files **to the root** of your repo (same folder as your existing `index.html`):

| file from this bundle | where it goes in repo |
|---|---|
| `vercel.json` | root (replace existing if there is one) |
| `about.html` | root |
| `delhi.html` | root |
| `gurgaon.html` | root |
| `noida.html` | root |
| `sitemap.xml` | root (replace existing) |
| `robots.txt` | root (replace existing) |

### how to upload via github web interface

1. open `github.com/indevastudio/indevastudio` in your browser
2. click **"add file"** → **"upload files"** (top right area)
3. drag all 7 files into the upload box
4. scroll down, give the commit a message like: **"add city pages, about page, fix vercel routing for SEO"**
5. click **"commit changes"**

vercel will auto-deploy in 30-60 seconds because of your existing CI setup.

---

## step 2 — verify each new URL works

after vercel deploys, open each of these in an incognito window:

- ✅ `https://www.indevastudio.com/about`
- ✅ `https://www.indevastudio.com/delhi`
- ✅ `https://www.indevastudio.com/gurgaon`
- ✅ `https://www.indevastudio.com/noida`
- ✅ `https://www.indevastudio.com/sitemap.xml` (should show XML, not your homepage)
- ✅ `https://www.indevastudio.com/robots.txt` (should show plain text)

if any of these still 404, the `vercel.json` didn't take. check that it was uploaded to the root, not a subfolder.

---

## step 3 — fix the base64 founder image

your homepage currently has the founder photo of arpit embedded directly in the html as a giant base64 string. this slows down every page load.

### what to do

1. find the photo of arpit on your computer (or take a screenshot from the current site)
2. save it as `founder-arpit.webp` (use squoosh.app to convert from jpg/png to webp — free, browser-based, no signup)
3. upload it to your github repo in the same folder as your other images: `project-images-for-website/founder-arpit.webp`
4. open your `index.html` in github editor (click the file, then the pencil icon)
5. find this part of the file (search with Ctrl+F for `data:image/png;base64`):

```html
<img src="data:image/png;base64,/9j/4AAQSk... [HUGE BLOB] ..." alt="arpit saini">
```

6. replace the entire `src="data:image/png;base64,..."` part with:

```html
<img src="https://cdn.jsdelivr.net/gh/indevastudio/indevastudio@main/project-images-for-website/founder-arpit.webp" alt="arpit saini, founder of indéva studio" width="600" height="800" loading="lazy">
```

7. commit the change

this single fix will probably knock 200-400 KB off your homepage.

---

## step 4 — submit to Google Search Console

once steps 1-3 are done and verified live:

1. go to `search.google.com/search-console`
2. select your `indevastudio.com` property
3. in the **URL Inspection** bar at the top, paste each URL **one by one**:
   - `https://www.indevastudio.com/`
   - `https://www.indevastudio.com/about`
   - `https://www.indevastudio.com/delhi`
   - `https://www.indevastudio.com/gurgaon`
   - `https://www.indevastudio.com/noida`
   - `https://www.indevastudio.com/insights`
4. for each URL, click **"REQUEST INDEXING"** after the inspection completes
5. you can do about 10-12 per day before GSC throttles you

then go to **Sitemaps** in the left sidebar and re-submit:
- enter: `sitemap.xml`
- click **"submit"**

if it still shows "temporary processing error" today, that's a GSC backend issue — wait 24 hours and try again. as long as the file loads at `/sitemap.xml`, it will eventually go through.

---

## step 5 — claim Google Business Profile

this takes 5 minutes and is the highest-ROI SEO action you can take for local search:

1. go to `business.google.com`
2. click **"manage now"** → search for "indéva studio"
3. if not found, click **"add your business to google"**
4. business name: **indéva studio**
5. category: **interior designer**
6. location: select **"yes, i serve customers"** (since you don't have a public office walk-in)
7. service areas: add **delhi, gurgaon, noida, faridabad**
8. address: your studio address (won't be public)
9. phone: **+91 9717881083** (use this consistently — never the second number)
10. website: **https://www.indevastudio.com**
11. verification: choose postcard or video verification

once verified (5-14 days):
- upload 20+ project photos
- fill out services in detail
- add your hours
- write a 750-character business description
- ask 5-6 of your previous clients (Pranav Gaur, Manogya Singh, Rahat Gera, Sumit Kumar, Sonali Jain, Areeb Sami) to leave reviews

---

## step 6 — what to do over the next 4 weeks

### week 1 (this week)
- ✅ deploy the files (steps 1-3)
- ✅ submit to GSC (step 4)
- ✅ claim GBP (step 5)

### week 2
- ask 3-5 past clients for GBP reviews
- list yourself on **justdial.com**, **sulekha.com**, **houzz.in** (free citations)
- update your linkedin company page with: link to /delhi, /gurgaon, /noida in the description and posts

### week 3
- pitch one design publication (LBB Delhi, AD India online, Better Interiors)
- have your blog automation update its sitemap entry inclusion (so individual posts show in `/sitemap.xml`)
- add internal links from blog posts to /delhi, /gurgaon, /noida wherever locations are mentioned

### week 4
- write one flagship long-form post: "the real cost of luxury interior design in delhi 2026"
- request indexing for any new blog posts in GSC
- check GSC Performance tab — you should start seeing impressions for the new city pages

---

## what to expect

**week 1-2**: Google starts crawling the new URLs. You'll see them appear in GSC under "Pages" → "Indexed" within 7-14 days.

**week 3-4**: You start getting impressions for "interior designer delhi/gurgaon/noida" type queries. Initial rankings will be on page 4-6.

**month 2-3**: Rankings climb as Google evaluates content quality. Expect to reach page 2 for less-competitive long-tail terms ("luxury interior designer in dlf phase 5", "farmhouse interior designer chattarpur", etc.).

**month 4-6**: With consistent GBP activity, citation building, and one strong backlink, page 1 rankings for long-tail local queries become realistic.

---

## anything not covered

things i did NOT do that you'll want eventually:

- individual project pages (e.g., `/projects/mini-farmhouse-delhi`) — high SEO value, can be added later
- a dedicated services page (`/services`) — currently 404, lower priority since the homepage covers services
- a contact page (`/contact`) — currently 404, the homepage form covers this
- a projects index page (`/projects`) — currently 404, the homepage projects section covers this

these are the next batch when you're ready. they should follow the same template pattern as the city pages.

---

## something not working?

reach out and tell me which step. most likely failure points:
1. files uploaded to wrong folder (must be repo root)
2. vercel deploy not triggered (force re-deploy in vercel dashboard)
3. URL still 404 (check `vercel.json` made it to root, exact filename match is case-sensitive on linux)
