#!/usr/bin/env python3
"""indéva studio content engine — builder.

Turns content-engine/posts/<slug>.md into a finished article page and wires it into the site:

  python3 content-engine/build.py <slug>     build one post
  python3 content-engine/build.py --all      rebuild every post

For each post it:
  1. converts the markdown body (small, predictable subset — see README) to HTML
  2. prepares images: site images get a srcset from their existing sizes; raw photos from
     content-engine/briefs/assets/ are resized to 800/1600 px WebP under /insights-images/<slug>/
  3. writes insights/<slug>/index.html (BlogPosting + breadcrumb schema, GA, canonical, OG)
  4. puts a card for it at the top of /insights
  5. links it from its project page ("Further reading")
  6. refreshes the homepage "insights & perspectives" block with the 3 newest posts
  7. rebuilds the static pages, sitemap.xml and feed.xml

Needs: python3 with Pillow and PyYAML, node (for build-pages.cjs / build-sitemap.cjs / scripts/feed.js).
"""
import glob, html, json, os, re, subprocess, sys
from datetime import date

import yaml
from PIL import Image, ImageOps

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(ROOT, 'content-engine')
ORIGIN = 'https://www.indevastudio.com'
MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august',
          'september', 'october', 'november', 'december']
HOME_START, HOME_END = '<!-- ENGINE:LATEST-INSIGHTS:START -->', '<!-- ENGINE:LATEST-INSIGHTS:END -->'

esc = lambda s: html.escape(str(s), quote=True)


# ── posts ────────────────────────────────────────────────────────────────
def load_post(slug):
    path = os.path.join(ENGINE, 'posts', f'{slug}.md')
    raw = open(path, encoding='utf-8').read()
    m = re.match(r'^---\n([\s\S]*?)\n---\n([\s\S]*)$', raw)
    if not m:
        sys.exit(f'{path}: missing --- frontmatter ---')
    meta = yaml.safe_load(m.group(1)) or {}
    meta['body_md'] = m.group(2).strip()
    meta.setdefault('slug', slug)
    if meta['slug'] != slug:
        sys.exit(f'{path}: slug in frontmatter ({meta["slug"]}) must match the file name')
    for k in ('title', 'seo_title', 'description', 'date', 'category', 'hero', 'hero_alt', 'project'):
        if not meta.get(k):
            sys.exit(f'{path}: frontmatter field "{k}" is required')
    meta['date'] = str(meta['date'])
    return meta


def all_slugs():
    return sorted(os.path.basename(p)[:-3] for p in glob.glob(os.path.join(ENGINE, 'posts', '*.md')))


# ── images ───────────────────────────────────────────────────────────────
def site_image(src):
    """Return (src, srcset, w, h) for an image already on the site."""
    rel = src.split('?')[0].lstrip('/')
    full = os.path.join(ROOT, rel)
    if not os.path.isfile(full):
        sys.exit(f'image not found on the site: {src}')
    m = re.match(r'^(.*)-(\d{3,4})(w?)\.(webp|jpg|jpeg|png)$', rel)
    variants = []
    if m:
        base, _, wsuf, ext = m.groups()
        for f in glob.glob(os.path.join(ROOT, glob.escape(base) + '-*.' + ext)):
            mm = re.match(r'^' + re.escape(os.path.join(ROOT, base)) + r'-(\d{3,4})' + wsuf + r'\.' + ext + '$', f)
            if mm:
                variants.append((Image.open(f).size[0], '/' + os.path.relpath(f, ROOT)))
    if not variants:
        variants = [(Image.open(full).size[0], '/' + rel)]
    variants.sort()
    pick = min(variants, key=lambda v: abs(v[0] - 800))[1]
    w, h = Image.open(os.path.join(ROOT, pick.lstrip('/'))).size
    srcset = ', '.join(f'{u.replace(" ", "%20")} {vw}w' for vw, u in variants) if len(variants) > 1 else ''
    return pick.replace(' ', '%20'), srcset, w, h


def brief_image(src, slug):
    """Resize a raw photo from content-engine/briefs/assets/ into /insights-images/<slug>/."""
    full = os.path.join(ROOT, src.lstrip('/'))
    if not os.path.isfile(full):
        sys.exit(f'photo not found: {src}')
    stem = re.sub(r'[^a-z0-9]+', '-', os.path.splitext(os.path.basename(full))[0].lower()).strip('-')
    outdir = os.path.join(ROOT, 'insights-images', slug)
    os.makedirs(outdir, exist_ok=True)
    im = ImageOps.exif_transpose(Image.open(full)).convert('RGB')
    made = []
    for target in (800, 1600):
        if im.width < target and target != 800:
            continue
        w = min(target, im.width)
        out = os.path.join(outdir, f'{stem}-{w}.webp')
        if not os.path.exists(out):
            im.resize((w, round(im.height * w / im.width)), Image.LANCZOS).save(out, 'WEBP', quality=82, method=6)
        made.append(out)
    return site_image('/' + os.path.relpath(made[0], ROOT))


def image(src, slug):
    return brief_image(src, slug) if 'content-engine/briefs/assets/' in src else site_image(src)


def img_tag(src, alt, slug, eager=False, sizes='(max-width: 820px) 100vw, 720px'):
    s, srcset, w, h = image(src, slug)
    attrs = f'src="{s}"'
    if srcset:
        attrs += f' srcset="{srcset}" sizes="{sizes}"'
    load = 'loading="eager" fetchpriority="high"' if eager else 'loading="lazy"'
    return f'<img {attrs} width="{w}" height="{h}" alt="{esc(alt)}" {load} decoding="async">', (w, h), s


# ── markdown subset ──────────────────────────────────────────────────────
def inline(t):
    t = esc(t)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'\[([^\]]+)\]\(([^)\s]+)\)', lambda m: f'<a href="{m.group(2)}">{m.group(1)}</a>', t)
    return t


def md_to_html(md, slug):
    out, figures = [], []
    for block in re.split(r'\n\s*\n', md.strip()):
        b = block.strip()
        fig = re.fullmatch(r'!\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]+)")?\)', b)
        if fig:
            cap, src, alt = fig.group(1), fig.group(2), fig.group(3)
            alt = alt or (cap[0].upper() + cap[1:])
            tag, (w, h), s = img_tag(src, alt, slug)
            figures.append(s)
            cls = ' class="tall"' if h > w * 1.1 else ''
            out.append(f'<figure{cls}>{tag}<figcaption>{esc(cap)}</figcaption></figure>')
        elif b.startswith('### '):
            out.append(f'<h3>{inline(b[4:])}</h3>')
        elif b.startswith('## '):
            out.append(f'<h2>{inline(b[3:])}</h2>')
        elif all(l.startswith('- ') for l in b.splitlines()):
            out.append('<ul>\n' + '\n'.join(f'<li>{inline(l[2:])}</li>' for l in b.splitlines()) + '\n</ul>')
        elif all(re.match(r'\d+\. ', l) for l in b.splitlines()):
            items = [re.sub(r'^\d+\. ', '', l) for l in b.splitlines()]
            out.append('<ol>\n' + '\n'.join(f'<li>{inline(i)}</li>' for i in items) + '\n</ol>')
        elif b.startswith('> '):
            out.append('<blockquote><p>' + inline(' '.join(l[2:] for l in b.splitlines())) + '</p></blockquote>')
        else:
            out.append(f'<p>{inline(" ".join(b.splitlines()))}</p>')
    return '\n\n'.join(out), figures


def word_count(md):
    text = re.sub(r'!\[[^\]]*\]\([^)]*\)', ' ', md)
    text = re.sub(r'\[([^\]]+)\]\([^)]*\)', r'\1', text)
    return len(re.findall(r"[a-z0-9’'-]+", text.lower()))


# ── page ─────────────────────────────────────────────────────────────────
def build_page(p):
    slug = p['slug']
    body, figures = md_to_html(p['body_md'], slug)
    url = f'{ORIGIN}/insights/{slug}'
    hero_tag, _, hero_src = img_tag(p['hero'], p['hero_alt'], slug, eager=True, sizes='100vw')
    _, srcset, _, _ = image(p['hero'], slug)
    hero_big = (srcset.split(', ')[-1].rsplit(' ', 1)[0] if srcset else hero_src)
    mins = max(3, round(word_count(p['body_md']) / 200))
    y, mo, _ = p['date'].split('-')
    date_txt = f'{MONTHS[int(mo) - 1]} {y}'
    ld = {
        '@context': 'https://schema.org', '@type': 'BlogPosting',
        'headline': p['title'], 'description': p['description'],
        'image': [ORIGIN + hero_big] + [ORIGIN + f for f in figures],
        'datePublished': p['date'], 'dateModified': str(p.get('updated', p['date'])),
        'url': url, 'mainEntityOfPage': url, 'inLanguage': 'en-IN',
        'keywords': p.get('target_keyword', ''),
        'author': {'@type': 'Organization', 'name': 'indéva studio', 'url': ORIGIN + '/'},
        'publisher': {'@type': 'Organization', 'name': 'indéva studio', 'url': ORIGIN + '/',
                      'logo': {'@type': 'ImageObject', 'url': ORIGIN + '/android-chrome-512x512.png'}},
        'about': {'@type': 'CreativeWork', 'url': ORIGIN + p['project']},
    }
    crumbs = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': 1, 'name': 'home', 'item': ORIGIN + '/'},
        {'@type': 'ListItem', 'position': 2, 'name': 'insights', 'item': ORIGIN + '/insights'},
        {'@type': 'ListItem', 'position': 3, 'name': p['title'], 'item': url}]}
    css = open(os.path.join(ENGINE, 'article.css'), encoding='utf-8').read()
    head_extra = open(os.path.join(ENGINE, 'head-extra.html'), encoding='utf-8').read()
    cat = esc(p['category'])
    page = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(p['seo_title'])}</title>
<meta name="description" content="{esc(p['description'])}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{url}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="indéva studio">
<meta property="og:url" content="{url}">
<meta property="og:title" content="{esc(p['title'])} — indéva studio">
<meta property="og:description" content="{esc(p['description'])}">
<meta property="og:image" content="{ORIGIN}{hero_big}">
<meta property="og:locale" content="en_IN">
<meta property="article:published_time" content="{p['date']}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{esc(p['title'])} — indéva studio">
<meta name="twitter:description" content="{esc(p['description'])}">
<meta name="twitter:image" content="{ORIGIN}{hero_big}">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="alternate" type="application/rss+xml" title="indéva studio insights" href="/feed.xml">
<script type="application/ld+json">
{json.dumps(ld, ensure_ascii=False, indent=2)}
</script>
<script type="application/ld+json">
{json.dumps(crumbs, ensure_ascii=False, indent=2)}
</script>
{head_extra.strip()}
<style>
{css.strip()}
</style>
</head>
<body>
<nav>
  <a class="nav-logo" href="/">indéva studio</a>
  <div class="nav-center">
    <a class="nav-link" href="/">home</a>
    <a class="nav-link" href="/about">about</a>
    <a class="nav-link" href="/services">services</a>
    <a class="nav-link" href="/projects">projects</a>
    <a class="nav-link active" href="/insights">insights</a>
  </div>
  <a class="nav-cta" href="/contact">start a project</a>
</nav>
<div class="article-nav">
  <a href="/insights">← back to insights</a>
  <span>{cat} · {mins} min read</span>
</div>
<header class="article-header">
  <span class="article-cat">{cat}</span>
  <h1 class="article-title">{esc(p['title'])}</h1>
  <div class="article-meta">
    <span>{date_txt}</span>
    <span>·</span>
    <span>{mins} min read</span>
    <span>·</span>
    <span>indéva studio</span>
  </div>
</header>
<figure class="article-image">
  {hero_tag}
  <figcaption>{esc(p.get('hero_caption') or p['hero_alt'].lower())}</figcaption>
</figure>
<main class="article-body">
{body}
<div class="project-link"><span>the project</span><a href="{p['project']}">see every image and the project facts ↗</a></div>
</main>
<div class="article-cta">
  <span class="article-cta-label">indéva studio · new delhi</span>
  <h2>planning something similar?</h2>
  <p>tell us about your site, timeline and budget, and we will tell you honestly how we would approach it.</p>
  <a href="/contact">start a project ↗</a>
</div>
<footer>
  <a class="footer-logo" href="/">indéva studio</a>
  <span class="footer-note">interior design, construction &amp; custom furniture · 34/11, lampur rd, narela, delhi 110040</span>
  <span class="footer-note">© {y} indéva studio · <a href="/privacy" style="color:inherit">privacy policy</a></span>
</footer>
</body>
</html>
"""
    os.makedirs(os.path.join(ROOT, 'insights', slug), exist_ok=True)
    open(os.path.join(ROOT, 'insights', slug, 'index.html'), 'w', encoding='utf-8').write(page)
    return hero_src


# ── wiring into the site ─────────────────────────────────────────────────
def card(p, hero_src, extra_class=''):
    _, _, w, h = image(p['hero'], p['slug'])
    return (f'<a class="blog-card{extra_class}" href="/insights/{p["slug"]}">\n'
            f'      <img src="{hero_src}" alt="{esc(p["hero_alt"])}" class="blog-card-image" width="{w}" height="{h}" loading="lazy" decoding="async">\n'
            f'      <div class="blog-card-cat">{esc(p["category"])}</div>\n'
            f'      <h2 class="blog-card-title">{esc(p["title"])}</h2>\n'
            f'      <p class="blog-card-excerpt">{esc(p["description"])}</p>\n'
            f'      <div class="blog-card-read">read article ↗</div>\n'
            f'    </a>')


def wire_listing(p, hero_src):
    f = os.path.join(ROOT, 'insights', 'index.html')
    s = open(f, encoding='utf-8').read()
    s = re.sub(r'<a class="blog-card" href="/insights/' + re.escape(p['slug']) + r'">[\s\S]*?</a>\s*', '', s, count=1)
    anchor = '<div class="blog-grid">\n'
    if anchor not in s:
        sys.exit('insights/index.html: could not find <div class="blog-grid">')
    s = s.replace(anchor, anchor + '\n' + card(p, hero_src) + '\n\n    ', 1)
    open(f, 'w', encoding='utf-8').write(s)


def wire_project(p):
    pf = os.path.join(ROOT, 'project-' + p['project'].rstrip('/').split('/')[-1] + '.html')
    if not os.path.isfile(pf):
        print(f'  note: no project page file for {p["project"]} — skipped the back-link')
        return
    s = open(pf, encoding='utf-8').read()
    href = f'/insights/{p["slug"]}'
    if f'href="{href}"' in s:
        return
    title = esc(p['title'][0].upper() + p['title'][1:])
    li = f'<li><a href="{href}">{title}</a></li>'
    head = '<section class="related"><h2>Further reading</h2><ul>'
    if head in s:
        s = s.replace(head, head + li, 1)
    elif '<section class="cta">' in s:
        s = s.replace('<section class="cta">', head + li + '</ul></section>\n<section class="cta">', 1)
    else:
        print(f'  note: {os.path.basename(pf)} has no related/cta section — skipped the back-link')
        return
    open(pf, 'w', encoding='utf-8').write(s)


def wire_homepage(posts):
    f = os.path.join(ROOT, 'site-app.html')
    s = open(f, encoding='utf-8').read()
    if HOME_START not in s:
        print('  note: homepage markers missing — skipped the homepage block')
        return
    newest = sorted(posts, key=lambda p: p['date'], reverse=True)[:3]
    cards = []
    for i, p in enumerate(newest):
        s_, _, w, h = image(p['hero'], p['slug'])
        d = ['', ' d1', ' d2'][i]
        cards.append(
            f'      <a class="blog-card reveal{d}" href="/insights/{p["slug"]}" style="display:block;color:inherit;text-decoration:none;">\n'
            f'        <img src="{s_}" alt="{esc(p["hero_alt"])}" class="blog-card-image" width="{w}" height="{h}" decoding="async" loading="lazy">\n'
            f'        <div class="blog-card-cat">{esc(p["category"])}</div>\n'
            f'        <h2 class="blog-card-title">{esc(p["title"])}</h2>\n'
            f'        <p class="blog-card-excerpt">{esc(p["description"])}</p>\n'
            f'        <div class="blog-card-read">read article ↗</div>\n'
            f'      </a>')
    block = HOME_START + '\n' + '\n'.join(cards) + '\n      ' + HOME_END
    s = re.sub(re.escape(HOME_START) + r'[\s\S]*?' + re.escape(HOME_END), lambda _: block, s, count=1)
    open(f, 'w', encoding='utf-8').write(s)


def run(cmd):
    r = subprocess.run(cmd, cwd=ROOT, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f'{" ".join(cmd)} failed:\n{r.stdout}\n{r.stderr}')
    last = (r.stdout.strip().splitlines() or [''])[-1]
    print(f'  {" ".join(cmd)}: {last}')


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    slugs = all_slugs() if args == ['--all'] else args
    posts = [load_post(s) for s in all_slugs()]
    for slug in slugs:
        p = next(x for x in posts if x['slug'] == slug)
        hero_src = build_page(p)
        wire_listing(p, hero_src)
        wire_project(p)
        print(f'built /insights/{slug}  ({word_count(p["body_md"])} words)')
    wire_homepage(posts)
    run(['node', 'build-pages.cjs'])
    run(['node', 'build-sitemap.cjs'])
    if os.path.isfile(os.path.join(ROOT, 'scripts', 'feed.js')):
        run(['node', 'scripts/feed.js'])


if __name__ == '__main__':
    main()
