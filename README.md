# Hero CTA button redesign

`index.html` — same deploy process as before: GitHub web UI → "Add file" →
"Upload files" → drag this in, replacing the existing index.html → commit.

## What changed

Both hero buttons ("view our work" and "discuss your project") were rebuilt
from the old sharp-cornered, inline-styled buttons into a shared `.hero-cta`
component:

- **Pill shape** (fully rounded) instead of the previous rectangular buttons
  — reads as softer and more inviting to click
- **Primary button** ("discuss your project"): animated gold gradient that
  shifts on hover, a diagonal light sweep that passes across it on hover,
  a subtle continuous "breathing" glow (pulses gently even at rest, to draw
  the eye without being distracting), and the arrow slides right on hover
- **Secondary button** ("view our work"): clean bordered pill that lifts and
  picks up a gold border/text on hover, so it stays visually secondary but
  still feels responsive
- Both lift up smoothly on hover and settle back down on click, with proper
  keyboard focus outlines
- Respects `prefers-reduced-motion` — the breathing glow and sweep animation
  turn off entirely for anyone with that setting

This carries forward everything from the previous package too (the updated
hero headline, credibility stat block, testimonial marquee, etc.) since this
is the same continuously-updated file.
