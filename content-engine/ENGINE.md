# weekly run — instructions for Claude

This file is the whole procedure for the scheduled weekly article run. Follow it exactly.
The goal is **one** genuinely useful article a week, written from the studio's real projects, that
Google treats as original expert content. Quality beats quantity: if anything below can't be met,
open no pull request and say why.

## 0. set up

- Work in the repo `indevastudio/indevastudio` (attach and clone it if it isn't in the session).
  `git fetch origin main && git checkout -B article/<brief-id> origin/main`.
- Tools needed: python3 with Pillow + PyYAML (`pip install --break-system-packages pillow pyyaml` if missing), node.

## 1. pick the brief

- `python3 content-engine/queue.py` to see the queue, `python3 content-engine/queue.py --next` for the next id.
- If nothing is `ready`, stop: report "no brief ready — add one in content-engine/briefs/" and open nothing.
- If an open pull request from a previous run (branch `article/*`) is still unmerged, stop and report it:
  never stack a second article on an unreviewed one. Check with the REST API (GraphQL `gh pr` commands
  are blocked in Claude sessions):
  `gh api 'repos/indevastudio/indevastudio/pulls?state=open' --jq '.[] | select(.head.ref|startswith("article/")) | .html_url'`
- If the brief says CHECK FIRST and you can't confirm it, set it to `hold` in a tiny PR or report it, and stop.

## 2. gather the source material — nothing else is a source

- the brief (`content-engine/briefs/<id>.md`), especially **studio notes** — the most valuable part
- the project page it names (`project-<name>.html`) — its facts, captions and images
- photos: the project page's images, plus any files in `content-engine/briefs/assets/<id>/`
- **look at every photo you plan to use** (Read the image file). Decide if it's a site photo or a
  design render and caption it truthfully. Never use a photo you haven't looked at.
- read `content-engine/VOICE.md` and two published articles in `content-engine/posts/` to match the voice.

## 3. write `content-engine/posts/<slug>.md`

- frontmatter (copy the shape of an existing post): `slug`, `title` (lowercase), `seo_title`
  (Title Case is fine there, ≤ 60 chars, ends "| Indéva" or "| Indéva Studio"), `description`
  (120–160 chars, lowercase, contains the target phrase), `date` (today, YYYY-MM-DD), `category`,
  `target_keyword` (from the brief), `project`, `hero`, `hero_alt` (sentence case, says what and where),
  `brief: <brief-id>`.
- body: markdown subset only — paragraphs, `## 01 — heading`, `- ` lists, `**bold**`, `[text](/link)`,
  and figures on their own line: `![caption ending with "<project>, <place>."](/image-path.webp)`.
- the slug: lowercase-hyphenated, contains the target phrase's main words, ≤ 70 chars.
- follow VOICE.md. Every number must come from the brief or the project page. No prices unless the
  source states them. No invented quotes, clients, awards, counts or timelines.
- add value beyond the project page: the reasoning behind decisions, what a reader in the same
  situation should do, the question to ask their designer. Don't paraphrase the project page.

## 4. check, fix, repeat

- `python3 content-engine/check.py <slug>` — fix every FAIL (rewrite; never weaken check.py to pass).
  Read every WARN and fix it unless it's clearly wrong for this article.
- Re-read the article once as a sceptical client: is any sentence vague, salesy or unsupported? cut it.

## 5. build

- `python3 content-engine/build.py <slug>` — writes the page, the /insights card, the project-page
  link, the homepage "insights & perspectives" block, index.html, sitemap.xml and feed.xml.
- Render check: serve the repo (`python3 -m http.server`) or open the built HTML and confirm the page
  loads, images show, and there are no console errors.
- In `content-engine/KEYWORDS.md` replace the brief's "(open — brief: <id>)" with `/insights/<slug>`.
- `python3 content-engine/queue.py --set <brief-id> written`.

## 6. open the pull request — never push to main

- Commit everything on `article/<brief-id>` and push the branch.
- Open the PR with the REST API (write the body to a file first):
  `gh api repos/indevastudio/indevastudio/pulls -f title='article: <title>' -f head='article/<brief-id>' -f base=main -F body=@/tmp/pr-body.md --jq .html_url`
  The PR has:
  - title: `article: <title>`
  - body: the target phrase and its volume, word count, the check.py summary line, the list of
    photos used (site photo / render), every number used and where it came from, and
    "Merge this PR to publish. Close it to discard." End with the PR attribution line.
- Report back: the PR link and a two-line summary. Done.

## after the studio merges

Vercel deploys automatically. Then (by hand, or ask Claude in chat): request indexing for the new URL
in Google Search Console, and share it once on LinkedIn/Instagram. On the next run, set the merged
brief's status to `published` if it still says `written`.
