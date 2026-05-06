#!/usr/bin/env python3
"""
create_editorial_stubs.py — indéva studio  ← RUN THIS FIRST

WHAT THIS FIXES:
  The editorial/handwritten blog posts listed on the insights page
  (e.g. why-most-floor-plans-fail, execution-is-design, etc.)
  currently return HTTP 404 when accessed directly. This is because
  they exist only as JavaScript-rendered SPA routes in index.html,
  but have no real files in insights/{slug}/index.html.

  This script creates real HTML pages for all of them so that:
  - Direct URL access works
  - Google can crawl and index them
  - No 404 errors in Search Console
  - The full content is server-rendered (no JS required)

USAGE:
  python scripts/create_editorial_stubs.py
  git add insights/
  git commit -m "fix: create real HTML pages for editorial blog posts"
  git push

NOTE:
  The content below is extracted from the SPA's blog data (the text
  that shows in the SPA when you click each article). Replace the
  STUB_CONTENT for each post with the actual full content from your
  index.html, or run the full automation again for these posts.
"""

import pathlib

REPO_ROOT   = pathlib.Path(__file__).parent.parent
INSIGHTS    = REPO_ROOT / "insights"
ORIGIN      = "https://www.indevastudio.com"

# ── EDITORIAL POSTS THAT ARE CURRENTLY 404 ───────────────────────────────────
# Add the real content from your SPA's blog data here.
# The slug is the URL path: /insights/{slug}/

EDITORIAL_POSTS = [
    {
        "slug":     "why-most-floor-plans-fail",
        "title":    "why most floor plans fail",
        "category": "spatial logic",
        "excerpt":  "the plan is not the starting point of design — it is the design. most projects go wrong before a single material is selected, because the spatial logic was never interrogated.",
        "content":  """<p>the plan is not the starting point of design. it is the design.</p>
<p>most projects go wrong before a single material is selected, before a tile is sampled, before a mood board is assembled. they go wrong in the floor plan — or rather, in the absence of one. what passes for a plan in most Indian interior projects is a builder's template with furniture drawn on top of it. that is not spatial design. that is furniture placement.</p>
<h2>what a floor plan is actually doing</h2>
<p>a plan is a document of decisions. every wall, every door, every turning radius, every threshold — each is a choice with consequences that compound through the entire project. a door that swings the wrong way makes a room feel smaller every day for the life of the building. a corridor at 900mm that should be 1200mm changes how two people pass each other for twenty years.</p>
<p>the problem is that most clients don't know how to read plans, and most designers don't know how to explain them. so the plan gets approved without being understood, and the consequences appear on site — at which point they are expensive to fix.</p>
<h2>the five spatial mistakes we see most often</h2>
<h3>01 — the living room that doesn't circulate</h3>
<p>furniture is placed against walls to "maximise space." the result is a room where all circulation cuts through the seating area. no one can sit without watching someone else walk past them. the fix is to pull furniture away from walls and create a defined path around the seating zone — which is counter-intuitive but correct.</p>
<h3>02 — the bedroom door that dominates the room</h3>
<p>a door placed on the wrong wall means the first thing you see entering a bedroom is either the bathroom door or the wardrobe — not the bed. the bed should be the visual anchor. the door's position should be chosen to make that true.</p>
<h3>03 — the kitchen with no landing space</h3>
<p>counter space is treated as an afterthought. the hob sits next to a wall with six inches of space on each side. landing space — the counter immediately adjacent to the hob and the sink — is the most critical real estate in a kitchen. it cannot be recovered with storage or styling.</p>
<h3>04 — the bathroom with no light</h3>
<p>the vanity is placed on the wall opposite the window (if there is a window), guaranteeing that the user stands in their own shadow every morning. light should come from the sides of the face, not from above or behind. vanity position follows light, not layout convention.</p>
<h3>05 — the open plan that is neither open nor private</h3>
<p>a wall is removed to "open up" the kitchen to the living room. the result is a space where cooking smells, cooking sounds, and kitchen mess are permanently visible from the sofa. open plan works when there is sufficient depth — typically 9 metres or more end to end — to create genuine separation between zones while maintaining visual connection. below that, it usually works better broken up.</p>
<h2>how we work with plans differently</h2>
<p>we begin every project with what we call a spatial audit. before any aesthetic decisions, we interrogate the existing or proposed plan against the occupant's life: how they wake up, how they cook, who comes to the house, where they work, how much they entertain. the plan is then drawn not as an arrangement of rooms but as a choreography of movement and use.</p>
<p>if you are reviewing a floor plan from your builder or your current designer and something feels wrong but you cannot articulate why — contact us. we will tell you exactly what is wrong and why it matters.</p>"""
    },
    {
        "slug":     "execution-is-design",
        "title":    "execution is design",
        "category": "execution",
        "excerpt":  "there is a persistent myth that design ends when drawings are submitted. it doesn't. design intent dies on site when no one is watching.",
        "content":  """<p>there is a persistent myth in the interior design industry that design ends when drawings are submitted. it doesn't.</p>
<p>design intent — the actual quality of what a space becomes — is determined on site, every day, in a thousand small decisions that no drawing can fully specify. the carpenter who interprets a joint detail. the painter who applies a colour three shades darker because the tin was already open. the electrician who routes a cable through the visible face of a wall because the hidden route was slightly longer. each of these is a design decision, made by someone other than the designer, in the absence of the designer.</p>
<h2>what disappears without supervision</h2>
<p>the tolerance in a drawer. the reveal on a frame. the junction between two materials at a corner. the alignment of a light fitting with a piece of furniture below it. none of these appear on drawings at a scale a contractor can use. they are discovered on site, resolved on site — or not resolved, and lived with forever.</p>
<p>the work that makes a space feel finished — genuinely finished, not just complete — is invisible by definition. it is the absence of the things that would have gone wrong.</p>
<h2>why most studios don't stay on site</h2>
<p>site supervision is expensive and time-consuming. a designer who is present three days a week for eight months is a designer who cannot take another full project. so most studios do not do it. they issue drawings, attend occasional visits, and manage the relationship remotely. the result is that execution quality is determined entirely by the contractor — whose incentives are completion and margin, not design intent.</p>
<h2>what we do differently</h2>
<p>we consider execution to be part of the design process, not a phase that follows it. every material junction, every lighting position, every piece of joinery is reviewed on site before it is installed permanently. we issue written site notes after every visit. we are present at critical moments: when ceilings go up, when joinery is fitted, when finishes are applied.</p>
<p>this is not how all studios work. it is, we believe, the only way to produce spaces that match the drawings. if you have worked with a designer who disappeared after the drawings phase, you know what we mean. <a href="https://www.indevastudio.com/#contact">start a project</a> with us and experience the difference.</p>"""
    },
    {
        "slug":     "perfection-is-the-enemy-of-comfort",
        "title":    "perfection is the enemy of comfort",
        "category": "philosophy",
        "excerpt":  "the most uncomfortable spaces we've encountered are the most perfectly finished. when everything is controlled, nothing is human.",
        "content":  """<p>the most uncomfortable spaces we have encountered are the most perfectly finished.</p>
<p>everything in alignment. every surface pristine. every object in its designated position. these are rooms that communicate one thing above all: do not touch anything.</p>
<h2>the paradox of the perfect room</h2>
<p>a room that is too perfect is a room without character. it is a room that has been designed to be photographed, not inhabited. it looks correct at 10am on a saturday with no one in it. it looks wrong the moment a person sits down with a cup of tea, puts a book on the side table, leaves a jacket on a chair.</p>
<p>the problem is not perfectionism itself — it is perfectionism applied to the wrong things. precise tolerances in joinery, accurate lighting levels, correctly specified materials: these are worth obsessing over. the position of a single vase: this is not.</p>
<h2>what comfort actually requires</h2>
<p>comfort requires room to breathe. it requires the possibility of imperfection. a sofa that can be sat on deeply, not perched at its edge. a surface where a book can be placed without it looking wrong. a rug that can be slightly askew without disturbing the room. these are not failures of design — they are its success.</p>
<p>the spaces that feel most deeply comfortable — that you want to return to, that you do not want to leave — are the spaces that have been designed for human use rather than human observation. they have warmth in their materials. texture that invites touch. light that can be changed with the time of day and the mood of the occupant.</p>
<h2>what we design for</h2>
<p>we design for the moment after the photographs are taken. for a tuesday evening in january, the second year of living in a space, with dirty dishes in the kitchen and shoes by the door. a room that is still beautiful then is a room that was correctly designed. our philosophy is built on this: clarity, not perfection. intention, not control. <a href="https://www.indevastudio.com/#about">our design process</a> reflects this from the first brief.</p>"""
    },
    {
        "slug":     "budget-truth-in-indian-interiors",
        "title":    "budget truth in indian interiors",
        "category": "india market",
        "excerpt":  "the gap between a client's stated budget and their actual expectations is the most dangerous distance in indian interior design.",
        "content":  """<p>the gap between a client's stated budget and their actual expectations is the most dangerous distance in indian interior design.</p>
<p>it is not a dishonesty gap. clients do not lie about what they want to spend. they genuinely believe their number is right. the problem is that the number comes before the brief — before any understanding of what the space actually requires, what materials actually cost, what quality actually looks like in person versus in photographs.</p>
<h2>how the gap forms</h2>
<p>a client sees a completed apartment on instagram. it looks like their ₹25 lakh budget. they do not know that the apartment was photographed with rented furniture, that the joinery cost alone was ₹18 lakh, that the lighting was designed by a specialist who charged ₹3 lakh. the photograph compresses all of this into a single image that looks achievable.</p>
<p>then they meet a designer and share their budget. the designer either agrees to it — knowing it is insufficient and planning to manage the gap as the project progresses — or they tell the truth and lose the client to someone who agrees. neither outcome serves the client.</p>
<h2>what a realistic budget actually looks like in india in 2026</h2>
<p>for a 2bhk apartment in delhi ncr, full-scope interior design and execution — meaning real furniture, proper joinery, quality finishes, and professional lighting — starts at ₹45–55 lakh at the mid-premium level. at the luxury level, with imported materials, custom furniture, and a complete lighting system, it starts at ₹80 lakh.</p>
<p>these numbers include the designer's fees. they do not include appliances, heavy civil work, or air conditioning.</p>
<p>if a designer quotes you ₹20 lakh for a complete 2bhk fit-out, one of three things is true: the quality will be significantly lower than you expect, there will be significant cost additions mid-project, or the designer is not accounting for something important.</p>
<h2>how we handle budget conversations</h2>
<p>we tell clients the truth in the first meeting. we share what their stated budget can realistically achieve, and what it cannot. if there is a gap between what they want and what they can spend, we explain the options: reduce scope, extend timeline, or revise the brief.</p>
<p>this conversation is uncomfortable. it is also the only way to begin a project correctly. <a href="https://www.indevastudio.com/#contact">start a project</a> with us — the first conversation costs nothing, and it will save you significantly more than it feels like at the time.</p>"""
    },
    {
        "slug":     "how-we-protect-design-on-site",
        "title":    "how we protect design on site",
        "category": "process",
        "excerpt":  "every project has a moment when the contractor suggests a shortcut, the vendor substitutes a material, or the client approves a change without understanding the consequence.",
        "content":  """<p>every project has a moment when the contractor suggests a shortcut.</p>
<p>a tile becomes unavailable mid-project and the vendor proposes a substitute that is "basically the same." the client approves it on the phone without seeing it in context. the substitute tile has a slightly different undertone. in isolation it looks fine. next to the floor, the wall, the joinery, it does not. the room no longer works in the way it was designed to work.</p>
<p>this is not an extreme case. it is the ordinary texture of construction. managing it is what site supervision actually means.</p>
<h2>our site protection protocol</h2>
<p>at indéva studio, every site visit produces a written record — a site note that documents what was reviewed, what was approved, what requires resolution, and what the deadline is for each item. this document is shared with the client and the contractor within 24 hours of the visit.</p>
<p>the result is a project record that tracks every decision chronologically. when a question arises about why something was done a particular way, the answer is in the notes. when a contractor claims a change was approved verbally, the record shows whether it was or wasn't.</p>
<h2>the three moments that matter most</h2>
<h3>material approval</h3>
<p>no material is installed without a physical sample reviewed in context — in the actual space, in the actual light, against the other materials it will sit with. we do not approve materials from catalogues or photographs.</p>
<h3>joinery fitment</h3>
<p>joinery is reviewed at the point of installation, before it is fixed permanently. this is the only moment when reveals, tolerances, and alignments can be corrected without demolition. we are present for all joinery fitment.</p>
<h3>final finish review</h3>
<p>painted surfaces, polished stone, sealed timber — all are reviewed under the actual lighting conditions the space will be used in, before the client's first visit. issues found at this stage can still be corrected. issues found at handover cannot.</p>
<h2>what this means for you</h2>
<p>the quality of a completed space is a direct function of how frequently and how rigorously the designer is present during construction. if your current designer visits once a month, the space will look like a space that was visited once a month. <a href="https://www.indevastudio.com/#about">learn more about our process</a> or <a href="https://www.indevastudio.com/#contact">start a project</a> to see the difference.</p>"""
    },
    {
        "slug":     "why-we-refuse-to-start-with-moodboards",
        "title":    "why we refuse to start with moodboards",
        "category": "architecture",
        "excerpt":  "moodboards are a sedative. they create the feeling of progress without any of the substance.",
        "content":  """<p>moodboards are a sedative. they create the feeling of progress without any of the substance.</p>
<p>a client leaves a moodboard presentation feeling excited. they have seen images they like. they have a sense of where the project might go. they have, in some meaningful sense, been entertained. what they have not done is made a single design decision — because moodboards do not require decisions. they require reactions. reacting and deciding are not the same thing.</p>
<h2>what moodboards actually communicate</h2>
<p>a moodboard communicates aesthetic territory — a general temperature, a rough palette, a broad material vocabulary. this is useful information. the problem is that it is communicated at the beginning of a project, before anyone knows what the space actually requires, before the spatial logic has been established, before the brief has been tested against reality.</p>
<p>the result is that the client approves an aesthetic direction for a space they do not yet understand. then the spatial planning begins, and the space turns out to require different materials, different proportions, different light — and the approved aesthetic direction fights every decision that follows.</p>
<h2>what we start with instead</h2>
<p>we start with the plan.</p>
<p>before we show anyone a single image, we understand who lives in the space, how they move through it, where they wake up, how they cook, who comes to the house, what they do in the evenings. we draw the spatial logic first — the circulation, the proportions, the light, the relationships between rooms.</p>
<p>material and aesthetic decisions follow from the spatial logic. they do not precede it. the space tells us what it needs — in terms of warmth, weight, texture — and we respond. this is why our projects do not look like the moodboards from other studios. they look like themselves.</p>
<h2>when we do use reference images</h2>
<p>we use reference images as a communication tool — to confirm that client and designer mean the same thing when they say "warm" or "restrained" or "not minimal." images are a shared vocabulary for aligning expectations. they are not a design brief. we use them accordingly. to <a href="https://www.indevastudio.com/#about">learn more about our design process</a> or to <a href="https://www.indevastudio.com/#contact">start a project</a> that begins with substance rather than surface, get in touch.</p>"""
    },
    {
        "slug":     "light-is-not-a-finish-it-is-the-space",
        "title":    "light is not a finish — it is the space",
        "category": "design theory",
        "excerpt":  "most designers treat lighting as the last decision. we treat it as the first. the way light enters, bounces, and dissolves determines whether a room breathes or suffocates.",
        "content":  """<p>most designers treat lighting as the last decision. the space is designed, the materials are selected, the furniture is chosen — and then, at the end, someone asks: what lights do we put in?</p>
<p>we treat it as the first.</p>
<h2>why light is structural</h2>
<p>the way light enters a room, bounces off surfaces, and dissolves at its edges determines the fundamental quality of the space. it is not decoration applied to a room that already exists. it is part of what makes the room. a space with good bones and poor lighting feels wrong. a space with modest bones and excellent lighting feels right. the light is not a feature — it is the atmosphere.</p>
<h2>what we mean by light strategy</h2>
<p>a lighting strategy is not a schedule of fixtures. it is a map of how the room should feel at different times of day and for different uses. a living room at 11am should feel different to the same room at 8pm. a kitchen during cooking should be lit differently to the same kitchen during breakfast. lighting that cannot do this — that has a single state — is lighting that has been installed rather than designed.</p>
<p>the strategy begins with the natural light: where it enters, how it moves through the day, what surfaces it hits and at what angles. artificial light is then designed to extend and complement the natural light — not to replace it.</p>
<h2>the three layers of good lighting</h2>
<h3>ambient</h3>
<p>the base level. it establishes the general illumination of the room. it should be dimmable, controllable, and warmer than most people expect — 2700–3000K for living spaces.</p>
<h3>task</h3>
<p>functional light for specific activities: reading, cooking, working. it should be bright enough without creating harsh shadows or reflecting off screens.</p>
<h3>accent</h3>
<p>light that creates depth, draws attention to materials and objects, and establishes the character of the space. wall-washing, grazing, picture lighting — these are the decisions that separate a well-designed room from a lit room.</p>
<h2>the hidden cost of getting it wrong</h2>
<p>bad lighting cannot be fixed without opening ceilings and walls. it is not a matter of swapping out a fitting. if the conduit is in the wrong position, the downlight is in the wrong position — permanently. this is why lighting must be resolved at the drawing stage, before any construction begins. we always include a complete lighting schedule and control strategy in our drawings package.</p>
<p>to discuss a project where lighting is designed from day one, <a href="https://www.indevastudio.com/#contact">start a project</a> with us.</p>"""
    },
    {
        "slug":     "the-honest-material-stone-over-stone-effect",
        "title":    "the honest material: why we prefer stone over stone-effect",
        "category": "design theory",
        "excerpt":  "imitation materials are a tax on your future self. they age poorly, feel hollow underfoot, and eventually betray themselves. honesty in material selection is not idealism — it is long-term economics.",
        "content":  """<p>imitation materials are a tax on your future self.</p>
<p>vitrified tiles that look like marble. laminate that looks like oak. pvc profiles that look like metal. each of these works in a photograph. each of these works for two to three years in situ. then something happens — a chip, a scratch, a fade, a delamination — and the imitation reveals itself. at which point it looks like what it is: a thing pretending to be something else.</p>
<h2>why imitation materials fail over time</h2>
<p>stone ages. it develops a patina. scratches on a marble floor become part of its character over twenty years. a crack, properly repaired, adds history rather than damage. the material earns its presence through use.</p>
<p>stone-effect materials do not age. they degrade. a scratch on a vitrified tile exposes the base material — which is a different colour, a different texture, and reads immediately as damage. there is no way for the material to absorb use; it can only be worn down by it.</p>
<h2>the economics of honesty</h2>
<p>the upfront cost of stone over stone-effect is real. a marble floor costs more than a vitrified floor. over a fifteen-year period, the calculation is different. the marble floor will not need replacing. it may need periodic polishing. its value — aesthetic and financial — will increase, not decrease. the vitrified floor will need replacing at some point. when it is replaced, all the work around it — the skirting, the transitions, the thresholds — must be redone.</p>
<p>this is before considering the environmental cost of manufacturing and disposing of imitation materials at scale.</p>
<h2>where we make exceptions</h2>
<p>we do not apply this principle rigidly. there are contexts where imitation materials are the correct choice — high-traffic commercial spaces where budget constraints are real and replacement cycles are built into the business model, for example. or bathrooms where the thermal performance of a tile matters more than its origin.</p>
<p>the principle is not "always use the original." it is "understand what the material is doing and choose accordingly." when a material is chosen because it looks like something more expensive, that is not a design decision. it is a negotiation with the budget that the client will pay for later. <a href="https://www.indevastudio.com/#contact">start a project</a> with us to discuss materials from first principles.</p>"""
    },
    {
        "slug":     "what-a-good-brief-actually-looks-like",
        "title":    "what a good brief actually looks like",
        "category": "process",
        "excerpt":  "the brief is not a wish list. it is a document of constraints — of what cannot move, what must function, and who will inhabit the space day after day.",
        "content":  """<p>the brief is not a wish list. it is a document of constraints.</p>
<p>the most useful brief a client can bring to a first meeting is not a list of things they like. it is a list of things that cannot be compromised: the child's bedroom must be close to the master bedroom. the kitchen must be visible from the living room. there must be somewhere to put shoes at the front door. the study must be separated from the rest of the house when the door is closed.</p>
<p>these constraints are the actual brief. everything else is preference — and preferences change. constraints do not.</p>
<h2>what most clients bring instead</h2>
<p>most clients arrive with a collection of saved images, a rough budget, and a sense of aesthetic direction. this is useful raw material. it is not a brief. the designer's job is to interrogate these inputs — to find the constraints hiding inside the preferences — and to produce a brief that can guide the project through the inevitable moments when budget, site conditions, or structural realities force decisions to be made.</p>
<h2>the questions that produce a real brief</h2>
<p>who lives in this space, and what is their daily routine? this question is the most important one. a couple with a six-month-old child has different requirements to the same couple five years later. a person who works from home has different requirements to a person who commutes. the brief should reflect the life that will be lived in the space — not an imagined life, the actual one.</p>
<p>what is the single thing that, if wrong, would make you unhappy with the project? this question surfaces the client's real priority, which is often different to what they have said the priority is. it also gives the designer a clear mandate for where to concentrate quality.</p>
<p>what has not worked in your current home, and why? the answer to this question is more valuable than any inspiration reference. it tells the designer what the space must not do.</p>
<h2>how we run the briefing process</h2>
<p>our briefing process takes two sessions. the first is open: we listen and record. the second is structured: we test what we heard against the reality of the space and the budget. by the end of the second session, we have a written brief that both parties have signed off on. the brief is a living document — it is revised when reality requires it, and every revision is documented. <a href="https://www.indevastudio.com/#contact">start a project</a> with a brief that will actually drive the design.</p>"""
    },
    {
        "slug":     "the-scale-problem-small-rooms",
        "title":    "the scale problem: why small rooms feel smaller after renovation",
        "category": "spatial logic",
        "excerpt":  "furniture that is three inches too large, a ceiling dropped two inches too low, a tile with the wrong joint width — these micro-decisions compound into spaces that feel diminished rather than designed.",
        "content":  """<p>furniture that is three inches too large. a ceiling dropped two inches too low. a tile with a joint width that reads as busy in a small space. these are not aesthetic decisions. they are scale decisions, and they compound.</p>
<p>the paradox of small room renovation is that it often makes the room feel smaller. not because the renovation was badly executed — it may have been executed precisely as intended — but because the scale decisions were wrong.</p>
<h2>why scale is harder than style</h2>
<p>style is visible. a client can look at a sample board, identify whether they like the direction, and provide feedback. scale is invisible until it is installed. a sofa that looks correct in a showroom, in a showroom-height ceiling with showroom proportions, looks large in a 2.8-metre ceiling apartment. the showroom was designed to make the sofa look right. the apartment was not.</p>
<p>this is why scale decisions must be made in the context of the actual space — with actual measurements, actual ceiling heights, actual proportions — and not in a showroom, a catalogue, or a rendering.</p>
<h2>the scale decisions that matter most</h2>
<h3>ceiling interventions</h3>
<p>a false ceiling that drops a room from 2.8 to 2.5 metres does not just lose 300mm. it changes the fundamental character of the room. in a 3-metre-wide bedroom, a 2.5-metre ceiling begins to feel low. in a 4-metre-wide living room, the same ceiling is fine. the decision to drop a ceiling must be taken with full awareness of the room's plan dimensions.</p>
<h3>furniture footprint</h3>
<p>the floor is the most legible surface in a room. how much of it is covered determines how much space the room feels it has. in small rooms, the goal is to maximise visible floor area — which means furniture with smaller footprints and, where possible, legs rather than bases. a sofa on legs reads as lighter than a sofa on a plinth base, even if the dimensions are identical.</p>
<h3>tile and floor pattern scale</h3>
<p>a large-format tile in a small room creates fewer grout lines, which reads as more spacious. a small tile in a large room reads as busy. the rule is not absolute — sometimes a small tile is the correct choice for material or texture reasons — but scale must be a conscious input to the decision.</p>
<h2>the discipline required</h2>
<p>getting scale right requires a discipline that is separate from aesthetic judgement. it requires measuring, modelling, and occasionally being willing to override a preference — the client loves a particular sofa, but the sofa is too large for the room — on the basis of what the space can and cannot absorb. this is part of our job, and one of the things we are most direct about. <a href="https://www.indevastudio.com/#contact">start a project</a> where scale is taken seriously from day one.</p>"""
    },
    {
        "slug":     "choosing-a-contractor-in-india",
        "title":    "choosing a contractor in india: what we look for and why",
        "category": "india market",
        "excerpt":  "the contractor is not a vendor — they are a collaborator who will either protect or destroy three months of design work. we have a rubric. here it is, in full.",
        "content":  """<p>the contractor is not a vendor. they are a collaborator who will either protect or destroy three months of design work in four months of construction.</p>
<p>the quality of a completed interior is determined as much by the contractor as by the designer. the most precise drawings in the world, executed by a contractor who does not understand them or does not care, produce a poor result. conversely, a good contractor with average drawings will produce something better than a poor contractor with excellent ones.</p>
<h2>what most clients use to evaluate contractors</h2>
<p>most clients evaluate contractors on two criteria: price and previous work photographs. both of these are inadequate.</p>
<p>price tells you what the contractor is willing to do the job for. it does not tell you how they will manage cost additions mid-project (all construction projects have additions). it does not tell you whether their rate includes adequate labour, adequate material, and an adequate margin — or whether it assumes you will pay for shortfalls later.</p>
<p>photographs tell you what the space looked like in a photograph, on the day the photograph was taken. they do not tell you what the space looked like six months later. they do not tell you what the working relationship was like.</p>
<h2>our contractor evaluation rubric</h2>
<h3>documentation literacy</h3>
<p>can they read our drawings? do they understand what is specified and what is deferred? a contractor who cannot engage with documentation cannot be held accountable to it. we assess this by reviewing a drawing with them in the first meeting and asking specific questions about it.</p>
<h3>subcontractor relationships</h3>
<p>a contractor is as good as their subcontractors. who does their tile work? who does their electrical? who does their painting? we ask for names, and we check them. a contractor with established relationships with reliable subcontractors is a significantly lower risk than one who assembles a team per project.</p>
<h3>site management</h3>
<p>we visit an active site they are running. not a completed site — an active one. how is the material stored? how is the waste managed? who is the site supervisor and how do they communicate? is the site clean? a contractor who runs a clean site runs a disciplined site.</p>
<h3>communication</h3>
<p>do they respond to messages? within what timeframe? are they direct when there is a problem, or do they wait for the client to discover it? the communication pattern in the evaluation phase will be the communication pattern in the project.</p>
<h2>the contractors we work with</h2>
<p>over the course of our projects, we have developed relationships with contractors in delhi, gurgaon, noida, and beyond whose work we trust. these relationships are one of the practical benefits of working with us. <a href="https://www.indevastudio.com/#contact">start a project</a> and we will discuss who is right for your scope.</p>"""
    },
    {
        "slug":     "colour-follows-conviction-not-trends",
        "title":    "colour follows conviction, not trends",
        "category": "philosophy",
        "excerpt":  "a palette chosen from a trend report is a palette without a reason. colour in a well-designed interior is a consequence of the space, the occupant, and the light — never the starting point.",
        "content":  """<p>a palette chosen from a trend report is a palette without a reason.</p>
<p>every year the industry produces lists of colours that will define the coming year. sage green. warm terracotta. deep navy. dusty rose. these are real colours, and some of them are beautiful. the problem is not the colours. the problem is the process — the idea that colour can be selected from a list, independently of the space it will inhabit, the light it will be seen in, and the person who will live with it.</p>
<h2>what colour is actually responding to</h2>
<p>colour in a well-designed interior is a consequence. it is the answer to questions that have been asked and answered: where does the light come from and what colour temperature is it at different times of day? what are the fixed elements — the floor, the ceiling, the window frames — that the colour will live alongside? what is the occupant's relationship with colour — do they find dark spaces enveloping or oppressive? what is the longevity requirement — a colour that works for three years and can be repainted, or one that must work for fifteen?</p>
<p>these questions produce a palette that is specific to the space and the person. it does not look like any trend report because it does not come from a trend report. it comes from the room.</p>
<h2>why trend palettes fail in Indian spaces</h2>
<p>the light in India is different. the quality of natural light in delhi in may is different to the light in a scandinavian interior in december, which is where many trend palettes are tested. a colour that photographs beautifully in a grey northern light can feel harsh, oversaturated, or simply wrong in the strong, warm, raking light of an Indian afternoon.</p>
<p>this is not a criticism of trend palettes — it is a technical observation about light and colour science. a colour recommendation must be tested in the actual light conditions of the actual space. we test every significant colour selection under three conditions: morning light, afternoon light, and artificial evening light. a colour that works in all three conditions is a colour worth specifying.</p>
<h2>the one colour rule we follow absolutely</h2>
<p>never select a colour from a small sample in isolation. always view it against the other materials it will sit with — the floor, the ceiling, the joinery, the fabric — and in a piece large enough to understand how it will read at room scale. a colour chip that looks perfect in isolation has misled more projects than any other single factor in interior design. <a href="https://www.indevastudio.com/#contact">start a project</a> where colour is treated as a consequence, not a starting point.</p>"""
    },
]


def render_editorial_page(slug, title, category, excerpt, content):
    canonical = f"{ORIGIN}/insights/{slug}/"
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — indéva studio</title>
<meta name="description" content="{excerpt[:155]}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="article">
<meta property="og:url" content="{canonical}">
<meta property="og:title" content="{title} — indéva studio">
<meta property="og:description" content="{excerpt[:155]}">
<meta property="og:image" content="{ORIGIN}/og-default.jpg">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{title} — indéva studio">
<meta name="twitter:image" content="{ORIGIN}/og-default.jpg">
<script type="application/ld+json">
{{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "{title}",
  "description": "{excerpt[:250]}",
  "url": "{canonical}",
  "author": {{
    "@type": "Organization",
    "name": "indéva studio",
    "url": "{ORIGIN}"
  }},
  "publisher": {{
    "@type": "Organization",
    "name": "indéva studio",
    "logo": {{
      "@type": "ImageObject",
      "url": "{ORIGIN}/favicon-32x32.png"
    }}
  }},
  "mainEntityOfPage": "{canonical}"
}}
</script>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=DM+Mono:wght@300;400&display=swap" rel="stylesheet">
<style>
:root{{--black:#0a0a0a;--white:#f0ebe3;--gold:#b89a6a;--mono:'DM Mono',monospace;--serif:'Cormorant Garamond',Georgia,serif;--line:rgba(240,235,227,.08);}}
*{{margin:0;padding:0;box-sizing:border-box;}}
body{{background:var(--black);color:var(--white);font-family:var(--serif);font-weight:300;line-height:1.7;font-size:18px;-webkit-font-smoothing:antialiased;}}
a{{color:var(--gold);text-decoration:none;}}a:hover{{text-decoration:underline;}}
nav{{position:sticky;top:0;background:var(--black);border-bottom:1px solid var(--line);padding:18px 48px;display:flex;justify-content:space-between;align-items:center;z-index:10;}}
.logo{{font-family:var(--serif);font-size:1.2rem;color:var(--white);}}
.nav-links{{display:flex;gap:32px;}}
.nav-links a{{font-family:var(--mono);font-size:0.6rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--white);}}
.back{{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--gold);padding:48px 48px 0;display:block;}}
article{{max-width:760px;margin:0 auto;padding:40px 48px 120px;}}
.meta{{font-family:var(--mono);font-size:0.58rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);margin-bottom:40px;}}
h1{{font-family:var(--serif);font-size:clamp(2rem,4vw,3.2rem);font-weight:300;line-height:1.1;letter-spacing:-0.015em;margin-bottom:32px;}}
h2{{font-family:var(--serif);font-size:clamp(1.4rem,2.5vw,2rem);font-weight:300;margin:48px 0 16px;}}
h3{{font-family:var(--serif);font-size:1.2rem;font-weight:400;margin:32px 0 12px;}}
p{{margin-bottom:20px;font-size:1rem;}}
ul{{margin:0 0 20px 20px;}}li{{margin-bottom:8px;}}
blockquote{{border-left:2px solid var(--gold);padding:12px 24px;margin:24px 0;font-style:italic;color:rgba(240,235,227,.85);}}
.cta-block{{border:1px solid rgba(184,154,106,.3);padding:40px;margin:48px 0 0;text-align:center;}}
.cta-block h3{{margin-top:0;font-size:1.4rem;}}
.cta-block a{{font-family:var(--mono);font-size:0.65rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--black);background:var(--gold);padding:14px 28px;display:inline-block;margin-top:16px;text-decoration:none;}}
footer{{border-top:1px solid var(--line);padding:40px 48px;font-family:var(--mono);font-size:0.58rem;letter-spacing:0.12em;color:rgba(240,235,227,.5);display:flex;justify-content:space-between;}}
@media(max-width:768px){{
  nav{{padding:14px 20px;}} .nav-links{{display:none;}}
  .back{{padding:32px 20px 0;}} article{{padding:32px 20px 80px;}}
  footer{{padding:32px 20px;flex-direction:column;gap:8px;}}
}}
</style>
</head>
<body>
<nav>
  <a href="{ORIGIN}/" class="logo">indéva studio</a>
  <div class="nav-links">
    <a href="{ORIGIN}/">home</a>
    <a href="{ORIGIN}/#about">about</a>
    <a href="{ORIGIN}/#services">services</a>
    <a href="{ORIGIN}/#projects">projects</a>
    <a href="{ORIGIN}/insights/">insights</a>
  </div>
</nav>

<a href="{ORIGIN}/insights/" class="back">← back to insights</a>

<article>
  <div class="meta">{category} · indéva studio</div>
  <h1>{title}</h1>
  {content}
  <div class="cta-block">
    <h3>ready to start a project?</h3>
    <p>our design consultants are available for a complimentary discovery session.</p>
    <a href="{ORIGIN}/#contact">start a project ↗</a>
  </div>
</article>

<footer>
  <a href="{ORIGIN}/" style="color:inherit;">indéva studio</a>
  <span>luxury interior design · new delhi, india</span>
</footer>
</body>
</html>
"""


def main():
    created = 0
    for post in EDITORIAL_POSTS:
        slug = post["slug"]
        out_dir = INSIGHTS / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        out_path = out_dir / "index.html"
        if out_path.exists():
            print(f"  skip (already exists): {slug}")
            continue
        html = render_editorial_page(
            slug     = slug,
            title    = post["title"],
            category = post["category"],
            excerpt  = post["excerpt"],
            content  = post["content"],
        )
        out_path.write_text(html)
        print(f"  created: insights/{slug}/index.html")
        created += 1

    print(f"\ndone — {created} editorial pages created, "
          f"{len(EDITORIAL_POSTS)-created} already existed")
    print(f"\nnext steps:")
    print(f"  git add insights/")
    print(f"  git commit -m 'fix: create real HTML pages for editorial blog posts'")
    print(f"  git push")

if __name__ == "__main__":
    main()
