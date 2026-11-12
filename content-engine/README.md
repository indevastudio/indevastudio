# indéva studio content engine

One honest article a week, written by Claude from the studio's real projects, published automatically
and emailed in full to ceo@indevastudio.com.

## how it works

1. **briefs** (`content-engine/briefs/`) are the queue. Each one names a project, the one idea the
   article is about, and the search phrase it should rank for. Six are already queued from the
   project pages.
2. **every week** a scheduled Claude run takes the next ready brief, looks at the photos, writes the
   article in the studio's voice (`VOICE.md`), runs the quality checks (`check.py`), builds the page
   (`build.py`) and publishes it to the live site — only if every check passes.
3. **you get an email** with the full article and a link to the live page. Want a change or want it
   removed? Ask Claude in chat.

## the fastest way to make articles better: add studio notes

Open any brief on GitHub (✏️ edit), scroll to **studio notes** and write a few plain lines: what
happened on site, what the client said, a problem you solved, a number that matters. The writer
treats these as source material. Two sentences from you make an article more original than anything
Claude can infer from a project page.

## adding a new brief (new project or a site story)

1. On GitHub open `content-engine/briefs/_TEMPLATE.md`, copy its text.
2. **Add file → Create new file** → name it `content-engine/briefs/<short-name>.md`, paste, fill it in,
   set `status: ready` and a `priority` (lower runs first).
3. New photos: **Add file → Upload files** into `content-engine/briefs/assets/<short-name>/`
   (JPG/PNG straight from the phone are fine; the builder resizes them).

## files

| file | what it is |
| --- | --- |
| `ENGINE.md` | the exact procedure the weekly run follows |
| `VOICE.md` | the studio's writing voice and banned phrases |
| `KEYWORDS.md` | which page owns which search phrase (prevents pages competing) |
| `briefs/` | the queue; `queue.py` lists it |
| `posts/` | the source of every engine article (edit here, then rebuild) |
| `check.py` | quality gate: facts, voice, originality, keyword, structure, meta |
| `build.py` | builds the page and wires it into /insights, the project page, the homepage, sitemap and feed |

## by hand

```
python3 content-engine/queue.py                 # the queue
python3 content-engine/check.py <slug>          # quality checks
python3 content-engine/build.py <slug>          # build one article (or --all)
```

Needs python3 with Pillow and PyYAML, and node.

## rules that keep it out of "AI spam" territory

- one article a week at most
- only the studio's own photos, looked at before use; renders labelled as renders
- every number traceable to a project page or the studio's notes
- no stock phrases, no keyword stuffing, one search phrase per page
- no copying the project page; no overlap with other articles
- no automatic cross-posting of full articles to other sites (the old fan-out is switched off)
