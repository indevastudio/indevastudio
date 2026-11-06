"""Adds Deliverables + FAQ (with FAQPage schema) to every service page, keeps the
'Other services' nav in sync, and creates the two newer service pages from the
residential template. Safe to re-run: sections are wrapped in svc:auto markers."""
import re, json, html, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SV = os.path.join(ROOT, 'services')
O = 'https://www.indevastudio.com'

SERVICES = [
 ('architecture-spatial-planning', 'Architecture and spatial planning'),
 ('residential-interior-design', 'Residential interior design'),
 ('farmhouse-interior-design', 'Farmhouse and villa design'),
 ('commercial-interior-design', 'Commercial interior design'),
 ('hospitality-interior-design', 'Hospitality design'),
 ('interior-design-execution', 'Construction and execution'),
 ('furniture-joinery', 'Furniture and joinery'),
 ('modular-kitchen-design', 'Kitchen and wardrobe manufacturing'),
]
TITLES = {
 'farmhouse-interior-design': ('Farmhouse & Villa Design in Delhi NCR | Indéva Studio', 'Farmhouse and villa design'),
 'interior-design-execution': ('Construction & Execution, Delhi NCR | Indéva Studio', 'Construction and execution'),
 'modular-kitchen-design': ('Kitchens & Wardrobes, Delhi NCR | Indéva Studio', 'Kitchen and wardrobe manufacturing'),
 'hospitality-interior-design': ('Hotel & Restaurant Interior Design | Indéva Studio', 'Hospitality design'),
}

D = {
 'residential-interior-design': dict(
   dlv=['Measured drawings of your home as it is', 'Furniture layout and zoning plan', '3D views of the main rooms', 'Electrical, ceiling and lighting layouts', 'Joinery drawings for kitchen, wardrobes and units', 'Itemised BOQ with material, brand and rate', 'Site execution and handover'],
   faq=[('How long does a home interior take?', 'Our recent apartment projects have run about three months from start of design to handover, for example the 1,500 sq ft South Delhi Neo-Classical Residence and the 1,800 sq ft DDA Apartment.'),
        ('Do you work on DDA flats and builder floors?', 'Yes. The DDA Apartment in Delhi and the parents’ bedroom at our Vasant Kunj DDA Residence are both completed projects on our portfolio.'),
        ('How do you price a project?', 'With an itemised bill of quantities: every item with its material, brand and rate, so you can see what you are paying for and compare it line by line before work starts.')]),
 'farmhouse-interior-design': dict(
   dlv=['Site study and Vastu-oriented layout, if required', 'Elevations and facade design', 'Interior design for every room', 'Waterproofing, drainage and services planning', 'Working drawings and itemised BOQ', 'Site execution, from structure to handover'],
   faq=[('Do you build farmhouses, or only design them?', 'Both. On Casa Bianca, a 10,000 sq ft farmhouse near Sohna, our scope ran from architecture and planning through structure, waterproofing, the pool, interiors, the kitchen and services.'),
        ('Can you work on a remote site?', 'Yes. Casa Bianca was built through temperatures of up to 45°C, with frequent power cuts, scarce local supplies and high, saline groundwater.'),
        ('Do you take on smaller farmhouses?', 'Yes. Our Mini Farmhouse in Delhi is 4,800 sq ft and was completed in five months.'),
        ('Do you renovate older villas?', 'Yes. The Dholpur Stone Villa in Narela is a 35-year-old load-bearing house we are replanning and renovating now, with a structural engineer checking every change.')]),
 'commercial-interior-design': dict(
   dlv=['Space plan and workstation or display layout', 'Lighting, ceiling and services layouts', '3D views of key areas', 'Joinery and fixture drawings', 'Itemised BOQ', 'Site execution and handover'],
   faq=[('What commercial projects have you done?', 'Completed: the 3,200 sq ft Studio Workspace office in Gurgaon. In progress: a two-floor menswear store in Patel Nagar.'),
        ('How long does an office fit-out take?', 'The 3,200 sq ft Studio Workspace took three months.'),
        ('Can you work around a business that stays open?', 'Tell us about your site and hours when you enquire; sequencing and site timing are agreed in the plan before work starts.')]),
 'hospitality-interior-design': dict(
   dlv=['Room-type planning and guest flow', 'Material and finish strategy for hard daily use', 'Lighting and services coordination', 'Working drawings and itemised BOQ', 'Construction and site execution'],
   faq=[('Have you delivered a hotel?', 'Yes. Hotel Silk by Resham in Murthal: 23 guest rooms, designed and built in 12 months and handed over on 30 August 2026.'),
        ('How do you design for low running costs?', 'On Hotel Silk we used centralised VRV air-conditioning instead of split units, double-glazed windows against highway noise, soft ambient lighting and fittings chosen so nothing needs constant repair.'),
        ('Do you do restaurants and cafés?', 'We design hospitality spaces of all kinds. Tell us about the site and we will tell you honestly how we would approach it.')]),
 'interior-design-execution': dict(
   dlv=['Itemised BOQ agreed before work starts', 'Site supervision by our own team', 'Vendor and trade coordination', 'Stage checks against the drawings', 'Project ledger with a client statement you approve line by line', 'Snag list, corrections and handover'],
   faq=[('Who is on site day to day?', 'Our own site team supervises the work and checks each stage against the drawings before the next one starts.'),
        ('How will I know where my money went?', 'Every payment is logged against your project. You get your own statement page, can approve each billing line and download it any time.'),
        ('What makes projects run late?', 'Mostly decisions changed after walls are closed. That is why we fix the plan, drawings and BOQ before site work begins.')]),
 'modular-kitchen-design': dict(
   dlv=['Kitchen and wardrobe layouts', 'Board, finish and hardware schedule, item by item', 'Dimensioned working drawings', 'Finish samples to approve before production', 'Installation on site'],
   faq=[('Which board do you use?', 'HDHMR for most dry carcasses and shutters, BWP plywood (IS:710) wherever water sits, such as under the sink, and MDF for painted panels and mouldings, kept away from water.'),
        ('Is the finish the same decision as the board?', 'No. Laminate, acrylic or PU is chosen separately from the board underneath, and it drives most of the price difference.'),
        ('Will my quote name the brands?', 'Yes. Our BOQ names the board, finish and hardware brand for every unit, so you can compare quotes like for like.')]),
 'architecture-spatial-planning': dict(
   title='Architecture & Spatial Planning, Delhi NCR | Indéva Studio',
   desc='Site studies, layouts, Vastu-led planning and working drawings for new homes, farmhouses and renovations in Delhi NCR, planned with construction in mind.',
   h1='Architecture and spatial planning',
   lede='Site studies, layouts and working drawings for new houses, farmhouses and renovations, drawn with construction in mind from the first line.',
   intro=['Most problems on a building site start on the plan. So we settle zoning, circulation, light, structure and services first, and Vastu where the family wants it, before any finish is chosen.', 'On renovations we work with what the existing structure allows. Our architect and structural engineer review every change before it reaches site.'],
   incl=['Site survey and measured drawings', 'Existing-condition study for renovations', 'Zoning and layout options', 'Vastu-oriented planning, on request', 'Elevations and facade design', 'Structural coordination with our engineer', 'Electrical, plumbing and AC point planning', 'Working drawings for site'],
   dlv=['Measured drawings of the site or existing house', 'Layout options and an approved plan', 'Elevations and sections', 'Electrical, plumbing and ceiling layouts', 'Working drawings for each trade', 'Itemised BOQ'],
   related=[('villa-narela', 'villa-narela-dholpur-facade-day-800.webp', 'The Dholpur Stone Villa', 'Renovation · Narela · In Progress'), ('casa-bianca-farmhouse-gurgaon', 'casa-bianca-farmhouse-gurgaon-facade-800.webp', 'Casa Bianca', 'Farmhouse · Sohna · Completed'), ('bansal-residence-narela', None, 'Bansal Residence', 'Residential · Narela · Design Development')],
   faq=[('Do you plan around Vastu?', 'Yes, when the family wants it. On the Bansal Residence the brief fixed the mandir in the north-east and the kitchen in the south-east, and the layout is being built around those.'),
        ('Can you replan an old house without rebuilding it?', 'Often, yes. The Dholpur Stone Villa is a 35-year-old house with load-bearing walls and no columns or beams. Every change is checked with a structural engineer, and fitting family, Vastu and structure together took 15 to 20 layout iterations.'),
        ('What do I get before construction starts?', 'An approved layout, working drawings for each trade and an itemised BOQ, so scope and cost are fixed on paper first.')]),
 'furniture-joinery': dict(
   title='Furniture & Joinery, Delhi NCR | Indéva Studio',
   desc='Custom wardrobes, panelling, TV units, beds and loose furniture in Delhi NCR, drawn to the exact wall they sit against and built to those drawings.',
   h1='Furniture and joinery',
   lede='Wardrobes, panelling, TV units, beds and loose furniture, drawn to the exact wall they stand against and built to those drawings.',
   intro=['Showroom furniture is sized for showrooms. Ours is sized for your room: the exact wall length, the ceiling height and the way the window light falls.', 'Every joinery piece is drawn and dimensioned before it is made, with its board, finish and hardware named, so what arrives on site is what you approved.'],
   incl=['Built-in wardrobes and storage', 'Wall panelling and fluted surfaces', 'TV and media units', 'Beds, headboards and window seats', 'Loose furniture: sofas, dining, consoles', 'Finishes: laminate, PU, veneer, cane and upholstery'],
   dlv=['Joinery working drawings with dimensions', 'Board, finish and hardware schedule', 'Finish samples to approve', 'Manufacture to the approved drawings', 'Installation on site'],
   related=[('vasant-kunj-dda-residence', 'vasant-kunj-dda-residence-parents-bedroom-full-view-800.webp', 'Vasant Kunj DDA Residence', 'Joinery · Completed'), ('south-delhi-neoclassical-residence', 'south-delhi-neoclassical-residence-wardrobe-interior-800.webp', 'South Delhi Neo-Classical Residence', 'Wardrobes · Completed'), ('dda-apartment-delhi', 'dda-apartment-delhi-kitchen-cabinetry-800.webp', 'DDA Apartment', 'Kitchen · Completed')],
   faq=[('Can I order just one piece?', 'Yes. You can browse the furniture catalogue and enquire about a single piece, sized for your room.'),
        ('Do I see drawings before anything is made?', 'Yes. On the Vasant Kunj bedroom every joinery piece was drawn and dimensioned before site work began, which is how one room was finished in two months.'),
        ('Which materials do you use?', 'HDHMR for dry carcasses and shutters, BWP plywood where water sits, MDF for painted panels, and laminate, PU, veneer or cane for the finish, chosen piece by piece.')]),
}

def esc(s): return html.escape(s, quote=True)

def auto_block(slug, d):
    dl = ''.join(f'<li>{esc(x)}</li>' for x in d['dlv'])
    fq = ''.join(f'<details><summary>{esc(q)}</summary><p>{esc(a)}</p></details>' for q, a in d['faq'])
    return (f'<!--svc:auto-->\n<section class="sec"><h2>Deliverables</h2><ul class="incl">{dl}</ul></section>\n'
            f'<section class="sec faq"><h2>Frequently asked questions</h2>{fq}</section>\n<!--/svc:auto-->\n')

def faq_ld(d):
    return {"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in d['faq']]}

FAQ_CSS = '.faq details{border-bottom:1px solid var(--line);padding:14px 0;max-width:820px}.faq details:first-of-type{border-top:1px solid var(--line)}.faq summary{cursor:pointer;font-weight:500;list-style:none;position:relative;padding-right:28px}.faq summary::-webkit-details-marker{display:none}.faq summary:after{content:"+";position:absolute;right:0;top:0;color:var(--gold);font-size:1.2rem;line-height:1.3}.faq details[open] summary:after{content:"−"}.faq details p{margin-top:8px;color:var(--muted);font-size:.95rem}\n'

def other_nav(slug):
    links = ''.join(f'<a href="/services/{s}">{esc(n)}</a>' for s, n in SERVICES if s != slug)
    return f'<nav class="sv-other" aria-label="Other services">{links}<a href="/furniture">Furniture catalogue</a></nav>'

def finish(s, slug, d):
    s = re.sub(r'<!--svc:auto-->.*?<!--/svc:auto-->\n', '', s, flags=re.S)
    s = s.replace('<section class="sec"><h2>Related projects</h2>', auto_block(slug, d) + '<section class="sec"><h2>Related projects</h2>', 1)
    s = re.sub(r'<nav class="sv-other" aria-label="Other services">.*?</nav>', other_nav(slug), s, flags=re.S)
    s = re.sub(r'<script type="application/ld\+json" id="faq-ld">.*?</script>\n?', '', s, flags=re.S)
    s = s.replace('</head>', '<script type="application/ld+json" id="faq-ld">' + json.dumps(faq_ld(d), ensure_ascii=False) + '</script>\n</head>', 1)
    if '.faq details' not in s:
        s = s.replace('.sv-other{', FAQ_CSS + '.sv-other{', 1)
    return s

def retitle(s, slug):
    if slug not in TITLES: return s
    t, h = TITLES[slug]
    s = re.sub(r'<title>[^<]*</title>', f'<title>{esc(t)}</title>', s)
    s = re.sub(r'(<meta property="og:title" content=")[^"]*', lambda m: m.group(1) + esc(t), s)
    s = re.sub(r'(<meta name="twitter:title" content=")[^"]*', lambda m: m.group(1) + esc(t), s)
    s = re.sub(r'<h1>[^<]*</h1>', f'<h1>{esc(h)}</h1>', s, count=1)
    s = re.sub(r'(<span aria-current="page">)[^<]*(</span></nav>)', lambda m: m.group(1) + esc(h) + m.group(2), s, count=1)
    return s

def new_page(slug, d, tpl):
    s = tpl
    url = f'{O}/services/{slug}'
    s = re.sub(r'<title>[^<]*</title>', f'<title>{esc(d["title"])}</title>', s)
    for k in ('name="description"', 'property="og:description"', 'name="twitter:description"'):
        s = re.sub(r'(<meta ' + k + r' content=")[^"]*', lambda m: m.group(1) + esc(d['desc']), s)
    for k in ('property="og:title"', 'name="twitter:title"'):
        s = re.sub(r'(<meta ' + k + r' content=")[^"]*', lambda m: m.group(1) + esc(d['title']), s)
    s = s.replace(f'{O}/services/residential-interior-design', url)
    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": O + "/"},
            {"@type": "ListItem", "position": 2, "name": "Services", "item": O + "/services"},
            {"@type": "ListItem", "position": 3, "name": d['h1'], "item": url}]},
        {"@type": "Service", "name": d['h1'], "serviceType": d['h1'], "description": d['desc'], "url": url,
         "provider": {"@type": "HomeAndConstructionBusiness", "name": "Indéva Studio", "url": O + "/"},
         "areaServed": [{"@type": "City", "name": c} for c in ("Delhi", "South Delhi", "Gurgaon", "Noida", "Sonipat", "Narela")]}]}
    s = re.sub(r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False, indent=1) + '</script>', s, count=1, flags=re.S)
    m0 = s.index('<main id="main">'); m1 = s.index('<section class="sec"><h2>Where we work</h2>')
    cards = ''
    for rs, img, name, meta in d['related']:
        im = f'<img src="/{img}" width="800" height="600" loading="lazy" alt="{esc(name)}">' if img else '<div class="ph-card" role="img" aria-label="Images to be added">images to be added</div>'
        cards += f'<a class="card" href="/projects/{rs}">{im}<span class="c-type">{esc(meta)}</span><h2>{esc(name)}</h2></a>'
    steps = s[s.index('<section class="sec"><h2>How we work</h2>'):s.index('</section>', s.index('<section class="sec"><h2>How we work</h2>')) + 10]
    main = (f'<main id="main">\n<nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a> <span>/</span> <a href="/services">Services</a> <span>/</span> <span aria-current="page">{esc(d["h1"])}</span></nav>\n'
            f'<header class="p-head">\n  <p class="eyebrow">Services · Delhi NCR</p>\n  <h1>{esc(d["h1"])}</h1>\n  <p class="lede">{esc(d["lede"])}</p>\n</header>\n'
            '<section class="sec">' + ''.join(f'<p>{esc(p)}</p>' for p in d['intro']) + '</section>\n'
            '<section class="sec"><h2>What&rsquo;s included</h2><ul class="incl">' + ''.join(f'<li>{esc(x)}</li>' for x in d['incl']) + '</ul></section>\n'
            + steps + '\n'
            f'<section class="sec"><h2>Related projects</h2><div class="cards" style="margin-bottom:0">{cards}</div></section>\n')
    s = s[:m0] + main + s[m1:]
    s = re.sub(r'<section class="related">.*?</section>\n?', '', s, count=1, flags=re.S)
    if '.ph-card' not in s:
        s = s.replace('.sv-other{', '.ph-card{aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;border:1px dashed #BDB5A8;background:repeating-linear-gradient(135deg,#F6F3EE 0 14px,#F1EDE6 14px 28px);font-size:.72rem;letter-spacing:.16em;text-transform:uppercase;color:#5C564D;margin-bottom:14px}\n.sv-other{', 1)
    return s

tpl = open(os.path.join(SV, 'residential-interior-design.html'), encoding='utf-8').read()
for slug, _ in SERVICES:
    f = os.path.join(SV, slug + '.html')
    d = D[slug]
    s = new_page(slug, d, tpl) if 'h1' in d and not os.path.exists(f) else open(f, encoding='utf-8').read() if os.path.exists(f) else new_page(slug, d, tpl)
    s = retitle(s, slug)
    s = finish(s, slug, d)
    open(f, 'w', encoding='utf-8').write(s)
    print('ok', slug)
