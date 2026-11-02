#!/usr/bin/env python3
"""Site-wide clean-up of /insights articles (2 Nov 2026). Safe to re-run.

1. Anchor links: href="/#contact|#about|#services|#projects|#process|#philosophy"
   pointed at homepage sections that no longer exist (the homepage has no such
   ids; each section is its own page). They now point at /contact, /about,
   /services, /projects, /process, /philosophy.
2. Invented attributions: pull-quotes ending "– senior designer, indéva studio",
   "– industry analyst", "says a senior project manager at indéva studio" etc.
   quote people who cannot be identified. The attribution and the quotation
   marks are removed; the sentence stays as the article's own pull-quote.

Usage: python3 scripts/seo/clean-insights.py [--dry-run]
"""
import glob, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
DRY = '--dry-run' in sys.argv

ANCHORS = {'contact': '/contact', 'about': '/about', 'services': '/services',
           'projects': '/projects', 'process': '/process', 'philosophy': '/philosophy'}
ANCHOR_RX = re.compile(r'href="/#(' + '|'.join(ANCHORS) + r')"')

Q_OPEN, Q_CLOSE = '[“"]', '[”"]'
DASH = r'[–—-]'
# "quote" – attribution    (attribution: up to 90 chars of plain text)
# The attribution may not itself end in a closing quote mark (that would be a dash
# inside the quoted sentence) and may contain one link (fake publication citations).
ATTR = r'(?:[^<”"]|<a\s[^>]*>[^<]*</a>){1,200}?'
RX_DASH = re.compile(r'^(\s*(?:<p>)?\s*)' + Q_OPEN + r'(.+?)' + Q_CLOSE + r'\s*' + DASH + r'\s*' + ATTR + r'(\s*(?:</p>)?\s*)$', re.S)
# quote - indéva studio [designer]     (no quotation marks)
RX_BRAND = re.compile(r'^(\s*(?:<p>)?\s*)(.+?)\s+' + DASH + r'\s+(?:an?\s+)?[^<]{0,40}?ind[ée]va studio(?: designer)?\s*\.?(\s*(?:</p>)?\s*)$', re.S | re.I)
# "quote," says a senior ... at indéva studio.
RX_SAYS = re.compile(r'^(\s*(?:<p>)?\s*)' + Q_OPEN + r'(.+?)[,.]?' + Q_CLOSE + r',?\s+says\s+[^<]{1,90}?\.?(\s*(?:</p>)?\s*)$', re.S | re.I)


def clean_quote(inner):
    for rx in (RX_SAYS, RX_DASH, RX_BRAND):
        m = rx.match(inner)
        if m:
            text = m.group(2).strip().strip('“”"').strip()
            if text and text[0].islower():
                text = text[0].upper() + text[1:]
            if text and text[-1] not in '.!?':
                text += '.'
            return m.group(1) + text + m.group(3)
    return None


def main():
    files = sorted(glob.glob(os.path.join(ROOT, 'insights', '**', '*.html'), recursive=True))
    files += [os.path.join(ROOT, 'insights.html')]
    n_files = n_links = n_quotes = 0
    leftovers = []
    for f in files:
        if not os.path.exists(f):
            continue
        s = open(f, encoding='utf-8').read()
        orig = s
        s, k = ANCHOR_RX.subn(lambda m: f'href="{ANCHORS[m.group(1)]}"', s)
        n_links += k

        def bq(m):
            nonlocal n_quotes
            new = clean_quote(m.group(1))
            if new is None:
                if re.search(r'ind[ée]va studio\s*(designer)?\s*\.?\s*(</p>)?\s*$|' + Q_CLOSE + r'\s*' + DASH + r'\s*\w', m.group(1), re.I):
                    leftovers.append((os.path.relpath(f, ROOT), re.sub(r'\s+', ' ', m.group(1))[:140]))
                return m.group(0)
            n_quotes += 1
            return '<blockquote>' + new + '</blockquote>'
        s = re.sub(r'<blockquote>(.*?)</blockquote>', bq, s, flags=re.S)
        if s != orig:
            n_files += 1
            if not DRY:
                open(f, 'w', encoding='utf-8').write(s)
    print(f'{"[dry run] " if DRY else ""}files changed: {n_files}; anchor links fixed: {n_links}; attributions removed: {n_quotes}')
    for path, txt in leftovers:
        print('  not changed (check by hand):', path, '|', txt)


if __name__ == '__main__':
    main()
