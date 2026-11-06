"""Site-wide metadata pass for hand-written pages listed in sitemap.xml.
Idempotent. Run after build-sitemap.cjs:  python3 tools/seo-meta.py
 - adds twitter:card/title/description/image (from the page's own og/meta tags) where missing
 - adds BreadcrumbList JSON-LD where missing (Home > section > page)
 - brings meta/og/twitter descriptions into 70-160 characters
Generated pages (build-pages.cjs) are skipped: they get the same treatment there."""
import re, json, html, os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
O = 'https://www.indevastudio.com'
GENERATED = {'index.html','about.html','services.html','process.html','philosophy.html','contact.html','furniture.html','vendors.html'}
SECTIONS = {'services':'Services','insights':'Insights','projects':'Projects','locations':'Locations'}
rw = {r['source'].rstrip('/'): r['destination'].lstrip('/') for r in json.load(open(os.path.join(ROOT,'vercel.json'))).get('rewrites',[])}
def fileof(l):
    if l == '/': return 'index.html'
    if l in rw: d = rw[l]; return d if d.endswith('.html') else d + '.html'
    if l == '/insights': return 'insights/index.html'
    if l.startswith('/insights/'): return 'insights' + l[9:] + '/index.html'
    return l[1:] + '.html'
def meta(s, attr, key):
    m = re.search(r'<meta\s+%s="%s"\s+content="([^"]*)"' % (attr, re.escape(key)), s)
    return m.group(1) if m else None
def text(x): return re.sub(r'\s+', ' ', html.unescape(re.sub(r'<[^>]+>', ' ', x))).strip()
def fit(d, body):
    d = d.strip()
    if len(d) < 70:
        # lead with the existing line, then the article's opening paragraph
        for p in re.findall(r'<p\b[^>]*>(.*?)</p>', body, re.S):
            t = text(p)
            if len(t) > 80 and not t.lower().startswith(('by ', 'published', 'updated')):
                d = (d.rstrip('.!?') + '. ' if d else '') + t
                break
    if len(d) <= 160: return d
    cut = d[:160]
    ends = [m.end() for m in re.finditer(r'[.!?](\s|$)', cut)]
    if ends and ends[-1] >= 90: return cut[:ends[-1]].strip()
    return None
# hand-written descriptions for core pages (70-160 chars, full sentences)
DESC = {
 '/services/commercial-interior-design': 'Commercial interior design for offices, studios and retail stores in Delhi NCR: space planning, interiors, joinery and site execution by one team.',
 '/services/farmhouse-interior-design': 'Farmhouse and villa design in Delhi, Gurgaon and Sonipat: planning, architecture, interiors and construction, delivered by one team to handover.',
 '/services/hospitality-interior-design': 'Hotel and restaurant interior design in Delhi NCR and Haryana, planned for hard daily use and low running costs, and built by our own site team.',
 '/services/modular-kitchen-design': 'Kitchens and wardrobes in Delhi NCR, with HDHMR or BWP ply carcasses, laminate, acrylic or PU finishes and every brand named in an itemised BOQ.',
 '/services/residential-interior-design': 'Residential interior design for apartments, DDA flats, builder floors and family homes in Delhi NCR, from layout and drawings to site handover.',
 '/delhi': 'Architecture-led interior design in Delhi for homes, farmhouses and commercial spaces, with drawings, itemised BOQs and site execution by one team.',
 '/south-delhi-interior-designer': 'Interior design and execution across South Delhi: Vasant Kunj, Defence Colony, Greater Kailash, Hauz Khas, Chhatarpur and neighbouring areas.',
 '/gurgaon': 'Architecture-led interior design in Gurgaon for apartments, penthouses, farmhouses and offices, from planning and drawings to site handover.',
 '/sonipat': 'Architecture-led interior design in Sonipat for homes, farmhouses and commercial spaces, with design, drawings and site execution by one team.',
 '/locations': 'Indéva Studio designs and builds interiors across Delhi, South Delhi, Vasant Kunj, Narela, Gurgaon, Noida and Sonipat. Find your area here.',
 '/locations/narela': 'Interior design, renovation and site execution in Narela, Delhi, from our studio on Lampur Road: villas, DDA flats, shops and offices.',
 '/locations/vasant-kunj': 'Interior design for DDA flats and homes in Vasant Kunj, New Delhi: single rooms or whole homes, with drawn joinery and site execution.',
 '/projects': 'Selected work by Indéva Studio: completed homes, farmhouses and a 23-room hotel, plus projects on site and in design development across Delhi NCR.',
 '/projects/south-delhi-neoclassical-residence': 'A 1,500 sq ft South Delhi 2 BHK in a neo-classical style, with panelled walls and built-in wardrobes. Designed and delivered turnkey in three months.',
 '/projects/indeva-studio-office-narela': 'Design development for our own studio office in Narela: one room planned for work, client meetings and a material display. Shown with design renders.',
 '/projects/villa-narela': 'The Dholpur Stone Villa: a 35-year-old load-bearing house in Narela being replanned around family life, Vastu and its walls. In progress.',
 '/projects/casa-bianca-farmhouse-gurgaon': 'Casa Bianca: a 10,000 sq ft neoclassical farmhouse near Sohna with around ten bedrooms and an eight-shaped pool, designed and built by Indéva Studio.',
 '/projects/bansal-residence-narela': 'Bansal Residence, Narela: a ground-floor home being replanned around Vastu, a ground-floor bedroom and minimal structural change. In design development.',
 '/insights/the-honest-material-stone-over-stone-effect': 'Imitation materials age poorly, feel hollow underfoot and eventually betray themselves. Why we choose real stone over stone-effect finishes.',
 '/projects/vasant-kunj-dda-residence': "A parents' bedroom in a Vasant Kunj DDA flat, resolved through drawn joinery and layered light: arched headboard wall, cane TV console and window seat.",
}
changed = []
locs = re.findall(r'<loc>%s([^<]*)</loc>' % re.escape(O), open(os.path.join(ROOT,'sitemap.xml')).read())
for l in locs:
    f = fileof(l)
    if f in GENERATED: continue
    fp = os.path.join(ROOT, f); s = open(fp, encoding='utf-8').read(); o = s
    title = text(re.search(r'<title>(.*?)</title>', s, re.S).group(1))
    desc = html.unescape(meta(s, 'name', 'description') or '')
    nd = DESC.get(l) or fit(desc, s[s.find('<body'):]) or desc
    if nd != desc:
        e = html.escape(nd, quote=True)
        for a, k in (('name','description'),('property','og:description'),('name','twitter:description')):
            s = re.sub(r'(<meta\s+%s="%s"\s+content=")[^"]*' % (a, re.escape(k)), lambda m: m.group(1) + e, s)
        changed.append((l, len(nd), nd))
    ogt = meta(s, 'property', 'og:title'); ogt = html.unescape(ogt) if ogt else title
    want = {'twitter:card': 'summary_large_image', 'twitter:title': html.escape(ogt, quote=True),
            'twitter:description': html.escape(nd, quote=True),
            'twitter:image': meta(s, 'property', 'og:image') or O + '/og-default.jpg'}
    tags = ''.join(f'<meta name="{k}" content="{v}">\n' for k, v in want.items() if meta(s, 'name', k) is None)
    if tags: s = s.replace('</head>', tags + '</head>', 1)
    if 'BreadcrumbList' not in s:
        parts = [p for p in l.split('/') if p]
        items = [{'@type':'ListItem','position':1,'name':'Home','item':O+'/'}]
        if len(parts) > 1 and parts[0] in SECTIONS:
            items.append({'@type':'ListItem','position':2,'name':SECTIONS[parts[0]],'item':O+'/'+parts[0]})
        h1 = re.search(r'<h1\b[^>]*>(.*?)</h1>', s, re.S)
        name = text(h1.group(1)) if h1 else re.split(r'\s+[|—–]\s+', title)[0]
        if l != '/': items.append({'@type':'ListItem','position':len(items)+1,'name':name[:110],'item':O+l})
        s = s.replace('</head>', '<script type="application/ld+json" id="crumbs-ld">' + json.dumps({'@context':'https://schema.org','@type':'BreadcrumbList','itemListElement':items}, ensure_ascii=False) + '</script>\n</head>', 1)
    if s != o: open(fp, 'w', encoding='utf-8').write(s)
if '-v' in sys.argv:
    for c in changed: print(c)
print(f'seo-meta: {len(changed)} descriptions adjusted')
