#!/usr/bin/env python3
"""One-off correction of /insights/interior-design-cost-south-delhi-guide (2 Nov 2026).

What it fixes:
  - Room-allocation table showed every rupee range 10x too high (e.g. 25-30% of a
    Rs 1-3 crore budget shown as Rs 2.5-9 crore). Ranges are now recomputed here:
    low = low% x Rs 1 crore, high = high% x Rs 3 crore.
  - Illustrative example said "approximately Rs 2.4 crore" but its lines added up
    to Rs 3.6 crore. Lines rescaled so they add to exactly Rs 2.4 crore; the
    built-up area now matches the table (4,000 sq ft).
  - Removed an unattributed "senior cost consultant, indeva studio" quotation and
    an unsourced "10% to 30% markup" figure; softened an unsupported market claim
    and the generic "designers have trade discounts" claim.
  - Added what an estimate includes/excludes, and a disclaimer.
  - Title/headline: dropped "2024" (the article was first published 22 Aug 2026).
    datePublished is kept; dateModified and a visible correction note are added.

Run from repo root. Refuses to run twice (asserts the original text is present).
"""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
P = os.path.join(ROOT, 'insights', 'interior-design-cost-south-delhi-guide', 'index.html')
UPDATED = '2026-11-02'
s = open(P, encoding='utf-8').read()


SP = '[ \u202f\u00a0]'


def pat(old):
    """Regex for `old` that accepts a normal, narrow no-break or no-break space wherever old has a space."""
    return re.compile(SP.join(re.escape(part) for part in old.split(' ')))


def rep(old, new, count=1):
    global s
    rx = pat(old)
    n = len(rx.findall(s))
    assert n == count, f'expected {count} x {old[:70]!r}, found {n}'
    s = rx.sub(lambda m: new, s)


def lakh(x):
    """Rupees in lakh -> display string (1 crore = 100 lakh)."""
    return f'₹{x:g} lakh'


# ── 1. allocation table, recomputed ─────────────────────────────────────────
rows = [  # (label, low %, high %)
    ('Living & dining', 25, 30),
    ('Master suite', 15, 18),
    ('Guest bedrooms (2‑3)', 10, 12),
    ('Kitchen & pantry', 12, 15),
    ('Bathrooms & wet areas', 8, 10),
    ('Service areas (laundry, store)', 5, 7),
    ('Contingency & soft costs', 5, 10),
]
LOW_BUDGET, HIGH_BUDGET = 100, 300  # in lakh (Rs 1 crore and Rs 3 crore)
new_rows = []
for label, lo, hi in rows:
    a = lo * LOW_BUDGET / 100
    b = hi * HIGH_BUDGET / 100
    new_rows.append(f'<tr><td>{label}</td><td>{lo}‑{hi} %</td><td>{lakh(a)} – {lakh(b)}</td></tr>')
expected = ['₹25 lakh – ₹90 lakh', '₹15 lakh – ₹54 lakh', '₹10 lakh – ₹36 lakh', '₹12 lakh – ₹45 lakh',
            '₹8 lakh – ₹30 lakh', '₹5 lakh – ₹21 lakh', '₹5 lakh – ₹30 lakh']
for r, want in zip(new_rows, expected):
    assert want in r, (r, want)
low_sum = sum(r[1] for r in rows)
high_sum = sum(r[2] for r in rows)
assert (low_sum, high_sum) == (80, 102)

old_tbody = re.search(r'(?s)<tbody>\n<tr><td>Living & dining</td>.*?</tbody>', s).group(0)
assert pat('₹2.5 cr – ₹9 cr').search(old_tbody)
s = s.replace(old_tbody, '<tbody>\n' + '\n'.join(new_rows) + '\n</tbody>')

rep('<p>Below is a typical allocation for an independent bungalow spanning 4,000 sq ft. Numbers are illustrative; actual spend will vary based on finish quality and brand selection.</p>',
    '<p>Below is one illustrative way to split the budget for an independent bungalow of about 4,000 sq ft. '
    'The percentages are a planning aid, not industry averages and not a fixed breakdown — your own split '
    'depends on which rooms matter most to you. In the rupee column, the low figure is the low percentage of a '
    '₹1 crore budget and the high figure is the high percentage of a ₹3 crore budget.</p>')
rep('<th>₹ Range (₹1‑3 cr project)</th>', '<th>₹ Range (₹1–3 crore budget)</th>')
rep('<p>These percentages illustrate why the <em>south delhi cost</em> of a high‑end bungalow can comfortably sit within the ₹1‑3 crore bracket.</p>',
    f'<p>The percentage ranges are deliberately loose: their lower ends add up to {low_sum}% and their upper ends to '
    f'{high_sum}%, so when you set your own split, pick values inside each range that total exactly 100%. '
    'For example, on a ₹2 crore budget a 28% living and dining share is ₹56 lakh.</p>')
assert 28 * 200 / 100 == 56

# ── 2. illustrative example, rescaled to add up ────────────────────────────
items = [  # (label, lakh)
    ('Design consultancy (concept + detailed drawings)', 30),
    ('Materials (marble flooring, teak wood, premium fixtures)', 80),
    ('Custom furniture and millwork', 40),
    ('Labour and execution', 60),
    ('Project management & contingency', 30),
]
total = sum(v for _, v in items)
assert total == 240, total  # Rs 2.4 crore

def money(v):
    return f'₹{v / 100:g} crore' if v >= 100 else f'₹{v} lakh'

old_example = re.search(r'(?s)<h2>ILLUSTRATIVE BUDGET \(hypothetical example\)</h2>.*?for similar projects\.</p>', s).group(0)
assert pat('₹45 lakh').search(old_example) and pat('₹1.2 crore').search(old_example)
new_example = (
    '<h2>Illustrative budget (hypothetical example)</h2>\n'
    '<p>This is a made‑up example to show how the numbers fit together — it is not an Indéva project or a quotation. '
    'Imagine an independent bungalow in South Delhi with a built‑up area of about 4,000 sq ft and a total interior '
    'budget of ₹2.4 crore. Split by type of cost (rather than by room, as in the table above), it might look like this:</p>\n'
    '<ul>\n'
    + '\n'.join(f'<li>{lbl}: {money(v)} ({v / total * 100:.1f}%)</li>' for lbl, v in items)
    + '\n</ul>\n'
    f'<p>Total: {" + ".join(money(v) for _, v in items)} = <strong>{money(total)}</strong>, '
    f'or about ₹{total * 100000 // 4000:,} per sq ft of built‑up area. A different scope or finish level would give a different total.</p>'
)
assert '₹2.4 crore' in new_example and '6,000' in new_example
s = s.replace(old_example, new_example)

# ── 3. what an estimate includes / excludes, and a disclaimer ──────────────
rep('<h2>frequently asked questions</h2>',
    '<h2>What these figures include and exclude</h2>\n'
    '<p><strong>Included</strong> in the illustrative figures: design and drawings, finishing materials, '
    'custom furniture and joinery, labour and site execution, project management and a contingency.</p>\n'
    '<p><strong>Not included</strong> unless you add them: structural or civil changes, new electrical mains or '
    'plumbing risers, loose furniture and décor bought separately, appliances, air‑conditioning equipment, '
    'statutory approvals and GST.</p>\n'
    '<p class="disclaimer"><em>These are illustrative allocations for planning, not a quotation or a verified '
    'market average. Actual costs depend on the design, site conditions, material specifications, brands and '
    'the scope agreed. A reliable number comes only from an itemised BOQ prepared for your home.</em></p>\n\n'
    '<h2>frequently asked questions</h2>')

# ── 4. unsupported claims ──────────────────────────────────────────────────
rep('The truth is far different: a well‑planned luxury bungalow typically lands between ₹1 crore and ₹3 crore, even when you include premium fixtures and custom millwork.',
    'In this guide we use an illustrative budget of ₹1 crore to ₹3 crore for fully finishing a luxury bungalow, including premium fixtures and custom millwork — your own number may be lower or higher.')
rep('In reality, many designers quote a flat‑rate markup that can range from 10 % to 30 % of the total spend, but the percentage often masks hidden costs like site visits, revisions, and procurement fees.',
    'In reality, fee structures vary widely — a flat fee, a rate per square foot, a percentage of project cost, or a markup on procurement — and a headline percentage can hide extra charges for site visits, revisions or procurement. Ask for every fee in writing.')
q = re.search(r'(?s)<blockquote>(?:(?!</blockquote>).)*?senior' + SP + 'cost' + SP + 'consultant.*?</blockquote>', s)
assert q, 'quote block not found'
inner = re.sub(r'<[^>]+>', ' ', q.group(0))
assert 'receipts' in inner
s = s.replace(q.group(0), '<p>If a designer handles procurement without showing you the supplier invoices, ask for them — '
              'otherwise you cannot tell what markup you are paying.</p>')
rep('Designers often have trade discounts and can ensure that pieces match the overall design language, reducing the risk of costly mismatches.',
    'Sometimes a designer can source at better rates, but ask whether any saving is passed on to you. The bigger benefit is that pieces are sized and specified to fit the design, which reduces costly mismatches.')
rep('keep your project within the desired ₹1‑3 crore window.', 'plan a budget that fits your home.')
rep('Research typical <strong>interior interiors cost South Delhi</strong> for comparable projects.',
    'Compare itemised quotations for comparable scope rather than headline per‑square‑foot rates.')
rep('Here are three proven tactics:', 'Three tactics help:')

# ── 5. title / date consistency ────────────────────────────────────────────
rep('interior design cost south delhi: realistic 2024 budget guide — indéva studio</title>',
    'interior design cost south delhi: a realistic budget guide — indéva studio</title>')
rep('content="Interior design cost South Delhi: realistic 2024 budget guide — indéva studio"',
    'content="Interior design cost South Delhi: a realistic budget guide — indéva studio"')
rep('"headline":"Interior design cost South Delhi: realistic 2024 budget guide"',
    '"headline":"Interior design cost South Delhi: a realistic budget guide"')
rep('"datePublished":"2026-08-22",', f'"datePublished":"2026-08-22","dateModified":"{UPDATED}",')
rep('<h1 class="article-title">interior design cost south delhi: realistic 2024 budget guide</h1>',
    '<h1 class="article-title">interior design cost south delhi: a realistic budget guide</h1>')
rep('<span>august 2026</span>',
    '<span>published 22 august 2026</span>\n    <span>·</span>\n    <span>updated 2 november 2026</span>')
rep('<h2>interior design cost South Delhi: a realistic 2024 budget guide</h2>',
    '<p class="update-note"><em>Correction, 2 November 2026: the rupee ranges in the cost table were shown ten times '
    'too high, and the illustrative example did not add up to its stated total. Both have been corrected, the year '
    'has been removed from the title, and notes on what the figures include have been added.</em></p>\n'
    '<h2>Where the money goes in a South Delhi interior</h2>')
rep('Discover true interior design costs in South Delhi with data‑driven breakdowns, negotiation tips and red‑flag alerts for a ₹1‑3 cr bungalow.',
    'An illustrative budget split for a ₹1–3 crore South Delhi bungalow interior, with a worked example, what estimates include, negotiation tips and red flags.',
    count=len(pat('Discover true interior design costs in South Delhi with data‑driven breakdowns, negotiation tips and red‑flag alerts for a ₹1‑3 cr bungalow.').findall(s)))

assert '2024' not in s, [m.start() for m in re.finditer('2024', s)]
open(P, 'w', encoding='utf-8').write(s)
print('updated', os.path.relpath(P, ROOT))
