#!/usr/bin/env python3
"""Crawl the repo through the Vercel routing emulator. Starts from / + sitemap URLs,
follows internal <a href> links. Reports broken links, redirect links, chains, and
per-page SEO checks. Usage: crawl.py REPO [--json out.json]"""
import json, os, re, sys, html as H
from collections import defaultdict, Counter
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from importlib.machinery import SourceFileLoader
Router = SourceFileLoader("vroute", os.path.join(os.path.dirname(os.path.abspath(__file__)), "vercel-route.py")).load_module().Router

repo = sys.argv[1]
R = Router(repo)
ORIGIN = 'https://www.indevastudio.com'
sm = re.findall(r'<loc>([^<]+)</loc>', open(os.path.join(repo, 'sitemap.xml')).read())
start = ['/'] + [u.replace(ORIGIN, '') or '/' for u in sm]
seen, queue = {}, list(dict.fromkeys(start))
linked_from = defaultdict(set)
pages = {}

def norm(href, base):
    href = H.unescape(href.strip())
    if href.startswith(ORIGIN): href = href[len(ORIGIN):] or '/'
    if href.startswith('//') or re.match(r'^[a-z]+:', href): return None
    if href.startswith('#') or not href: return None
    if not href.startswith('/'):
        b = base.rsplit('/', 1)[0]
        href = b + '/' + href
    return href.split('#')[0].split('?')[0] or '/'

while queue:
    p = queue.pop(0)
    if p in seen: continue
    chain = R.follow(p)
    seen[p] = chain
    st, tgt = chain[-1][1], chain[-1][2]
    if st != '200' or not tgt or not tgt.endswith('.html'): continue
    final = chain[-1][0]
    if final in pages: continue
    s = open(os.path.join(repo, tgt), encoding='utf-8', errors='replace').read()
    pages[final] = (tgt, s)
    body = re.sub(r'(?s)<script.*?</script>|<!--.*?-->', '', s)
    for href in re.findall(r'<a\b[^>]*\bhref="([^"]*)"', body):
        n = norm(href, final)
        if n is None: continue
        if re.search(r'\.(webp|jpg|jpeg|png|pdf|svg|xml|txt|ico|css|js|mp4)$', n, re.I):
            linked_from[n].add(final);
            if n not in seen: queue.append(n)
            continue
        linked_from[n].add(final)
        if n not in seen: queue.append(n)

broken, redirect_links, chains = [], [], []
for u, ch in seen.items():
    st = ch[-1][1]
    if st.startswith('404') or st == 'LOOP':
        broken.append((u, sorted(linked_from.get(u, []))[:4]))
    elif len(ch) > 1 and u in linked_from:
        redirect_links.append((u, ch[-1][0], sorted(linked_from[u])[:3]))
    if len(ch) > 2: chains.append([c[0] for c in ch])

issues = defaultdict(list)
titles, descs = defaultdict(list), defaultdict(list)
for u, (f, s) in pages.items():
    noindex = re.search(r'<meta\s+name="robots"[^>]*noindex', s, re.I)
    t = re.search(r'(?s)<title>(.*?)</title>', s)
    d = re.search(r'<meta\s+name="description"\s+content="([^"]*)"', s)
    can = re.search(r'<link\b(?=[^>]*\brel="canonical")[^>]*\bhref="([^"]+)"', s)
    h1 = len(re.findall(r'<h1[\s>]', re.sub(r'(?s)<script.*?</script>', '', s)))
    if noindex: continue
    if not t: issues['no title'].append(u)
    else: titles[t.group(1).strip()].append(u)
    if not d: issues['no description'].append(u)
    else: descs[d.group(1).strip()].append(u)
    want = ORIGIN + (u if u != '/' else '/')
    if not can: issues['no canonical'].append(u)
    elif can.group(1) != want: issues['canonical not self'].append(f'{u} -> {can.group(1)}')
    if h1 != 1: issues[f'h1 count != 1'].append(f'{u} ({h1})')
    for blk in re.findall(r'(?s)<script type="application/ld\+json">(.*?)</script>', s):
        if not blk.strip(): issues['empty JSON-LD'].append(u); continue
        try: json.loads(blk)
        except Exception as ex: issues['invalid JSON-LD'].append(f'{u}: {ex}')
    for m in re.finditer(r'<img\b[^>]*>', s):
        if not re.search(r'\balt="', m.group(0)): issues['img without alt'].append(u); break
for t, us in titles.items():
    if len(us) > 1: issues['duplicate title'].append(f'{t[:60]} x{len(us)}: {us[:3]}')
for d, us in descs.items():
    if len(us) > 1: issues['duplicate description'].append(f'x{len(us)}: {us[:3]}')

sm_paths = set(u.replace(ORIGIN, '') or '/' for u in sm)
for u in sm_paths:
    ch = seen.get(u)
    if not ch or ch[-1][1] != '200' or len(ch) > 1: issues['sitemap URL not 200'].append(f'{u} {ch[-1][1] if ch else "?"}')
orphans = [u for u in sm_paths if u != '/' and not linked_from.get(u)]

print(f'pages crawled: {len(pages)}; URLs seen: {len(seen)}; sitemap: {len(sm_paths)}')
print(f'broken internal links: {len(broken)}')
for u, fr in sorted(broken)[:60]: print('   404', u, '<-', fr)
print(f'internal links to redirects: {len(redirect_links)}')
for u, to, fr in sorted(redirect_links)[:25]: print('   ', u, '->', to, '<-', fr)
print(f'redirect chains: {len(chains)}', chains[:5])
print(f'sitemap orphans (no internal link): {len(orphans)}', sorted(orphans)[:15])
for k, v in issues.items():
    print(f'{k}: {len(v)}')
    for x in v[:12]: print('   ', x)
if '--json' in sys.argv:
    json.dump({'broken': broken, 'redirect_links': redirect_links, 'issues': issues, 'pages': sorted(pages)},
              open(sys.argv[sys.argv.index('--json') + 1], 'w'), indent=1, default=list)
