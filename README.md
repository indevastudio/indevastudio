# Mobile fixes: content cutoff, lead popup close button, overlapping bar

Same deploy process — upload all 5 files to the repo root, replacing what's
there, commit.

## 1. Hero content getting cut off on mobile

Root cause: the pill-shaped hero buttons ("view our work" / "discuss your
project") were set to `white-space: nowrap` with no wrapping allowed on the
row. On a narrow phone, two nowrap buttons side by side don't fit — this
forced the whole hero column wider than the screen, which is what dragged
the headline, subheading, and the 4.9-rating stats row along with it,
clipping all of them at the screen edge.

Fixed by stacking the two buttons full-width on top of each other on mobile
instead of side-by-side, and adding `min-width: 0` to the hero column so it
can no longer be forced wider than the viewport by anything inside it.

(One thing that looked like a bug but isn't: the "spatial logic · honest
delivery · ..." row that also appeared cut off — that's a horizontally
scrolling ticker/marquee, showing a partial word at the edge mid-scroll is
expected there, not a bug.)

## 2. Lead popup form has no visible close button

This one was already fixed in the file — there's a mobile-specific rule
that repositions the popup as a bottom-anchored sheet with a height cap and
internal scrolling, which keeps the close button on-screen. If you were
seeing the cut-off version, it means the version currently live predates
that fix (same pattern as the other 404s from earlier — the deploy hasn't
caught up with the repo). I also added the same height cap to the
non-mobile version of the popup as a safety net for smaller laptop screens.

## 3. "Book Consultation" bar overlapping the floating call/WhatsApp buttons

Removed the bottom bar entirely, per your first suggestion. It was
redundant anyway — the floating call and WhatsApp buttons in the
bottom-right corner already do the same job as persistent, always-visible
actions, without needing a second overlapping bar. The markup is still in
the file (harmless, unused) but the bar itself no longer renders on any
screen size.

## Files in this package

`index.html`, `about.html`, `projects.html`, `furniture.html`,
`contact.html` — all five carry the fixes, since the four page-specific
files are just copies of `index.html` with different meta tags (see the
previous package's README for why).
