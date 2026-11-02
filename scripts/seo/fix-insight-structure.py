#!/usr/bin/env python3
"""Structural SEO fixes for /insights (2 Nov 2026). Safe to re-run.

1. One H1 per article: older articles have the template H1 (class="article-title")
   plus a second <h1> at the top of the body. The second one becomes an <h2>.
2. Internal links that hit a redirect (a vercel.json 301 source) are rewritten to
   the final URL, so crawlers and visitors don't take an extra hop.
3. Orphans: every insight URL in sitemap.xml that is not linked from /insights
   gets a card on the listing page (insights/index.html), built from the
   article's own title, description, category and image.
4. Listing images get width/height (they are all 1200x675 crops) and lazy
   loading below the first row, to stop layout shift.

Usage: python3 scripts/seo/fix-insight-structure.py
"""
import glob, html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
ORIGIN = 'https://www.indevastudio.com'
os.chdir(ROOT)

vercel = json.load(open('vercel.json'))
redirect = {r['source'].rstrip('/') or '/': r['destination'] for r in vercel.get('redirects', [])
            if ':' not in r['source'] and '(' not in r['source']}


def final(path):
    seen = 0
    while path in redirect and seen < 5:
        path = redirect[path]
        seen += 1
    return path


# ── 1 + 2 ────────────────────────────────────────────────────────────────
files = [f for f in glob.glob('**/*.html', recursive=True)
         if not f.startswith(('node_modules/', 'public/', 'new-update-03 Sept/', 'images-only/', 'projects/'))
         or re.match(r'projects/[^/]+\.html$', f)]
n_h1 = n_links = 0
for f in files:
    s = open(f, encoding='utf-8', errors='surrogateescape').read()
    orig = s
    if f.startswith('insights/') and 'class="article-title"' in s:
        count = [0]

        def demote(m):
            count[0] += 1
            if count[0] == 1:
                return m.group(0)
            return '<h2' + m.group(1) + '>' + m.group(2) + '</h2>'
        s = re.sub(r'<h1(\b[^>]*)>(.*?)</h1>', demote, s, flags=re.S)
        n_h1 += max(0, count[0] - 1)

    def fix_href(m):
        global n_links
        href = m.group(1)
        if not href.startswith('/') or href.startswith('//'):
            return m.group(0)
        path, sep, frag = href.partition('#')
        key = path.rstrip('/') or '/'
        if key in redirect:
            dest = final(key)
            if dest != key:
                n_links += 1
                return f'href="{dest}{sep}{frag}"'
        return m.group(0)
    s = re.sub(r'href="([^"]+)"', fix_href, s)
    if s != orig:
        open(f, 'w', encoding='utf-8', errors='surrogateescape').write(s)
print(f'extra H1s demoted: {n_h1}; links to redirects rewritten: {n_links}')

# ── 3 ────────────────────────────────────────────────────────────────────
LIST = 'insights/index.html'
s = open(LIST, encoding='utf-8').read()
# drop listing cards that point at a redirected article or repeat an earlier card
seen_cards, dropped = set(), [0]


def keep_card(m):
    href = m.group(1)
    if href in redirect or href in seen_cards:
        dropped[0] += 1
        return ''
    seen_cards.add(href)
    return m.group(0)
s = re.sub(r'\n?\s*<a class="blog-card" href="([^"]+)">.*?</a>', keep_card, s, flags=re.S)
print(f'duplicate/redirected listing cards removed: {dropped[0]}')
linked = set(re.findall(r'href="(/insights/[^"#?]+)"', s))
sitemap = re.findall(r'<loc>' + re.escape(ORIGIN) + r'(/insights/[^<]+)</loc>', open('sitemap.xml').read())
orphans = [u for u in sitemap if u not in linked]


def meta(doc, name, prop=False):
    attr = 'property' if prop else 'name'
    m = re.search(r'<meta\s+' + attr + r'="' + re.escape(name) + r'"\s+content="([^"]*)"', doc)
    return html.unescape(m.group(1)) if m else ''


cards = []
for u in orphans:
    doc = open(u.lstrip('/') + '/index.html', encoding='utf-8').read()
    t = re.search(r'(?s)<h1[^>]*>(.*?)</h1>', doc)
    title = html.unescape(re.sub(r'<[^>]+>', '', t.group(1))).strip() if t else meta(doc, 'og:title', True)
    desc = meta(doc, 'description')
    img = meta(doc, 'og:image', True)
    if not img:
        m = re.search(r'<div class="article-image">\s*<img[^>]*src="([^"]+)"', doc)
        img = m.group(1) if m else ''
    alt_m = re.search(r'<div class="article-image">\s*<img[^>]*alt="([^"]*)"', doc)
    alt = html.unescape(alt_m.group(1)) if alt_m else title
    cat_m = re.search(r'<span class="article-cat[^"]*">([^<]+)</span>|<div class="article-cat[^"]*">([^<]+)</div>', doc)
    cat = (cat_m.group(1) or cat_m.group(2)).strip() if cat_m else 'insights'
    img_html = (f'<img src="{html.escape(img)}" alt="{html.escape(alt)}" class="blog-card-image" width="1200" height="675" loading="lazy" decoding="async">\n      '
                if img else '')
    cards.append(f'''<a class="blog-card" href="{u}">
      {img_html}<div class="blog-card-cat">{html.escape(cat)}</div>
      <h2 class="blog-card-title">{html.escape(title)}</h2>
      <p class="blog-card-excerpt">{html.escape(desc)}</p>
      <div class="blog-card-read">read article ↗</div>
    </a>''')

if cards:
    grid = s.find('<div class="blog-grid">')
    last_card_start = s.rfind('<a class="blog-card"')
    assert grid >= 0 and last_card_start > grid
    insert_at = s.find('</a>', last_card_start) + len('</a>')
    s = s[:insert_at] + '\n\n    ' + '\n\n    '.join(cards) + s[insert_at:]
print(f'orphan articles added to /insights: {len(cards)}')

# ── 4 ────────────────────────────────────────────────────────────────────
k = [0]


def dims(m):
    tag = m.group(0)
    if 'width=' in tag:
        return tag
    k[0] += 1
    extra = ' width="1200" height="675"' + ('' if k[0] <= 3 else ' loading="lazy" decoding="async"')
    return tag[:-1] + extra + '>'
s = re.sub(r'<img\b[^>]*class="blog-card-image"[^>]*>', dims, s)
open(LIST, 'w', encoding='utf-8').write(s)
print(f'listing images given dimensions: {k[0]}')
