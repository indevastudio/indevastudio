#!/usr/bin/env python3
"""Homepage carousels (2 Nov 2026), edited in site-app.html (the source of the
core pages; rebuild with `node build-pages.cjs`). Safe to re-run.

Both carousels repeat their cards once so the CSS marquee loops seamlessly. The
look and animation are unchanged; what changes:
  - Project cards were <div onclick>, which crawlers cannot follow, and five of
    them opened the generic projects view instead of their own case study. They
    are now <a href="/projects/<slug>"> links to the right case study.
  - The repeated (decorative) copies of both carousels get aria-hidden="true"
    and tabindex="-1", so screen readers and keyboard users meet each card once.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, 'site-app.html')
s = open(P, encoding='utf-8').read()

SLUG = {
    'villa project': 'villa-narela',
    'indéva studio office': 'indeva-studio-office-narela',
    'mini farmhouse': 'mini-farmhouse-delhi',
    'resham hotel': 'hotel-silk-murthal',
    'dda apartment': 'dda-apartment-delhi',
    'studio workspace': 'studio-workspace-gurgaon',
    'vasant kunj': 'vasant-kunj-dda-residence',
}

# ── projects carousel ──
a = s.index('<div class="projects-carousel-track" id="projectsTrack">')
b = s.index('<script>', a)
track = s[a:b]
dup_at = track.find('<!-- Duplicate set for seamless loop -->')
assert dup_at > 0


CARD = re.compile(
    r'<div class="project-card" onclick="[^"]*">'          # opening tag
    r'(\s*.*?<div class="project-card-info">.*?</div>\s*</div>)'  # contents up to the end of the info block
    r'(\s*)</div>', re.S)                                   # the card's own closing tag


def convert(block, decorative):
    extra = ' aria-hidden="true" tabindex="-1"' if decorative else ''

    def card(m):
        inner = m.group(1)
        name = re.search(r'<div class="project-card-name">([^<]+)</div>', inner).group(1).strip()
        return f'<a class="project-card" href="/projects/{SLUG[name]}" draggable="false"{extra}>{inner}{m.group(2)}</a>'
    return CARD.subn(card, block)


if 'class="project-card" onclick=' in track:
    first, n1 = convert(track[:dup_at], False)
    second, n2 = convert(track[dup_at:], True)
    assert n1 == n2 == 7, (n1, n2)
    s = s[:a] + first + second + s[b:]
    print(f'project cards converted to links: {n1} (+{n2} decorative copies)')
else:
    print('project cards already links')

if 'a.project-card' not in s:
    s = s.replace('.project-card {\n  position: relative;',
                  'a.project-card { display: block; color: inherit; text-decoration: none; }\n.project-card {\n  position: relative;', 1)

# ── offerings marquee ──
o = s.index('<div class="offerings-track">')
d = s.index('<!-- duplicate for seamless loop -->', o)
end = s.index('</section>', o)
seg = s[d:end]
seg2, n = re.subn(r'<div class="offering-card">', '<div class="offering-card" aria-hidden="true">', seg)
s = s[:d] + seg2 + s[end:]
print(f'decorative offering cards hidden from assistive tech: {n}')

open(P, 'w', encoding='utf-8').write(s)
