#!/usr/bin/env python3
"""indéva studio content engine — quality gate.

  python3 content-engine/check.py <slug>

Run after writing content-engine/posts/<slug>.md and BEFORE build.py. Exits non-zero on any
FAIL; WARN lines are judgement calls for the writer/reviewer. Nothing may be proposed for
publishing with a FAIL.

What it checks, and why Google cares:
  facts       every number in the article appears in its sources (project page + brief)
  voice       no stock AI phrases, no title case, no exclamation marks, short sentences
  original    does not copy the project page or overlap other articles (duplicate content)
  keyword     targets one phrase, not owned by another page; phrase used naturally, not stuffed
  structure   length, numbered sections, images with captions, internal links that resolve
  meta        title/description lengths, slug, date, cadence (no more than one article a day)
"""
import glob, os, re, sys
from datetime import date

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build  # noqa: E402  (reuses the parser so check and build read posts identically)

ROOT, ENGINE = build.ROOT, build.ENGINE

BANNED = [
    'delve', 'tapestry', 'elevate', 'elevated living', 'seamless', 'seamlessly', 'unlock', 'unleash',
    'game-changer', 'game changer', 'nestled', 'boasts', 'testament to', 'look no further',
    "in today's", 'in today’s', "whether you're", 'whether you’re', 'it is important to note',
    "it's important to note", 'embark', 'transform your space', 'dream home', 'in conclusion',
    'to sum up', 'at the end of the day', 'ultimate guide', 'navigating the', 'a myriad of',
    'plethora', 'symphony', 'harmonious blend', 'perfect blend', 'look and feel', 'state-of-the-art',
    'world-class', 'best in delhi', 'no.1', 'number one', 'guarantee', 'cutting-edge', 'top-notch',
    'when it comes to', 'stands as', 'serves as a', 'furthermore', 'moreover', 'additionally',
    'in the realm of', 'elevates', 'meticulously', 'effortlessly', 'breathtaking', 'stunning',
]

fails, warns = [], []
fail = fails.append
warn = warns.append


def text_of_html(path):
    s = open(path, encoding='utf-8').read()
    s = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>|<nav[\s\S]*?</nav>|<footer[\s\S]*?</footer>', ' ', s)
    s = re.sub(r'<[^>]+>', ' ', s)
    import html as h
    return re.sub(r'\s+', ' ', h.unescape(s)).lower()


def plain(md):
    t = re.sub(r'!\[([^\]]*)\]\([^)]*\)', r' \1 ', md)
    t = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', t)
    t = re.sub(r'[#*>`]', ' ', t)
    return re.sub(r'\s+', ' ', t).lower()


def shingles(t, n):
    w = re.findall(r"[a-z0-9]+", t)
    return {' '.join(w[i:i + n]) for i in range(len(w) - n + 1)}


def numbers(t):
    t = t.replace('’', "'")
    nums = set()
    for m in re.finditer(r'(?<![\w.])(\d[\d,]*(?:\.\d+)?)', t):
        nums.add(m.group(1).replace(',', ''))
    return nums


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    slug = sys.argv[1]
    p = build.load_post(slug)
    md, body = p['body_md'], plain(p['body_md'])

    # ── sources ──
    project_file = os.path.join(ROOT, 'project-' + p['project'].rstrip('/').split('/')[-1] + '.html')
    sources = ''
    if os.path.isfile(project_file):
        sources += text_of_html(project_file)
    else:
        fail(f'project page file not found for {p["project"]}')
    brief = p.get('brief', '')
    brief_path = os.path.join(ENGINE, 'briefs', f'{brief}.md') if brief else ''
    if brief_path and os.path.isfile(brief_path):
        sources += ' ' + open(brief_path, encoding='utf-8').read().lower()
    elif brief and not brief.startswith('('):
        fail(f'brief "{brief}" not found in content-engine/briefs/')
    for extra in p.get('sources', []) or []:
        f = os.path.join(ROOT, extra.lstrip('/'))
        if os.path.isfile(f):
            sources += ' ' + text_of_html(f)
        else:
            fail(f'listed source not found: {extra}')

    # ── facts: every number must come from a source ──
    src_nums = numbers(sources) | {str(int(n)) for n in numbers(sources) if n.isdigit()}
    heading_nums = set(re.findall(r'^## (\d\d) —', md, re.M))
    body_no_headings = re.sub(r'^## \d\d —', '', md, flags=re.M)
    body_no_headings = re.sub(r'\]\([^)]*\)', ']', body_no_headings)          # ignore URLs / image paths
    for n in sorted(numbers(body_no_headings.lower())):
        if n not in src_nums and n.lstrip('0') not in src_nums:
            fail(f'facts: number "{n}" is not in the project page or brief — remove it or add the source')
    if len(heading_nums) < 3:
        warn('structure: fewer than 3 numbered "## 0x —" sections')

    # ── voice ──
    for b in BANNED:
        if re.search(r'(?<![a-z])' + re.escape(b) + r'(?![a-z])', body):
            fail(f'voice: stock phrase "{b}"')
    if '!' in re.sub(r'!\[', '', md):
        fail('voice: exclamation mark')
    caps = [h for h in re.findall(r'^#{2,3} (.+)$', md, re.M) if re.search(r'\b[A-Z][a-z]', h)]
    if caps or re.search(r'[A-Z]', p['title']):
        fail('voice: titles and headings must be lowercase (' + '; '.join(caps[:2]) + ')')
    upper_words = re.findall(r'(?<![.!?]\s)(?<!^)\b[A-Z][a-z]{2,}', re.sub(r'!\[[^\]]*\]\([^)]*\)', '', md))
    if len(upper_words) > 3:
        warn(f'voice: capitalised words in body ({", ".join(upper_words[:5])}) — the house style is lowercase')
    sentences = [s for s in re.split(r'(?<=[.?])\s+', re.sub(r'!\[[^\]]*\]\([^)]*\)|^#.*$|^- .*$', '', md, flags=re.M)) if len(s.split()) > 2]
    long = [s for s in sentences if len(s.split()) > 32]
    avg = sum(len(s.split()) for s in sentences) / max(1, len(sentences))
    if avg > 20:
        fail(f'voice: average sentence is {avg:.0f} words (keep it under 20)')
    if len(long) > 2:
        warn(f'voice: {len(long)} sentences over 32 words — split them')
    if re.search(r'\b(our team of experts|skilled professionals|indéva studio’s|indéva studio\'s team)\b', body):
        fail('voice: say "we", not "our team of experts" / third person')

    # ── original: not a copy of the project page or other articles ──
    sh = shingles(body, 8)
    if os.path.isfile(project_file):
        overlap = len(sh & shingles(text_of_html(project_file), 8)) / max(1, len(sh))
        (fail if overlap > 0.20 else warn if overlap > 0.10 else (lambda *_: None))(
            f'original: {overlap:.0%} of 8-word runs copied from the project page (rewrite in your own words)')
    sh5 = shingles(body, 5)
    for f in glob.glob(os.path.join(ROOT, 'insights', '*', 'index.html')):
        other = f.split(os.sep)[-2]
        if other == slug:
            continue
        o = shingles(text_of_html(f), 5)
        j = len(sh5 & o) / max(1, len(sh5 | o))
        if j > 0.12:
            fail(f'original: {j:.0%} overlap with /insights/{other}')

    # ── keyword ──
    kw = (p.get('target_keyword') or '').lower().strip()
    if not kw:
        fail('keyword: target_keyword missing')
    else:
        owners = {}
        for line in open(os.path.join(ENGINE, 'KEYWORDS.md'), encoding='utf-8'):
            cells = [c.strip() for c in line.strip().strip('|').split('|')]
            if len(cells) >= 2 and cells[0] and cells[0] != 'phrase' and not cells[0].startswith('---'):
                owners[cells[0].lower()] = cells[1]
        owner = owners.get(kw, '')
        if owner and owner.startswith('/') and owner != f'/insights/{slug}':
            fail(f'keyword: "{kw}" is owned by {owner} — pick another phrase')
        words = [w for w in re.findall(r'[a-z0-9]+', kw) if w not in ('in', 'of', 'the', 'a', 'for', 'and', 'to')]
        first_para = plain(md.split('\n\n')[1] if '\n\n' in md else md)
        title_desc = (p['title'] + ' ' + p['description']).lower()
        if not all(w in title_desc for w in words):
            fail(f'keyword: the words of "{kw}" must appear in the title or description')
        if not all(w in (first_para + ' ' + plain(md.split('\n\n')[0])) for w in words):
            warn(f'keyword: "{kw}" is not in the opening paragraphs')
        uses = body.count(kw)
        if uses > 4:
            fail(f'keyword: "{kw}" used {uses} times — that reads as stuffing (max 4)')

    # ── structure ──
    wc = build.word_count(md)
    if wc < 550:
        fail(f'structure: {wc} words — too thin (min 550)')
    elif wc > 1400:
        fail(f'structure: {wc} words — too long (max 1,400); cut, don\'t pad')
    figs = re.findall(r'^!\[([^\]]+)\]\(([^)\s]+)', md, re.M)
    if len(figs) < 3:
        fail(f'structure: {len(figs)} images — use at least 3 photos from the project')
    if re.search(r'not only [^.]{0,80} but also', body):
        fail('voice: "not only … but also" construction')
    for cap, src in figs + [(p['hero_alt'], p['hero'])]:
        if 'content-engine/briefs/assets/' not in src and not os.path.isfile(os.path.join(ROOT, src.lstrip('/'))):
            fail(f'structure: image not found: {src}')
        if len(cap) < 15:
            fail(f'structure: caption too short for {src}')
        if 'unsplash' in src or src.startswith('http'):
            fail(f'structure: external/stock image {src} — only the studio\'s own photos')
    links = re.findall(r'(?<!!)\[[^\]]+\]\(([^)\s]+)\)', md)
    internal = [l for l in links if l.startswith('/')]
    if len(internal) < 3:
        fail(f'structure: {len(internal)} internal links — link the project, a service page and a city page')
    if p['project'] not in internal:
        fail(f'structure: the body must link to its project page {p["project"]}')
    for l in internal:
        path = l.split('#')[0].rstrip('/') or '/'
        cands = [path.lstrip('/') + '.html', path.lstrip('/') + '/index.html', path.lstrip('/'),
                 'project-' + path.split('/')[-1] + '.html']
        if path != '/' and not any(os.path.isfile(os.path.join(ROOT, c)) for c in cands):
            vercel = open(os.path.join(ROOT, 'vercel.json'), encoding='utf-8').read()
            if f'"source": "{path}"' not in vercel and f'"source":"{path}"' not in vercel:
                fail(f'structure: internal link {l} does not resolve')

    # ── meta ──
    seo_len = len(p['seo_title'])
    if seo_len > 65:
        fail(f'meta: seo_title is {seo_len} chars (max 65; Google cuts off around 60)')
    elif seo_len > 60:
        warn(f'meta: seo_title is {seo_len} chars — may be cut off in Google')
    dl = len(p['description'])
    if not 110 <= dl <= 165:
        fail(f'meta: description is {dl} chars (aim 120–160)')
    if not re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', slug) or len(slug) > 70:
        fail('meta: slug must be lowercase-hyphenated, max 70 chars')
    if len(p['hero_alt']) < 30:
        fail('meta: hero_alt too short — describe the photo and say where it is')
    try:
        d = date.fromisoformat(p['date'])
    except ValueError:
        fail('meta: date must be YYYY-MM-DD')
        d = None
    if d:
        for other in build.all_slugs():
            if other == slug:
                continue
            od = date.fromisoformat(build.load_post(other)['date'])
            if d == od:
                warn(f'cadence: /insights/{other} is also dated {od} — one article a day at most')

    for w in warns:
        print('WARN ', w)
    for f_ in fails:
        print('FAIL ', f_)
    print(f'\n{slug}: {len(fails)} fail, {len(warns)} warn, {wc} words, {len(figs)} images, {len(internal)} internal links')
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
