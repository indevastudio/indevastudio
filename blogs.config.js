/**
 * INDEVA STUDIO — BLOG CONFIGURATION
 * ─────────────────────────────────────────────────────────────────
 * HOW TO ADD A NEW BLOG POST:
 *
 *   1. Copy the template at the bottom of this file
 *   2. Fill in all fields
 *   3. Run: npm run publish
 *   4. Done — auto-generates HTML, commits, Vercel deploys
 *
 * SECTION TYPES:
 *   { type: 'h2',     text: '...' }
 *   { type: 'h3',     text: '...' }
 *   { type: 'p',      text: '...' }          supports **bold** and [link](url)
 *   { type: 'quote',  text: '...' }
 *   { type: 'list',   items: ['...'] }
 *   { type: 'callout',text: '...' }
 *   { type: 'image',  url, alt, credit? }
 * ─────────────────────────────────────────────────────────────────
 */

export const blogs = [

  // ── ALREADY DEPLOYED (slug-only — generator skips these) ────────
  // These have HTML files in insights/ on the live server.
  // They are listed here only so sitemap.js can include them.

  { slug: 'udaipur-luxury-villas-cost-guide' },
  { slug: 'villa-interior-design-cost-delhi-ncr' },
  { slug: 'contemporary-villa-living-room-design' },
  { slug: 'full-home-interior-design-cost' },
  { slug: 'bedroom-false-ceiling-design-ideas' },
  { slug: 'modern-farmhouse-interior-design-cost' },
  { slug: 'restaurant-interior-designers-gurgaon' },
  { slug: 'farmhouse-interior-design-ideas-india' },
  { slug: 'flat-interior-design-cost-delhi' },
  { slug: 'high-end-interior-design-cost-guide' },
  { slug: 'modern-living-room-design-ideas' },
  { slug: 'villa-interior-designers-delhi-ncr-price' },
  { slug: 'gurgaon-villa-interior-design-cost' },
  { slug: 'bespoke-interior-design-ideas' },
  { slug: 'luxury-living-room-interior-design-delhi' },
  { slug: 'bespoke-villa-interior-design-noida' },
  { slug: 'farmhouse-villa-interior-design-mistakes' },
  { slug: 'best-farmhouse-interior-designer-dehradun' },
  { slug: 'fine-dining-restaurant-design-ideas' },
  { slug: 'luxury-bedroom-design-cost-delhi-ncr' },
  { slug: 'living-room-tv-unit-design-mistakes' },
  { slug: 'luxury-bedroom-design-ideas' },
  { slug: 'restaurant-interior-design-cost-delhi' },
  { slug: 'open-plan-living-room-design-ideas' },
  { slug: 'luxury-farmhouse-design-delhi-ncr' },
  { slug: 'top-interior-designers-delhi-farmhouse' },
  { slug: 'high-end-cafe-design-delhi' },
  { slug: 'false-ceiling-design-cost-guide' },
  { slug: 'flat-interior-design-delhi-cost-per-sqft' },
  { slug: 'why-most-floor-plans-fail' },
  { slug: 'execution-is-design' },
  { slug: 'perfection-is-the-enemy-of-comfort' },
  { slug: 'budget-truth-in-indian-interiors' },
  { slug: 'how-we-protect-design-on-site' },
  { slug: 'why-we-refuse-to-start-with-moodboards' },
  { slug: 'light-is-not-a-finish-it-is-the-space' },
  { slug: 'the-honest-material-stone-over-stone-effect' },
  { slug: 'what-a-good-brief-actually-looks-like' },
  { slug: 'the-scale-problem-small-rooms' },
  { slug: 'choosing-a-contractor-in-india' },
  { slug: 'colour-follows-conviction-not-trends' },
  { slug: 'interior-design-trends-india-2025' },
  { slug: 'what-luxury-interior-design-means-in-india' },
  { slug: 'complete-guide-kitchen-design-indian-homes' },
  { slug: 'how-to-design-a-bedroom-that-helps-you-sleep' },
  { slug: 'office-interior-design-team-performance' },
  { slug: 'complete-guide-home-lighting-design' },
  { slug: 'small-apartment-design-every-square-foot' },
  { slug: 'restaurant-interior-design-ambience-revenue' },
  { slug: 'how-to-choose-the-right-colour-palette' },
  { slug: 'sustainable-interior-design' },
  { slug: 'open-plan-living-when-it-works' },
  { slug: 'biophilic-design-bringing-nature-indoors' },
  { slug: 'expensive-interior-design-mistakes-india' },
  { slug: 'designing-the-luxury-bathroom' },
  { slug: 'how-to-write-a-brief-your-interior-designer-will-love' },
  { slug: 'interior-design-cost-india-2025' },
  { slug: 'designing-a-luxury-villa-in-india' },
  { slug: 'interior-designer-vs-architect' },
  { slug: 'vastu-and-modern-interior-design' },
  { slug: 'how-to-hire-an-interior-designer-india' },

  // ── NEW POSTS — GENERATOR WILL BUILD THESE ──────────────────────

  {
    slug:      'premium-living-room-design-gurgaon',
    title:     'Premium Living Room Design in Gurgaon: A Complete Guide',
    metaTitle: 'Premium Living Room Design Gurgaon — indéva studio',
    metaDesc:  'Planning a premium living room in Gurgaon? Complete guide on budget, materials, spatial planning, and what separates good from extraordinary.',
    category:  'villa & farmhouse',
    readTime:  '5 min read',
    date:      'May 2025',
    city:      'Gurgaon',
    heroImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&h=675&fit=crop&q=80',
    heroAlt:   'premium living room design gurgaon — indéva studio',
    heroCredit:{ name: 'R ARCHITECTURE', url: 'https://unsplash.com/@rarchitecture_melbourne' },
    intro: 'Gurgaon is home to some of India\'s most discerning homeowners — and some of its most thoughtlessly designed living rooms. A large budget does not guarantee a great space. What separates a premium living room from an expensive one is not the materials used, but the intelligence with which space, light, proportion, and life are understood.',
    sections: [
      { type: 'h2', text: 'What "Premium" Actually Means in a Living Room' },
      { type: 'p',  text: 'Most people equate premium with expensive finishes — Italian marble, designer sofas, imported lighting. These things matter. But a living room with ₹30 lakh of furniture and poor spatial planning will always feel wrong. Premium begins with the plan.' },
      { type: 'p',  text: 'At indéva studio, we define a premium living room as one where every decision — from the placement of the primary sofa to the temperature of the ambient light — serves the way the space is actually lived in.' },
      { type: 'quote', text: 'A chair is only beautiful if it invites you to stay. A room is only luxurious if it makes you want to return to it.' },
      { type: 'h2', text: 'The Budget Reality: What ₹15–40 Lakh Gets You in Gurgaon' },
      { type: 'h3', text: '₹15–20 Lakh' },
      { type: 'p',  text: 'Strong material choices, custom furniture in engineered wood with premium laminate or veneer, quality fabric upholstery, layered lighting with dimmers, and a considered spatial plan. This is the baseline for a living room that feels genuinely designed.' },
      { type: 'h3', text: '₹20–30 Lakh' },
      { type: 'p',  text: 'Solid wood and stone elements, premium fabric from established mills, imported lighting fixtures, custom joinery for storage and display, and full design supervision through execution. This is where craft becomes visible.' },
      { type: 'h3', text: '₹30–40 Lakh and Above' },
      { type: 'p',  text: 'Marble and natural stone, European upholstery fabrics, architectural lighting design, custom millwork, statement pieces, and the kind of finish quality that holds up to scrutiny for a decade.' },
      { type: 'callout', text: 'The biggest waste we see in Gurgaon projects: ₹8–10 lakh spent on a sofa that is 30cm too large for the room. Scale is not a style choice — it is a spatial calculation.' },
      { type: 'h2', text: 'The Five Decisions That Define a Premium Living Room' },
      { type: 'list', items: [
        '**The furniture plan before the furniture** — every piece sized and positioned on paper before purchase',
        '**Layered lighting** — minimum four layers: ambient, task, accent, decorative. All on dimmers.',
        '**Material mix** — warmth paired with coolness, rough with smooth, matte with gloss',
        '**The ceiling** — coves, recesses, integrated lighting turn a blank plane into architecture',
        '**The primary view** — every furniture plan must orient toward or deliberately conceal it',
      ]},
      { type: 'h2', text: 'A Recent Project in Gurgaon' },
      { type: 'p',  text: 'A 2,800 sq ft villa on Golf Course Extension Road. The living room was 32 feet long — a space that most designers would fill with more furniture. We divided it into two functional zones with a deliberate 4-foot gap between rugs, creating visual separation without a wall. Perimeter cove lighting, Sahara beige marble at 4x2 feet, and a single oversized pendant defined the space completely. Total: ₹22 lakh. The client\'s first words at handover: "It feels like it was always meant to look like this."' },
    ],
    faqs: [
      { q: 'What is the cost of premium living room interior design in Gurgaon?', a: 'A premium living room in Gurgaon typically costs between ₹15–40 lakh depending on size, materials, and custom furniture scope. Indéva studio provides a detailed cost breakdown before any work begins.' },
      { q: 'How long does a living room project take in Gurgaon?', a: 'From design sign-off to handover, typically 8–14 weeks. Complex projects with imported materials may take longer.' },
      { q: 'Do you redesign living rooms that already have furniture?', a: 'Yes. We assess what works in the space and what does not. An honest edit of existing furniture is part of our initial consultation.' },
    ],
  },

  {
    slug:      'modern-cafe-interior-design-delhi-ncr',
    title:     'Modern Cafe Interior Design in Delhi NCR: What Actually Works',
    metaTitle: 'Modern Cafe Interior Design Delhi NCR — indéva studio',
    metaDesc:  'Designing a modern cafe in Delhi NCR? Indéva studio breaks down costs, design principles, and the decisions that determine whether your cafe becomes a destination.',
    category:  'hospitality design',
    readTime:  '4 min read',
    date:      'May 2025',
    city:      'Delhi NCR',
    heroImage: 'https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=1200&h=675&fit=crop&q=80',
    heroAlt:   'modern cafe interior design delhi ncr — indéva studio',
    heroCredit:{ name: 'Nathan Dumlao', url: 'https://unsplash.com/@nate_dumlao' },
    intro: 'A cafe in Delhi NCR lives or dies on its design. Not because customers are shallow — but because in a market with hundreds of options within a 2km radius, the physical experience of a space is the first and most lasting differentiator. Great coffee is table stakes. A great space is the reason people return.',
    sections: [
      { type: 'h2', text: 'The Design Mistake Most Cafe Owners Make' },
      { type: 'p',  text: 'They design for the photograph. Instagram has convinced an entire generation of cafe owners that a neon sign, exposed brick, and hanging plants constitute an interior design strategy. They do not. They constitute a trend that has already peaked.' },
      { type: 'p',  text: 'The cafes that last — that build regulars, that attract word of mouth, that hold their relevance three years after opening — are designed around people. How they move, where they sit, how long they stay, how the space sounds at 80% capacity.' },
      { type: 'quote', text: 'Design a cafe for your best customer at their most comfortable moment — not for a photographer at the golden hour.' },
      { type: 'h2', text: 'What Modern Cafe Design Means in Delhi NCR in 2025' },
      { type: 'p',  text: 'The aesthetic language that is working in Delhi NCR right now is warm minimalism — neutral plaster walls, warm-toned wood, stone or terrazzo surfaces, layered lighting, and considered greenery. Not maximalism, not industrial, not Scandi-white.' },
      { type: 'list', items: [
        'Warm plaster or limewash walls in off-white, sand, or clay tones',
        'Wood in medium to dark tones — oak, walnut, or teak-finished MDF',
        'Stone or terrazzo tabletops and floor sections',
        'Pendant lighting over seating — warm 2700K LEDs, never cool white',
        'Built-in banquette seating along at least one wall',
        'A single strong visual element — an arch, a feature wall, a bar back — not many',
      ]},
      { type: 'h2', text: 'Budget Breakdown for a 1,000–1,500 sqft Cafe in Delhi NCR' },
      { type: 'h3', text: '₹15–25 Lakh (Entry Level)' },
      { type: 'p',  text: 'Solid layout, quality materials in selected areas, custom furniture in wood and metal, good lighting. Achievable but requires discipline — no budget for mistakes or changes mid-project.' },
      { type: 'h3', text: '₹25–40 Lakh (Mid-Market)' },
      { type: 'p',  text: 'Stone or terrazzo floors in at least one zone, full custom furniture, architectural lighting design, proper acoustic treatment, quality bar and counter fabrication. This is where most well-executed cafes in South Delhi and Gurgaon sit.' },
      { type: 'h3', text: '₹40–70 Lakh (Premium)' },
      { type: 'p',  text: 'Imported materials, bespoke furniture, full lighting design with dimmers and zones, acoustic panels integrated into design, outdoor zone, full branding integration. Cafes at this level become destinations in their own right.' },
      { type: 'callout', text: 'The most common budget error: spending 40% of the budget on the bar counter and kitchen, then cutting corners on seating. Your customers spend 90% of their time at the table, not at the counter.' },
      { type: 'h2', text: 'Acoustics — The Most Underrated Design Decision in a Cafe' },
      { type: 'p',  text: 'A cafe that is too loud drives people out after one coffee. Acoustic comfort — achieved through upholstered seating, curtains, ceiling baffles, and carpet in at least one zone — is what allows customers to have conversations, to stay longer, to return.' },
      { type: 'p',  text: 'We always incorporate acoustic consideration into cafe projects. It adds 5–8% to the budget and doubles the quality of the experience.' },
    ],
    faqs: [
      { q: 'What is the cost of cafe interior design in Delhi NCR?', a: 'For a 1,000–1,500 sqft cafe, budget ₹15–70 lakh depending on finish level. Indéva studio can work across this range with a clear cost plan from the start.' },
      { q: 'How long does a cafe interior design project take?', a: 'Design and approval: 3–4 weeks. Execution: 6–10 weeks depending on complexity. Total: 10–14 weeks from brief to opening.' },
      { q: 'Do you handle kitchen and service area design as well?', a: 'Yes. We coordinate with your equipment supplier and design the back-of-house flow alongside the customer-facing interior, ensuring the two work as one system.' },
    ],
  },

  // ── ADD NEW POSTS BELOW THIS LINE ───────────────────────────────
  //
  // {
  //   slug:      'your-post-slug',               // URL: /insights/your-post-slug
  //   title:     'Full Title of the Blog Post',
  //   metaTitle: 'SEO Title (max 60 chars) — indéva studio',
  //   metaDesc:  'SEO description, max 160 characters.',
  //   category:  'villa & farmhouse',             // or: hospitality design, spatial logic, etc.
  //   readTime:  '4 min read',
  //   date:      'May 2025',
  //   city:      'Delhi',                         // optional, for local SEO
  //   heroImage: 'https://images.unsplash.com/photo-XXXXXXXX?w=1200&h=675&fit=crop&q=80',
  //   heroAlt:   'descriptive alt text',
  //   heroCredit:{ name: 'Photographer', url: 'https://unsplash.com/@username' },
  //   intro:     'Opening paragraph shown in large italic text...',
  //   sections: [
  //     { type: 'h2',     text: 'Section Heading' },
  //     { type: 'p',      text: 'Body text. Use **bold** and [links](https://url.com).' },
  //     { type: 'h3',     text: 'Sub-heading' },
  //     { type: 'quote',  text: 'A memorable line.' },
  //     { type: 'list',   items: ['Point one', '**Bold point** two'] },
  //     { type: 'callout',text: 'Highlighted insight.' },
  //   ],
  //   faqs: [
  //     { q: 'Question?', a: 'Answer.' },
  //   ],
  // },

];
