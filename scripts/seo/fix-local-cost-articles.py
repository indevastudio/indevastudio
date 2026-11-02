#!/usr/bin/env python3
"""One-off editorial corrections (2 Nov 2026) to three local cost articles:

  /insights/defence-colony-interior-design-cost-guide
  /insights/luxury-interior-designer-greater-kailash-cost-guide
  /insights/hiring-home-interior-designer-hauz-khas

Removes invented quotations attributed to Indéva staff, unsourced statistics and
unverified company policies; corrects arithmetic so every illustrative budget adds
up; labels illustrative figures clearly; adds dateModified and a visible
correction note. Asserts the original text first, so it cannot run twice.
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
UPDATED = '2026-11-02'
SP = '[   ]'


def pat(old):
    return re.compile(SP.join(re.escape(p) for p in old.split(' ')))


class Doc:
    def __init__(self, slug):
        self.path = os.path.join(ROOT, 'insights', slug, 'index.html')
        self.s = open(self.path, encoding='utf-8').read()

    def rep(self, old, new, count=1):
        rx = pat(old)
        n = len(rx.findall(self.s))
        assert n == count, f'{os.path.basename(os.path.dirname(self.path))}: expected {count} x {old[:80]!r}, found {n}'
        self.s = rx.sub(lambda m: new, self.s)

    def dated(self, note):
        self.rep('"datePublished":"', f'"dateModified":"{UPDATED}","datePublished":"')
        self.s = re.sub(r'(<main class="article-body">\s*)',
                        lambda m: m.group(1) + f'<p class="update-note"><em>Updated 2 November 2026: {note}</em></p>\n',
                        self.s, count=1)
        # visible date line: "<span>september 2026</span>" -> add updated date
        self.s = re.sub(r'(<div class="article-meta">\s*<span>)([a-z]+ 2026)(</span>)',
                        lambda m: f'{m.group(1)}published {m.group(2)}{m.group(3)}\n    <span>·</span>\n    <span>updated 2 november 2026</span>',
                        self.s, count=1)

    def save(self):
        assert '/#contact' not in self.s
        open(self.path, 'w', encoding='utf-8').write(self.s)
        print('updated', os.path.relpath(self.path, ROOT))


def lakh(v):
    return f'₹{v:g} lakh'


DISCLAIMER = ('<p class="disclaimer"><em>All figures in this article are illustrative, for planning only. They are not '
              'a quotation, not a verified market average and not an Indéva project. Actual costs depend on the design, '
              'site conditions, material specifications, brands and the scope agreed; a reliable number comes only from '
              'an itemised BOQ prepared for your home.</em></p>\n')

# ═══ Defence Colony ═══════════════════════════════════════════════════════
def fix_defence():
    d = Doc('defence-colony-interior-design-cost-guide')
    d.rep('most homeowners believe a luxury interior in Defence Colony starts at ₹5 crore, yet a disciplined budget can deliver a high‑end look for as low as ₹1 crore.',
          'A luxury interior in Defence Colony does not have to start in the multiple crores: with a defined scope and disciplined choices, this guide works through an illustrative ₹1–3 crore budget for an independent floor.')
    d.rep('Imported marble, custom millwork, and European lighting add a premium of 30‑50 % over local alternatives.',
          'Imported marble, custom millwork and imported lighting usually cost more than local alternatives — compare both in the BOQ before deciding.')
    d.rep('Professional oversight by an interior design company Defence Colony can range from 8‑12 % of total spend.',
          'Professional oversight is charged in different ways — a fixed fee or a percentage of project cost — so ask for it as a separate line.')
    d.rep('Figures are averages derived from recent market data and are meant to guide, not replace, a detailed quotation.',
          'These are illustrative figures to show how a budget is built up — not market averages — and they do not replace a detailed quotation.')

    # recompute the fees block so it is internally consistent
    rooms = {'living room': 45, 'master bedroom': 51, 'kitchen & dining': 43, 'common areas': 25}
    assert (8 + 12 + 15 + 6 + 4, 10 + 9 + 7 + 5 + 20, 18 + 12 + 6 + 4 + 3, 12 + 8 + 5) == (45, 51, 43, 25)
    construction = sum(rooms.values())            # 164 lakh
    pm = round(construction * 0.10, 1)            # 16.4 lakh
    contingency = 15                              # lakh, kept from the original
    cont_pct = contingency / construction * 100   # 9.1%
    grand = construction + pm + contingency       # 195.4 lakh
    assert (construction, pm, round(grand, 1)) == (164, 16.4, 195.4) and 5 <= cont_pct <= 10
    d.rep('<li>Project management (10 % of construction cost): ₹20 lakh</li>',
          f'<li>Project management (10% of the ₹{construction / 100:g} crore of work above): {lakh(pm)}</li>')
    d.rep('<li>Contingency (5‑10 % for unforeseen work): ₹15 lakh</li>',
          f'<li>Contingency for unforeseen work (about {cont_pct:.0f}% of the work): {lakh(contingency)}</li>')
    d.rep('<p><strong>Grand total range:</strong> ₹1.6 crore – ₹2.4 crore, comfortably within the ₹1–3 crore envelope.</p>',
          f'<p><strong>Grand total:</strong> ₹45 lakh + ₹51 lakh + ₹43 lakh + ₹25 lakh + {lakh(pm)} + {lakh(contingency)} = '
          f'<strong>₹{grand / 100:.2f} crore</strong> in this example, inside the illustrative ₹1–3 crore envelope.</p>\n' + DISCLAIMER)
    q = re.search(r'<blockquote>“the biggest budget leak.*?senior' + SP + r'consultant at indéva studio</blockquote>', d.s)
    assert q
    d.s = d.s.replace(q.group(0), '<p>The biggest budget leak is usually not the price of marble but an undefined scope that lets changes spiral — fix the scope in writing before work starts.</p>')
    d.rep('Tie 20 % of fees to design approval, 40 % to material procurement, and the remainder to completion.',
          'Link each payment to a stage you can check — for example design approval, material procurement and completion.')
    d.rep('<li><strong>Leverage local sourcing:</strong> Suppliers in South Delhi locality of defence colony often offer volume discounts that larger firms overlook.</li>',
          '<li><strong>Ask about local sourcing:</strong> where the same material is used in several rooms, ask whether ordering it together lowers the rate.</li>')
    d.rep('Estimates are based on current market rates for materials and labor in Defence Colony. They become more precise after finalising the design concept and material selections.',
          'The figures in this guide are illustrative only. A real estimate becomes reliable once the design and the material and brand of every item are fixed in an itemised BOQ.')
    d.rep('For a 2,500 sq ft independent floor, the timeline ranges from 6 to 10 months, depending on approvals, material lead times, and the complexity of custom elements.',
          'It depends on the scope, approvals, material lead times and how much is custom-made; structural work adds time. Ask for a written schedule with milestones before you sign.')
    d.rep('An <a href="/delhi">interior design in south delhi</a> firm can source quality alternatives at lower price points.',
          'An experienced <a href="/delhi">interior designer in Delhi</a> can suggest alternatives at lower price points for you to compare.')
    d.rep('<a href="/#contact">start a project</a> with indéva studio and benefit from data‑backed planning that respects both style and finances.',
          '<a href="/contact">start a project</a> with indéva studio and get a budget built from an itemised BOQ.')
    d.dated('the project-management figure now matches its stated 10%, the example now gives a single correct total '
            '(it previously showed a range that did not match its own items), and unsourced figures and an unattributed quotation have been removed.')
    d.save()


# ═══ Greater Kailash ══════════════════════════════════════════════════════
def fix_kailash():
    g = Doc('luxury-interior-designer-greater-kailash-cost-guide')
    g.rep('A recent survey shows that 62% of Delhi homeowners believe a luxury interior makeover starts at ₹1 crore, yet most projects in Greater Kailash finish well below that threshold.',
          'Many homeowners assume a luxury interior makeover starts at ₹1 crore. It need not: this guide works through an illustrative budget for a Greater Kailash duplex in the tens of lakhs, and shows where the money goes.')
    g.rep('Choosing locally sourced alternatives can shave 15‑20% off the total.',
          'Locally sourced alternatives usually cost less — compare both options line by line.')

    # item lists rewritten so each room adds up to its row in the illustrative table
    lists = {
        'living': [('Flooring (engineered wood or premium tiles)', 3, 5), ('Custom sofa set and coffee table', 2, 3),
                   ('Lighting (chandeliers, recessed LEDs)', 1, 2), ('Wall finishes (paint, textured panels)', 1.5, 2)],
        'kitchen': [('Cabinetry (solid wood with soft‑close hinges)', 3, 5), ('Countertops (quartz or natural stone)', 1, 2),
                    ('Appliances (built‑in oven, induction cooktop)', 1.5, 2.5), ('Plumbing fixtures and lighting', 0.5, 0.5)],
        'bedrooms': [('Wardrobe systems', 2, 4), ('Flooring and wall accents', 1, 2),
                     ('Bedding & soft furnishings', 0.5, 1), ('Ambient lighting', 0.5, 1)],
        'bathrooms': [('Vanity units & mirrors', 0.5, 1), ('Tiles (floor & wall)', 0.75, 1.5),
                      ('Premium faucets & fittings', 0.5, 1), ('Ventilation & lighting', 0.25, 0.5)],
    }
    table = {'living': (7.5, 12), 'kitchen': (6, 10), 'bedrooms': (4, 8), 'bathrooms': (2, 4)}
    pm_rng = (2.5, 5)
    for k, items in lists.items():
        lo, hi = sum(i[1] for i in items), sum(i[2] for i in items)
        assert (lo, hi) == table[k], (k, lo, hi)
    tot_lo = sum(v[0] for v in table.values()) + pm_rng[0]
    tot_hi = sum(v[1] for v in table.values()) + pm_rng[1]
    assert (tot_lo, tot_hi) == (22, 39)


    def share(k):
        lo = table[k][0] / tot_lo * 100
        hi = table[k][1] / tot_hi * 100
        a, b = sorted((round(lo), round(hi)))
        return f'about {a}–{b}%' if a != b else f'about {a}%'


    def ul(items):
        def rng(a, b):
            return lakh(a) if a == b else f'₹{a:g}–{b:g} lakh'
        return '<ul>\n' + '\n'.join(f'<li>{n}: {rng(a, b)}</li>' for n, a, b in items) + '\n</ul>'


    blk = re.search(r'(?s)<p>Below is a typical allocation for a duplex.*?(?=<h2>how to negotiate</h2>)', g.s)
    assert blk
    g.s = g.s.replace(blk.group(0),
        '<p>Below is an illustrative allocation for a duplex of about 2,500 sq ft in Greater Kailash, Delhi. The figures are '
        'made up to show how a budget is built — not market rates — and in this example they add up to about ₹22–39 lakh '
        '(see the table further down). Each room’s items add up to its row in that table.</p>\n\n'
        f'<h3>living area</h3>\n<p>Living spaces often take the largest share because they set the tone for the home — {share("living")} of the total in this example.</p>\n{ul(lists["living"])}\n\n'
        f'<h3>kitchen</h3>\n<p>Modern kitchens balance looks with function — {share("kitchen")} of the total here.</p>\n{ul(lists["kitchen"])}\n\n'
        f'<h3>bedrooms (two, together)</h3>\n<p>Bedrooms usually get a more restrained treatment — {share("bedrooms")} of the total here.</p>\n{ul(lists["bedrooms"])}\n\n'
        f'<h3>bathrooms (two, together)</h3>\n<p>Wet areas can cost more than their size suggests because of waterproofing and sanitaryware — {share("bathrooms")} of the total here.</p>\n{ul(lists["bathrooms"])}\n\n')
    g.rep('<p>indéva studio often suggests a 10% discount on material costs when the client agrees to a fixed‑price contract for the entire duplex.</p>\n', '')
    q = re.search(r'<blockquote>“The most common source of surprise charges.*?senior' + SP + r'project manager, indéva studio</blockquote>', g.s)
    assert q
    g.s = g.s.replace(q.group(0), '<p>The most common source of surprise charges is the lack of a clear change‑order process: without one, every small tweak becomes a billable event.</p>')
    g.rep('<p>These figures illustrate how a well‑planned design can stay comfortably within a ₹25–50 lakh envelope, even when premium finishes are chosen.</p>',
          '<p>Low end: ₹7.5 + 6 + 4 + 2 + 2.5 lakh = ₹22 lakh. High end: ₹12 + 10 + 8 + 4 + 5 lakh = ₹39 lakh. '
          'A different scope, area or finish level would give different numbers.</p>\n' + DISCLAIMER)
    assert 7.5 + 6 + 4 + 2 + 2.5 == 22 and 12 + 10 + 8 + 4 + 5 == 39
    g.rep('Estimates are based on current market rates for materials and labour in the Greater Kailash area. A ±10% variance is typical due to price changes or client‑initiated design tweaks.',
          'The figures in this guide are illustrative. A real estimate is only as accurate as its BOQ: once every item has a fixed material, brand and rate, the remaining variation comes mainly from price changes and design changes you ask for.')
    g.rep(' Indéva studio offers a vetted supplier list to streamline this process.', '')
    g.rep('From concept to handover, a well‑coordinated project usually takes 4‑6 months, assuming no major structural alterations.',
          'It depends on scope, approvals and material lead times; structural work adds time. Ask for a written schedule with milestones.')
    g.rep('South Delhi, including Greater Kailash, features older structures with heritage considerations. This often requires specialised restoration techniques, which can affect both cost and schedule.',
          'Many South Delhi homes, including in Greater Kailash, are older buildings. Their structure, wiring and plumbing may need checking before new work, which can affect both cost and schedule.')
    g.rep('<a href="/#contact">contact us for a free consultation</a>', '<a href="/contact">contact us</a>')
    g.dated('the room-by-room items now add up to the illustrative budget table, the table total is shown worked out, and an unsourced '
            'survey figure, an unattributed quotation and an unverified discount policy have been removed.')
    g.save()


# ═══ Hauz Khas ════════════════════════════════════════════════════════════
def fix_hauz():
    h = Doc('hiring-home-interior-designer-hauz-khas')
    h.rep('an <strong>illustrative budget</strong> of <strong>₹8–15 lakh</strong> is a realistic range for quality finishes and custom furniture.',
          'we use an illustrative budget of ₹8–15 lakh in this guide. It is an example for planning, not a quotation; your number depends on area, scope and finishes.')
    h.rep('Which materials are best suited for the humidity levels in Hauz Khas?',
          'Which materials suit Delhi’s heat, monsoon humidity and dust?')
    h.rep('A typical project of this size may take 10–14 weeks from start to handover.',
          'Ask for a written schedule from start to handover, with milestones you can check.')
    h.rep('For a budget of ₹8–15 lakh, most projects complete within 10–14 weeks, depending on material lead times and structural work.',
          'It depends on scope, material lead times and whether structural work is involved. Agree a written schedule with milestones before work starts.')
    q = re.search(r'<blockquote>“A well‑structured contract.*?</blockquote>', h.s)
    assert q and 'industry insight' in q.group(0)
    h.s = h.s.replace(q.group(0), '<p>A well‑structured contract is not a barrier; it is the safety net that lets the design develop without hidden costs.</p>')
    h.rep('If the redesign involves altering load‑bearing walls, a licensed architect must be engaged. Your interior designer can coordinate with them.',
          'If the redesign involves altering load‑bearing walls or other structure, have it checked by a qualified structural engineer and confirm whether approvals are needed. Your interior designer can coordinate with them.')
    h.s = h.s.replace('href="/#contact"', 'href="/contact"')
    h.dated('the illustrative budget is now labelled as an example, unsupported timelines have been replaced with advice to agree a written schedule, '
            'and the guidance on structural changes has been corrected.')
    h.save()


if __name__ == '__main__':
    for slug, fn in [('defence-colony-interior-design-cost-guide', fix_defence),
                     ('luxury-interior-designer-greater-kailash-cost-guide', fix_kailash),
                     ('hiring-home-interior-designer-hauz-khas', fix_hauz)]:
        if '"dateModified":"%s"' % UPDATED in Doc(slug).s:
            print('already corrected, skipped', slug)
            continue
        fn()
