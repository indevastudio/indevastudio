#!/usr/bin/env python3
"""
indéva studio — location page builder.

Builds, from the data in this file:
  locations.html               -> /locations
  locations/narela.html        -> /locations/narela
  locations/vasant-kunj.html   -> /locations/vasant-kunj
  noida.html                   -> /noida

Why this exists: the earlier versions of /locations and /noida loaded
/assets/landing.css and /assets/landing.js, which were never committed, so they
rendered unstyled; /locations/narela and /locations/vasant-kunj were never
committed at all (404). These pages now use the same self-contained template
as the service pages (styles copied from services/residential-interior-design.html),
so they need no extra asset files.

Content rules (keep to them when editing):
  - Every fact comes from a published case study (projects/*.html) or the
    studio details already on the site (address, phone, email, service areas).
  - Do not add prices, ratings, reviews, client names, offices or projects
    that are not published.
  - If an area has no published project, say so.

Run from the repo root:  python3 scripts/build-location-pages.py
Then rebuild the sitemap: node build-sitemap.cjs
"""
import html
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGIN = 'https://www.indevastudio.com'
PHONE = '+91 97178 81083'
PHONE_E164 = '+919717881083'
EMAIL = 'hello@indevastudio.com'
WHATSAPP = 'https://wa.me/919717881083'
ADDRESS = '34/11, Lampur Rd, Industrial Area, Narela, Delhi 110040'
GA_ID = 'G-HR4CCENYLM'

e = html.escape


def css():
    src = open(os.path.join(ROOT, 'services', 'residential-interior-design.html'), encoding='utf-8').read()
    block = src[src.index('<style>'):src.index('</style>') + len('</style>')]
    extra = (
        '.facts-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border-top:1px solid var(--line);border-bottom:1px solid var(--line);margin-bottom:64px}'
        '.facts-row div{padding:18px 18px 18px 0}.facts-row dt{font-size:.68rem;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:var(--gold)}.facts-row dd{font-size:.95rem}'
        '.faq{max-width:820px;border-top:1px solid var(--line)}.faq details{border-bottom:1px solid var(--line);padding:16px 0}'
        '.faq summary{cursor:pointer;font-weight:500;list-style:none}.faq summary::-webkit-details-marker{display:none}'
        '.faq summary:after{content:"+";float:right;color:var(--gold)}.faq details[open] summary:after{content:"\\2013"}.faq details p{margin-top:10px;color:var(--muted);max-width:720px}'
        '.contact-line{font-size:.95rem;margin-top:14px;display:flex;flex-wrap:wrap;gap:6px 18px}.contact-line a{overflow-wrap:anywhere}'
        '.note{font-size:.9rem;color:var(--muted);border-left:2px solid var(--gold);padding-left:14px;max-width:760px;margin:6px 0 18px}'
        '.loc-list{list-style:none;border-top:1px solid var(--line);max-width:980px}.loc-list li{border-bottom:1px solid var(--line)}'
        '.loc-list a{display:grid;grid-template-columns:minmax(180px,260px) 1fr auto;gap:18px;padding:18px 0;text-decoration:none;color:var(--ink);align-items:baseline}'
        '.loc-list a:hover .l-t{color:var(--gold)}.l-t{font-size:1.12rem;font-weight:500}.l-d{font-size:.92rem;color:var(--muted)}.l-p{font-size:.8rem;color:var(--gold);white-space:nowrap}'
        '@media (max-width:700px){.facts-row{grid-template-columns:1fr 1fr}.loc-list a{grid-template-columns:1fr}}'
    )
    return block.replace('</style>', extra + '</style>')


def img_size(path):
    try:
        from PIL import Image
        with Image.open(os.path.join(ROOT, path.lstrip('/'))) as im:
            return im.size
    except Exception:
        return (800, 600)


def srcset(src):
    """Use the larger rendition beside an -800 file when it exists."""
    m = re.match(r'^(/.+)-800\.webp$', src)
    if not m:
        return ''
    stem = m.group(1)
    for w in (1600, 1536, 1384, 1375):
        big = f'{stem}-{w}.webp'
        if os.path.exists(os.path.join(ROOT, big.lstrip('/'))):
            return f' srcset="{src} 800w, {big} {w}w" sizes="(max-width:900px) 100vw, 1100px"'
    return ''


def img(src, alt, eager=False, cls=''):
    w, h = img_size(src)
    load = 'fetchpriority="high" decoding="async"' if eager else 'loading="lazy" decoding="async"'
    c = f' class="{cls}"' if cls else ''
    return f'<img{c} src="{src}"{srcset(src)} width="{w}" height="{h}" {load} alt="{e(alt)}">'


# ── shared project cards (facts taken from each case study page) ──────────────
PROJECTS = {
    'villa-narela': ('Residential · Narela, Delhi', 'Villa Project, Narela',
                     '/villa-narela-dholpur-facade-day-800.webp',
                     'Dholpur stone facade of the 35-year-old family villa in Narela, Delhi',
                     '35-year-old home · facade, structure and interiors · ongoing, 2026'),
    'indeva-studio-office-narela': ('Commercial · Narela, Delhi', 'Indéva Studio Office, Narela',
                                    '/indeva-studio-office-narela-meeting-table-800.webp',
                                    'Stone-top meeting table and olive feature wall in the Indéva Studio office, Narela',
                                    "Single room, 14'6\" wide · office, meeting space and sample library · 2026"),
    'vasant-kunj-dda-residence': ('Residential · Vasant Kunj, New Delhi', 'Vasant Kunj DDA Residence',
                                  '/vasant-kunj-dda-residence-parents-bedroom-full-view-800.webp',
                                  "Parents' bedroom in a Vasant Kunj DDA residence with a mural headboard wall and brass pendants",
                                  "Parents' bedroom · 2 months · 2025 · completed"),
    'dda-apartment-delhi': ('Residential · Delhi', 'DDA Apartment, Delhi',
                            '/dda-apartment-delhi-kitchen-and-breakfast-bar-800.webp',
                            'Sage-glass kitchen opening to a curved fluted-wood breakfast bar in a Delhi DDA apartment',
                            '1,800 sq ft · 3 months · 2024 · completed'),
    'south-delhi-neoclassical-residence': ('Residential · South Delhi', 'South Delhi Neo-Classical Residence',
                                           '/south-delhi-neoclassical-residence-living-room-800.webp',
                                           'Living room of the South Delhi Neo-Classical Residence',
                                           '2 BHK · 1,500 sq ft · 3 months · 2026'),
    'studio-workspace-gurgaon': ('Commercial · Gurgaon', 'Studio Workspace, Gurgaon',
                                 '/studio-workspace-gurgaon-studio-main-floor-800.webp',
                                 'Main studio floor of the Studio Workspace in Gurgaon',
                                 '3,200 sq ft · 3 months · 2023'),
}


def project_cards(slugs):
    out = []
    for s in slugs:
        typ, title, src, alt, meta = PROJECTS[s]
        out.append(f'<a class="card" href="/projects/{s}">{img(src, alt)}'
                   f'<span class="c-type">{e(typ)}</span><h3 style="font-weight:400;font-size:1.3rem;margin:4px 0">{e(title)}</h3>'
                   f'<span class="c-meta">{e(meta)}</span></a>')
    return '<div class="cards" style="margin-bottom:0">' + ''.join(out) + '</div>'


SERVICES = {
    'residential': ('/services/residential-interior-design', 'Residential interior design'),
    'commercial': ('/services/commercial-interior-design', 'Commercial interior design'),
    'hospitality': ('/services/hospitality-interior-design', 'Hospitality interior design'),
    'farmhouse': ('/services/farmhouse-interior-design', 'Farmhouse interior design'),
    'kitchen': ('/services/modular-kitchen-design', 'Modular kitchen design'),
    'execution': ('/services/interior-design-execution', 'Execution and turnkey delivery'),
    'furniture': ('/furniture', 'Custom furniture and joinery'),
}

FOOTER = f'''<footer class="site-footer">
  <div class="f-col"><div class="f-logo">indéva studio</div><p>Interior design, construction and custom furniture — Delhi NCR.</p>
  <p>{e(ADDRESS)}<br><a href="tel:{PHONE_E164}">{PHONE}</a> · <a href="mailto:{EMAIL}">{EMAIL}</a></p></div>
  <div class="f-col"><div class="f-h">Projects</div><a href="/projects/hotel-silk-murthal">Hotel Silk by Resham</a><a href="/projects/south-delhi-neoclassical-residence">South Delhi Neo-Classical Residence</a><a href="/projects/vasant-kunj-dda-residence">Vasant Kunj DDA Residence</a><a href="/projects/mini-farmhouse-delhi">Mini Farmhouse</a><a href="/projects/dda-apartment-delhi">DDA Apartment</a><a href="/projects/studio-workspace-gurgaon">Studio Workspace</a><a href="/projects/indeva-studio-office-narela">Indéva Studio Office</a><a href="/projects/villa-narela">Villa Project, Narela</a><a href="/projects/patel-nagar-retail-store">Patel Nagar Retail Store</a></div>
  <div class="f-col"><div class="f-h">Where we work</div><a href="/delhi">Delhi</a><a href="/south-delhi-interior-designer">South Delhi</a><a href="/gurgaon">Gurgaon</a><a href="/noida">Noida</a><a href="/sonipat">Sonipat</a><a href="/locations/vasant-kunj">Vasant Kunj</a><a href="/locations/narela">Narela</a><a href="/locations">All locations</a></div>
  <div class="f-col"><div class="f-h">Studio</div><a href="/services">Services</a><a href="/about">About</a><a href="/insights">Insights</a><a href="/contact">Contact</a></div>
</footer>'''


def cta(heading, text):
    return (f'<section class="cta"><h2>{e(heading)}</h2><p>{e(text)}</p>'
            f'<a class="cta-btn" href="/contact">Start a project</a>'
            f'<p class="contact-line"><a href="tel:{PHONE_E164}" data-ev="phone_click">Call {PHONE}</a>'
            f'<a href="{WHATSAPP}" data-ev="whatsapp_click" rel="noopener">WhatsApp</a>'
            f'<a href="mailto:{EMAIL}" data-ev="email_click">{EMAIL}</a></p></section>')


def faq_html(faqs):
    return '<div class="faq">' + ''.join(
        f'<details><summary>{e(q)}</summary><p>{e(a)}</p></details>' for q, a in faqs) + '</div>'


def page(p):
    url = ORIGIN + p['path']
    crumbs = [('Home', '/')] + p['crumbs']
    crumb_html = ' <span>/</span> '.join(
        (f'<a href="{href}">{e(name)}</a>' if i < len(crumbs) - 1 else f'<span aria-current="page">{e(name)}</span>')
        for i, (name, href) in enumerate(crumbs))
    graph = [
        {'@type': 'BreadcrumbList', 'itemListElement': [
            {'@type': 'ListItem', 'position': i + 1, 'name': n, 'item': ORIGIN + h}
            for i, (n, h) in enumerate(crumbs)]},
        {'@type': 'WebPage', '@id': url + '#webpage', 'url': url, 'name': p['title'],
         'description': p['description'], 'inLanguage': 'en-IN',
         'isPartOf': {'@type': 'WebSite', '@id': ORIGIN + '/#website', 'url': ORIGIN + '/', 'name': 'indéva studio'},
         'about': {'@id': ORIGIN + '/#business'},
         **({'primaryImageOfPage': {'@type': 'ImageObject', 'url': ORIGIN + p['og_image']}} if p.get('og_image') else {})},
    ]
    if p.get('faqs'):
        graph.append({'@type': 'FAQPage', 'mainEntity': [
            {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in p['faqs']]})
    if p.get('schema_business'):
        graph.insert(0, {
            '@type': 'HomeAndConstructionBusiness', '@id': ORIGIN + '/#business', 'name': 'indéva studio',
            'url': ORIGIN + '/', 'telephone': PHONE_E164, 'email': EMAIL,
            'image': ORIGIN + '/indeva-studio-office-narela-meeting-table-1536.webp',
            'address': {'@type': 'PostalAddress', 'streetAddress': '34/11, Lampur Rd, Industrial Area, Narela',
                        'addressLocality': 'Delhi', 'addressRegion': 'Delhi', 'postalCode': '110040',
                        'addressCountry': 'IN'},
            'areaServed': ['Delhi', 'South Delhi', 'Gurgaon', 'Noida', 'Sonipat', 'Narela'],
            'sameAs': ['https://www.instagram.com/indeva.studio', 'https://www.linkedin.com/company/indevastudio']})
    ld = json.dumps({'@context': 'https://schema.org', '@graph': graph}, ensure_ascii=False, indent=1)
    og_img = (ORIGIN + p['og_image']) if p.get('og_image') else ORIGIN + '/indeva-studio-office-narela-meeting-table-1536.webp'
    preload = ''
    if p.get('hero'):
        preload = f'<link rel="preload" as="image" href="{p["hero"][0]}" fetchpriority="high">\n'
    hero = ''
    if p.get('hero'):
        src, alt, cap = p['hero']
        hero = f'<figure class="hero">{img(src, alt, eager=True)}<figcaption>{e(cap)}</figcaption></figure>'
    return f'''<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{e(p['title'])}</title>
<meta name="description" content="{e(p['description'])}">
<meta name="robots" content="index, follow, max-image-preview:large">
<link rel="canonical" href="{url}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="indéva studio">
<meta property="og:title" content="{e(p['title'])}">
<meta property="og:description" content="{e(p['description'])}">
<meta property="og:url" content="{url}">
<meta property="og:image" content="{og_img}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
{preload}<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
{css()}
<script type="application/ld+json">{ld}</script>
<script async src="https://www.googletagmanager.com/gtag/js?id={GA_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){{dataLayer.push(arguments)}}gtag('js',new Date());gtag('config','{GA_ID}');
document.addEventListener('click',function(ev){{var a=ev.target.closest&&ev.target.closest('a[data-ev]');if(a)gtag('event',a.getAttribute('data-ev'),{{page_path:location.pathname}})}});</script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <a class="logo" href="/">indéva studio</a>
  <nav aria-label="Main">
    <a href="/">Home</a><a href="/about">About</a><a href="/projects">Projects</a><a href="/services">Services</a><a href="/contact">Contact us</a>
  </nav>
  <a class="cta-btn" href="/contact">Start a project</a>
</header>
<main id="main">
<nav class="crumbs" aria-label="Breadcrumb">{crumb_html}</nav>
<header class="p-head">
  <p class="eyebrow">{e(p['eyebrow'])}</p>
  <h1>{e(p['h1'])}</h1>
  <p class="lede">{e(p['lede'])}</p>
</header>
{hero}
{p['body']}
</main>
{FOOTER}
</body>
</html>
'''


def sec(h2, inner):
    return f'<section class="sec"><h2>{e(h2)}</h2>{inner}</section>'


def ps(*paras):
    return ''.join(f'<p>{e(x)}</p>' for x in paras)


def facts_row(items):
    return '<dl class="facts-row">' + ''.join(f'<div><dt>{e(k)}</dt><dd>{e(v)}</dd></div>' for k, v in items) + '</dl>'


def services_list(keys):
    return '<ul class="incl">' + ''.join(
        f'<li><a href="{SERVICES[k][0]}">{e(SERVICES[k][1])}</a></li>' for k in keys) + '</ul>'


def reading(items):
    return ('<section class="related"><h2>Further reading</h2><ul>' +
            ''.join(f'<li><a href="{h}">{e(t)}</a></li>' for h, t in items) + '</ul></section>')


# ── /locations/narela ─────────────────────────────────────────────────────────
NARELA_FAQ = [
    ('Where is Indéva Studio in Narela?',
     f'Our studio is at {ADDRESS}. It is where the design team works and where we meet clients; site work across Delhi NCR is coordinated from here.'),
    ('Do you have projects in Narela itself?',
     'Yes. The Villa Project, Narela — a 35-year-old family home being renewed with a Dholpur stone facade, structural strengthening and complete interiors — is ongoing, and our own studio office in Narela is published as a case study.'),
    ('Do you take on older houses that need structural work?',
     'Yes, where the structure can be kept. On the Narela villa the existing footings and columns were checked and strengthened with a structural consultant before any new loads went on.'),
    ('Can we visit the studio before starting?',
     'Yes — call or message us to fix a time. The studio keeps material samples on display, which helps when choosing finishes.'),
    ('Do you only design, or also build?',
     'Either. We offer design only, or design with site execution by our own team, agreed in writing before work starts.'),
]

narela = {
    'path': '/locations/narela',
    'title': 'Interior Design in Narela, Delhi | Indéva Studio',
    'description': 'Indéva Studio is based in Narela, Delhi. Home renovation, villa facades, structural strengthening, interiors and offices — designed and executed from our Lampur Road studio.',
    'eyebrow': 'Locations · Narela, Delhi',
    'h1': 'Interior design in Narela',
    'lede': 'Our studio is in Narela. Homes, older houses that need renewing, shops and offices nearby are designed, drawn and built by the same team that works here every day.',
    'crumbs': [('Locations', '/locations'), ('Narela', '/locations/narela')],
    'og_image': '/villa-narela-dholpur-facade-day-1536.webp',
    'hero': ('/villa-narela-dholpur-facade-day-800.webp',
             'Dholpur stone facade with arched windows and carved balconies on a 35-year-old villa in Narela, Delhi',
             'Villa Project, Narela — the front of a 35-year-old family home reworked in Dholpur stone.'),
    'schema_business': True,
    'faqs': NARELA_FAQ,
}
narela['body'] = (
    facts_row([('Studio', 'Lampur Rd, Narela'), ('Work', 'Homes, villas, offices, shops'),
               ('Scope', 'Design only, or design and execution'), ('Narela projects', 'Villa renovation · studio office')])
    + sec('Our studio in Narela', ps(
        f'Indéva Studio works out of {ADDRESS}. The design team, drawings and material samples are here, and projects across Delhi NCR are coordinated from this office.',
        'We have one studio — this one. We do not have branch offices elsewhere.'))
    + sec('Work in Narela', ps(
        'Two published projects are in Narela. The Villa Project is a 35-year-old family home being kept and renewed rather than rebuilt: a new Dholpur stone facade, strengthened footings and columns, and complete interiors from the entrance lobby to every bedroom, washroom and the staircase. It is ongoing.',
        "Our own studio office is the other: a single room 14'6\" wide that works as an office, meeting space and sample library, planned after trying four layouts in the same room.")
      + project_cards(['villa-narela', 'indeva-studio-office-narela']))
    + sec('What we take on locally', services_list(['residential', 'execution', 'commercial', 'kitchen', 'furniture'])
          + '<p style="margin-top:18px;max-width:760px">Older houses in and around Narela often need more than new finishes. Where a home is being kept, we check the structure first and bring in a structural consultant when new loads, walls or a staircase change — the facade, structure and interiors are then drawn as one set for site.</p>')
    + sec('Questions about working with us in Narela', faq_html(NARELA_FAQ))
    + reading([('/projects/villa-narela', 'Villa Project, Narela — facade, structure and interiors'),
               ('/projects/indeva-studio-office-narela', 'Indéva Studio Office — planning a one-room office'),
               ('/delhi', 'Interior design in Delhi'), ('/locations', 'All locations we work in')])
    + cta('Planning work in Narela?', 'Tell us about the house or space, and when you want to start. You are welcome to visit the studio.')
)

# ── /locations/vasant-kunj ────────────────────────────────────────────────────
VK_FAQ = [
    ('What have you done in Vasant Kunj?',
     "A parents' bedroom in a DDA residence: the bed wall with a mural and cane detailing, an arched upholstered headboard, a cane-front TV console beside a window seat, an olive fluted TV panel, and layered lighting. Design, custom joinery and site execution took two months (2025)."),
    ('Do you take on single rooms, or only whole homes?',
     'Both. The Vasant Kunj project was a single bedroom. Whole-home work follows the same process — plan first, then drawings, then execution.'),
    ('Can you work on a DDA flat without changing its structure?',
     'Most of what changes a DDA flat — storage, joinery, kitchens, lighting and finishes — does not need structural change. Any civil change is checked first and only done where the society and the building allow it.'),
    ('Do you provide execution in Vasant Kunj, or only design?',
     'Either. The Vasant Kunj bedroom was designed and executed by our team; you can also take design only.'),
    ('How is the cost worked out?',
     'From an itemised BOQ — every item with its material, brand and rate — after the design is agreed, rather than a flat rate per square foot.'),
]

vk = {
    'path': '/locations/vasant-kunj',
    'title': 'Interior Design in Vasant Kunj, DDA Flats & Homes | Indéva Studio',
    'description': "Interior design for DDA flats and homes in Vasant Kunj, New Delhi — space planning, custom joinery, lighting and site execution. See our Vasant Kunj DDA parents' bedroom project.",
    'eyebrow': 'Locations · Vasant Kunj, New Delhi',
    'h1': 'Interior design in Vasant Kunj',
    'lede': 'DDA flats and family homes in Vasant Kunj, planned around storage and light, with joinery drawn before it is built — by one team from design to handover.',
    'crumbs': [('Locations', '/locations'), ('Vasant Kunj', '/locations/vasant-kunj')],
    'og_image': '/vasant-kunj-dda-residence-parents-bedroom-full-view-1384.webp',
    'hero': ('/vasant-kunj-dda-residence-parents-bedroom-full-view-800.webp',
             "Parents' bedroom in a Vasant Kunj DDA residence with a Rajasthani mural, cane headboard and layered warm lighting",
             "Vasant Kunj DDA Residence — the parents' bedroom, designed and built by Indéva Studio in 2025."),
    'faqs': VK_FAQ,
}
vk['body'] = (
    facts_row([('Published project', "Parents' bedroom, DDA residence"), ('Duration', '2 months'),
               ('Year', '2025 · completed'), ('Scope', 'Design, joinery, execution')])
    + sec('Our Vasant Kunj project', ps(
        "Our published Vasant Kunj work is a parents' bedroom in a DDA residence. The brief was comfort without excess: a quiet room resolved almost entirely through joinery and lighting rather than applied decoration.",
        'The room was developed through a design-intent presentation covering the moodboard, zoning, lighting and dimensioned joinery for the bed wall, TV unit, wardrobe and window seat. The palette is walnut fluting, warm beige lacquer and brushed brass.')
      + '<div class="gallery" style="margin-top:28px">'
      + img('/vasant-kunj-dda-residence-mural-headboard-wall-800.webp', 'Rajasthani-inspired mural headboard wall flanked by cane detailing and brass sconces, Vasant Kunj')
      + img('/vasant-kunj-dda-residence-window-seat-and-tv-wall-800.webp', 'Cane-front TV console beside a cushioned window seat, Vasant Kunj DDA residence')
      + img('/vasant-kunj-dda-residence-bed-wall-straight-on-800.webp', 'Arched upholstered headboard framed by brass pendant lights, Vasant Kunj')
      + img('/vasant-kunj-dda-residence-tv-unit-detail-800.webp', 'Olive fluted TV panel with marble inlay and display shelving, Vasant Kunj')
      + '</div><p style="margin-top:18px"><a href="/projects/vasant-kunj-dda-residence">Read the full Vasant Kunj case study →</a></p>')
    + sec('Designing for DDA flats', ps(
        'DDA flats come with fixed footprints, load-bearing walls and services that are expensive to move. The work that makes the biggest difference is usually inside those limits: storage planned wall by wall, joinery that does more than one job, and lighting in layers rather than a single ceiling source.',
        'In a full DDA apartment we resolve storage first, then light, then material. Our Delhi DDA Apartment project (1,800 sq ft, 2024) fitted full storage, a working kitchen and a curved breakfast bar inside the existing footprint.'))
    + sec('Space, storage, kitchens and bedrooms', '<ul class="incl">'
          '<li>Space planning and furniture layouts before any finish is chosen</li>'
          '<li>Wardrobes, TV units and window seats as dimensioned joinery</li>'
          '<li>Bedrooms planned around the bed wall, storage and daylight</li>'
          '<li>Modular kitchens sized for how you cook, with materials chosen for heat and moisture</li>'
          '<li>Layered lighting: cove, panel, pendant and task light</li>'
          '<li>Materials and finishes specified item by item in the BOQ</li></ul>'
          '<p style="margin-top:18px;max-width:760px">The kitchen example on this page is from our Delhi DDA apartment, not Vasant Kunj.</p>'
          + project_cards(['vasant-kunj-dda-residence', 'dda-apartment-delhi', 'south-delhi-neoclassical-residence']))
    + sec('Related services', services_list(['residential', 'kitchen', 'furniture', 'execution']))
    + sec('Questions about Vasant Kunj projects', faq_html(VK_FAQ))
    + reading([('/insights/step-by-step-vasant-kunj-interior', 'Step-by-step guide to home interiors in Vasant Kunj'),
               ('/insights/dda-flat-renovation-cost-guide', 'DDA flat renovation cost guide'),
               ('/south-delhi-interior-designer', 'Interior design in South Delhi'),
               ('/delhi', 'Interior design in Delhi')])
    + cta('Planning a home in Vasant Kunj?', 'Tell us about the flat, the rooms in scope and your timeline, and we will tell you honestly how we would approach it.')
)

# ── /noida (existing URL, same copy as before, new template) ──────────────────
NOIDA_FAQ = [
    ('Does Indéva Studio work in Noida and Greater Noida?',
     'Yes. We take on residential and commercial projects in Noida and Greater Noida, coordinated from our studio in Narela, Delhi.'),
    ('Do you have completed projects in Noida on your website?',
     'Not yet. Our published case studies are from Delhi, Narela, Gurgaon and Murthal. We are happy to talk through relevant work from those projects at the first meeting.'),
    ('Do you provide design and execution in Noida?',
     'Yes — either design only or design with execution, agreed in writing at onboarding.'),
    ('How much does interior design cost in Noida?',
     'It depends on area, scope and finish level. We discuss budget openly before design starts and prepare an itemised BOQ rather than quoting a flat rate.'),
    ('What information do you need for an initial estimate?',
     'Property type, approximate area, rooms or spaces in scope, expected start date and a budget range if you have one. A floor plan helps.'),
]
noida = {
    'path': '/noida',
    'title': 'Interior Design in Noida | Indéva Studio',
    'description': 'Residential and commercial interior design in Noida and Greater Noida by Indéva Studio — planning, drawings, custom furniture and site execution from one team.',
    'eyebrow': 'Locations · Noida & Greater Noida',
    'h1': 'Interior design in Noida',
    'lede': 'Apartments, independent homes and commercial spaces in Noida and Greater Noida — designed, drawn and, where you want it, executed by one team.',
    'crumbs': [('Locations', '/locations'), ('Noida', '/noida')],
    'og_image': '/south-delhi-neoclassical-residence-kitchen-1600.webp',
    'faqs': NOIDA_FAQ,
}
noida['body'] = (
    facts_row([('Work', 'Apartments, homes, offices, retail'), ('Scope', 'Design only, or design with execution'),
               ('Coordinated from', 'Our studio in Narela, Delhi'), ('Drawn first', 'Every joinery piece dimensioned')])
    + sec('How we work in Noida', ps(
        'We take on residential and commercial projects in Noida and Greater Noida, coordinated from our studio in Narela, Delhi.',
        'High-rise apartments are where most Noida projects start: a fixed footprint, builder-standard finishes and a family that wants storage, better kitchens and lighting that works. We plan from the layout first, draw every joinery piece, and price from an itemised BOQ.')
      + '<p class="note">To be clear about our proof: we do not yet have a published Noida case study. The projects below are from Delhi and Gurgaon and show the same team’s apartment, kitchen and office work.</p>')
    + sec('What we can help with', services_list(['residential', 'kitchen', 'commercial', 'execution']))
    + sec('Work by the same team', project_cards(['south-delhi-neoclassical-residence', 'dda-apartment-delhi', 'studio-workspace-gurgaon']))
    + sec('Planning an apartment interior in Noida', '<ol class="steps">'
          '<li><b>Check the society rules first</b><span>If your society has rules on working hours, material movement or deposits, share them early so the site plan accounts for them.</span></li>'
          '<li><b>Decide what stays</b><span>Builder-supplied flooring, kitchens and wardrobes are sometimes worth keeping. We review them with you before designing around or replacing them.</span></li>'
          '<li><b>Fix the budget before finishes</b><span>We agree a budget range at the alignment stage and develop an itemised BOQ, so material choices are made against real numbers.</span></li></ol>'
          '<p style="margin-top:14px">Every project follows the same six stages — enquiry, alignment, onboarding, design, execution and handover. <a href="/process">See how a project runs →</a></p>')
    + sec('Noida — questions, answered', faq_html(NOIDA_FAQ))
    + reading([('/insights/read-interior-design-boq-guide', 'How to read an interior design BOQ'),
               ('/delhi', 'Interior design in Delhi'), ('/gurgaon', 'Interior design in Gurgaon'),
               ('/south-delhi-interior-designer', 'Interior design in South Delhi')])
    + cta('Planning a project in Noida?', 'Tell us about your space, timeline and budget and we will tell you honestly how we would approach it.')
)

# ── /locations hub ────────────────────────────────────────────────────────────
LOCS = [
    ('/delhi', 'Interior design in Delhi', 'Homes, farmhouses and commercial spaces across Delhi.', 'Mini Farmhouse · DDA Apartment · Patel Nagar Retail Store'),
    ('/south-delhi-interior-designer', 'Interior design in South Delhi', 'Apartments, builder floors and family homes.', 'South Delhi Neo-Classical Residence'),
    ('/locations/vasant-kunj', 'Interior design in Vasant Kunj', 'Single rooms and whole homes, including DDA residences.', 'Vasant Kunj DDA Residence'),
    ('/locations/narela', 'Interior design in Narela', 'Where our studio is — homes, older houses, shops and offices.', 'Villa Project · Indéva Studio Office'),
    ('/gurgaon', 'Interior design in Gurgaon', 'Residential and commercial interiors.', 'Studio Workspace, Gurgaon'),
    ('/noida', 'Interior design in Noida', 'Apartments, homes and commercial spaces in Noida and Greater Noida.', 'No published Noida case study yet'),
    ('/sonipat', 'Interior design in Sonipat', 'Homes, farmhouses and hospitality in Sonipat and the Murthal stretch.', 'Hotel Silk by Resham, Murthal'),
]
hub = {
    'path': '/locations',
    'title': 'Where We Work — Interior Design Across Delhi NCR | Indéva Studio',
    'description': 'Indéva Studio designs and executes interiors across Delhi, South Delhi, Vasant Kunj, Narela, Gurgaon, Noida and Sonipat — run from one studio in Narela, Delhi.',
    'eyebrow': 'Locations · Delhi NCR',
    'h1': 'Interior design across Delhi NCR',
    'lede': 'One studio in Narela, and projects across Delhi, Gurgaon, Noida and Sonipat — designed and, where you want it, executed by the same team.',
    'crumbs': [('Locations', '/locations')],
    'og_image': '/villa-narela-dholpur-facade-day-1536.webp',
}
hub['body'] = (
    sec('Choose your area', '<ul class="loc-list">' + ''.join(
        f'<li><a href="{h}"><span class="l-t">{e(t)}</span><span class="l-d">{e(d)}</span><span class="l-p">{e(pj)}</span></a></li>'
        for h, t, d, pj in LOCS) + '</ul>'
        + f'<p class="note" style="margin-top:18px">We have one studio, in Narela, Delhi ({e(ADDRESS)}). We don’t have offices in the other areas listed — projects there are run from Narela.</p>')
    + sec('What we do', services_list(['residential', 'commercial', 'hospitality', 'farmhouse', 'kitchen', 'execution', 'furniture']))
    + sec('Recent work', project_cards(['villa-narela', 'vasant-kunj-dda-residence', 'studio-workspace-gurgaon']))
    + cta('Start a conversation', 'Tell us where the project is, what is in scope and when you want to start.')
)


def write(rel, content):
    full = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, 'w', encoding='utf-8') as fh:
        fh.write(content)
    print('wrote', rel, len(content.encode()), 'bytes')


if __name__ == '__main__':
    write('locations/narela.html', page(narela))
    write('locations/vasant-kunj.html', page(vk))
    write('noida.html', page(noida))
    write('locations.html', page(hub))
