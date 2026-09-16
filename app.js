/* Extracted from inline <script> blocks in index.html — logic unchanged, delivery externalized for caching + smaller initial HTML payload. */

/* ---- originally inline at line 3788 ---- */
    /* Drag-to-scroll for project carousel */
    (function() {
      var track = document.getElementById('projectsTrack');
      if (!track) return;
      var isDragging = false, startX = 0, scrollLeft = 0;
      track.addEventListener('mousedown', function(e) {
        isDragging = true;
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
        track.style.animationPlayState = 'paused';
      });
      document.addEventListener('mouseup', function() {
        if (isDragging) {
          isDragging = false;
          setTimeout(function(){ track.style.animationPlayState = ''; }, 2000);
        }
      });
      track.addEventListener('mousemove', function(e) {
        if (!isDragging) return;
        e.preventDefault();
        var x = e.pageX - track.offsetLeft;
        var walk = (x - startX) * 1.5;
        track.style.transform = 'translateX(' + (-walk) + 'px)';
      });
    })();
    

/* ---- originally inline at line 5896 ---- */
// ══ ARTICLE DATA
var articles = {
  floorplans: {
    cat: 'spatial logic',
    title: 'why most floor plans fail',
    date: 'february 2025',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
    lead: 'the plan is not the starting point of design — it is the design. most projects go wrong before a single material is selected, because the spatial logic was never interrogated.',
    body: `<p class="article-text">in fourteen years of practice, we have seen the same failure repeat itself across hundreds of residential and commercial projects. a client is handed a beautifully rendered perspective — warm lighting, expensive furniture, a tasteful palette — and they approve it. then construction begins, and six months later, something is wrong. not just cosmetically wrong. fundamentally, spatially wrong. the room doesn't work. it never worked. the problem was in the plan.</p>
    <h3 class="article-subhead">the plan is the design</h3>
    <p class="article-text">there is a dangerous habit in the industry of treating the floor plan as a utilitarian document — a grid of walls and doors that simply organises space. in reality, the plan is the most consequential design decision you will make. everything that follows — circulation, light, proportion, acoustics, the relationship between rooms — is an outcome of the plan. if the plan is wrong, no amount of beautiful material or lighting will fix it.</p>
    <p class="article-text"><strong>we interrogate plans with a single, deceptively simple question: how will someone actually live in this?</strong> not how will it photograph. not how will it render. how will a person wake up, move through morning, receive guests, argue with a partner, work late, cook at midnight. a plan that cannot answer these questions has not been designed — it has been arranged.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"a plan that cannot answer how someone will live in it has not been designed — it has been arranged."</div></div>
    <h3 class="article-subhead">the five fatal errors</h3>
    <p class="article-text">the most common planning failures we encounter fall into five categories. first, dead circulation — corridors that serve no secondary purpose, or layouts that require crossing a bedroom to access a bathroom. second, inadequate threshold design — transitions between spaces that have no spatial weight, making the home feel like a sequence of rooms rather than an experience. third, light blindness — plans that ignore the path of natural light entirely, placing living spaces on the wrong orientation. fourth, acoustic naivety — bedrooms sharing walls with kitchens or utility spaces. fifth, the tyranny of the square plan — forcing a rectilinear grid onto a site that has no reason to be rectilinear.</p>
    <h3 class="article-subhead">how we plan differently</h3>
    <p class="article-text">at indé, we begin every project with what we call a spatial audit. before touching a pencil, we map how the client actually inhabits their days. we walk through a hypothetical morning, afternoon, and evening. we identify friction points in their current space. we ask where they argue, where they retreat, where they find calm. this gives us a human map — before we draw a single wall. only when we have that map do we begin to design the plan. and we design it as the primary design act, not as a preliminary to it.</p>`
  },
  execution: {
    cat: 'execution',
    title: 'execution is design',
    date: 'january 2025',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    lead: 'there is a persistent myth that design ends when drawings are submitted. it doesn\'t. design intent dies on site when no one is watching.',
    body: `<p class="article-text">we often say that the best-designed project we ever built was never seen by anyone. not because it was private — it was a commercial office in south delhi. but because the design was executed with such precision that it disappeared into itself. no one noticed the joinery. no one remarked on the proportion of the reveals. nobody complimented the acoustic panels, which looked like decorative timber screens. everything just worked. that is the highest form of execution.</p>
    <h3 class="article-subhead">where design dies</h3>
    <p class="article-text">design intent is most vulnerable between the drawing and the site. in that gap lives every contractor shortcut, every material substitution, every structural compromise. a drawing shows a 3mm shadow gap; the carpenter is accustomed to 8mm gaps and considers 3mm impractical. a drawing specifies micro-cement; the vendor substitutes a product that looks similar but behaves entirely differently over time. a drawing shows a floating shelf detail; the structural engineer hasn't been consulted and the wall cannot carry the load.</p>
    <p class="article-text"><strong>each of these moments, individually, seems small. cumulatively, they destroy a project.</strong> what was designed is not what was built. and the client, who approved the renders and the materials, ends up in a space that has no relationship to what they were promised.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"execution is not the delivery of a drawing. it is the delivery of a design decision, made under real conditions, with real constraints."</div></div>
    <h3 class="article-subhead">our execution protocol</h3>
    <p class="article-text">at indé, we treat site visits not as supervision but as design acts. when a carpenter encounters a problem, we don't just solve the structural question — we ask what the design intent was, and whether the solution preserves it. when a material arrives and it doesn't match the sample, we reject it, regardless of schedule pressure. when a contractor suggests a shortcut, we evaluate it against the design principle it would compromise, not just the time or cost it would save.</p>
    <p class="article-text">this is not perfectionism. it is responsibility. we made a promise to a client when they approved the design. execution is how we honour it.</p>`
  },
  perfection: {
    cat: 'philosophy',
    title: 'perfection is the enemy of comfort',
    date: 'december 2024',
    readTime: '4 min read',
    img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80',
    lead: 'the most uncomfortable spaces we\'ve encountered are the most perfectly finished. when everything is controlled, nothing is human.',
    body: `<p class="article-text">there is a house in south mumbai that we visited three years ago at the invitation of a potential client. the previous designer had done technically impeccable work. every surface was flush. every joint was invisible. the lighting was engineered to mathematical precision. the furniture was arranged with absolute geometric order. it was, by every measurable standard, a perfect space. and it was completely uninhabitable.</p>
    <p class="article-text">the client told us they ate their meals in the kitchen because the dining room felt like a showroom. their children did their homework on the floor because sitting at the custom-designed desk felt like performing a task. guests sat stiffly and left early. the house had been designed to be looked at, not lived in.</p>
    <h3 class="article-subhead">the ten percent principle</h3>
    <p class="article-text"><strong>we call it the ten percent principle: every space we design deliberately leaves ten percent undone.</strong> not incomplete — undone. a rug that has been used enough to have a softened edge. a shelf where books are not arranged by height. a curtain panel that falls with a natural break rather than a tailored pleat. a wall that has a single, deliberate imperfection — a texture, an age, a mark of use.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"a room that is too perfect is a room without character. we leave space for the happy accident."</div></div>
    <h3 class="article-subhead">why this matters</h3>
    <p class="article-text">the logic is psychological. when a space signals perfection, it signals fragility. it communicates to the human body: do not touch, do not move, do not relax. the space asks to be preserved, not inhabited. and so the body remains alert, upright, cautious — which is the opposite of comfort.</p>
    <p class="article-text">a space that has texture, warmth, and the quiet evidence of a life lived communicates something different: this is yours. settle in. this is the difference between a hotel lobby and a home, between a showroom and a sanctuary. we design sanctuaries. imperfect, human, comfortable ones.</p>`
  },
  budget: {
    cat: 'india market',
    title: 'budget truth in indian interiors',
    date: 'november 2024',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
    lead: 'the gap between a client\'s stated budget and their actual expectations is the most dangerous distance in indian interior design.',
    body: `<p class="article-text">the most common reason interior projects fail in india is not poor design. it is not bad contractors. it is not material unavailability or site conditions. it is budget dishonesty — a phenomenon that occurs on both sides of the client-designer relationship, and that destroys projects before they begin.</p>
    <h3 class="article-subhead">the gap</h3>
    <p class="article-text">a client tells a designer their budget is ₹25 lakhs. the designer, eager to win the project, says yes. the design process begins. materials are specified. contractors are consulted. a month later, the real number emerges: ₹25 lakhs was the aspirational figure, the number the client hoped might be enough, not the number they had actually committed to spend. the real number is ₹18 lakhs. and what has been designed cannot be built for ₹18 lakhs.</p>
    <p class="article-text"><strong>this is not the client's fault, exactly.</strong> most clients don't know what interiors cost. they've seen projects in magazines and on instagram with no price tag. they've received quotations from three contractors with wildly different numbers. they have no calibration. so they state a number that feels reasonable to them, not a number grounded in knowledge.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"we tell clients what their budget can genuinely deliver — and we do it on the first meeting, before they fall in love with a design that doesn't fit."</div></div>
    <h3 class="article-subhead">what we do differently</h3>
    <p class="article-text">we tell clients what their budget can genuinely deliver. we do it on the first meeting, before a single sketch is drawn, before a mood board is prepared, before they fall in love with a design that doesn't fit. we break down the cost components — civil work, electrical, plumbing, joinery, loose furniture, lighting, soft furnishings — and we give them a realistic range for each. this is not a creative act. it is a fiduciary one. and it is the single most important thing we can do for a client.</p>
    <p class="article-text">the result is that our clients make better decisions. some realise their budget is insufficient and choose to phase the project. some realise they've been underestimating and actually have more flexibility. some realise the scope of the project needs to change. all of them make these decisions before they are committed to a design — which is exactly when they should make them.</p>`
  },
  protect: {
    cat: 'process',
    title: 'how we protect design on site',
    date: 'october 2024',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
    lead: 'every project has a moment when the contractor suggests a shortcut, the vendor substitutes a material, or the client approves a change without understanding the consequence.',
    body: `<p class="article-text">there is a phrase we have come to use internally that we think captures the reality of site work better than any methodology or process document: design is a negotiation that never ends. from the first drawing to the final snag list, every decision you made on paper will be challenged by reality, and your response to those challenges is the true measure of your design intent.</p>
    <h3 class="article-subhead">the three threats</h3>
    <p class="article-text">in our experience, design on site faces three distinct threats. the first is contractor economy — the tendency of contractors to substitute materials, simplify details, or skip processes when they believe the designer is not watching or will not notice. the second is client improvisation — the tendency of clients, who feel ownership of the site, to approve changes on the spot without understanding the design implication. the third is vendor substitution — the practice of vendors supplying alternative products when the specified product is unavailable, often without notification.</p>
    <p class="article-text"><strong>each of these threats has a specific counter.</strong> contractor economy is defeated by presence — site visits that are predictably unpredictable, so the contractor knows that any visit might inspect any detail. client improvisation is defeated by education — we spend time early in the project explaining why specific decisions were made, so clients have the context to evaluate proposed changes. vendor substitution is defeated by verification — we approve all materials on delivery, not at specification stage.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"design is a negotiation that never ends. your response to site challenges is the true measure of your design intent."</div></div>
    <h3 class="article-subhead">the documentation protocol</h3>
    <p class="article-text">we maintain a live site document for every project — a running log of every deviation from drawing, every approved change, every rejected substitution. this document serves two purposes. it creates accountability, because every deviation is recorded and attributed. and it creates a design memory — at handover, we can trace every decision back to its origin, which means we can explain to the client why every element of their space is the way it is. that transparency is, we believe, the foundation of trust in a design relationship.</p>`
  },
  moodboards: {
    cat: 'architecture',
    title: 'why we refuse to start with moodboards',
    date: 'september 2024',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    lead: 'moodboards are a sedative. they create the feeling of progress without any of the substance.',
    body: `<p class="article-text">we are often asked, at initial client meetings, if we can put together a moodboard — a visual reference document that gives the client a sense of the direction we might take. the question is understandable. clients want to see something early. they want to feel that the project has begun. and a moodboard is immediately visual, immediately legible, immediately shareable.</p>
    <p class="article-text">we always say no.</p>
    <h3 class="article-subhead">why not</h3>
    <p class="article-text">a moodboard, in the context of early design, is a sedative. it gives the client the sensation of progress — they have seen images, they have responded, a direction feels established — without any of the substance of progress. the site has not been measured. the brief has not been interrogated. the structural constraints are unknown. the budget has not been validated. nothing that is actually design-determining has been established. and yet the client has seen images and formed preferences, which will now bias every subsequent decision.</p>
    <p class="article-text"><strong>moodboards also outsource creative responsibility.</strong> when a designer shows a client a collection of images sourced from pinterest and houzz, the designer is essentially asking the client to design the project by proxy. the client selects what they like; the designer executes it. this is not design. this is a service transaction dressed in design language.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"moodboards outsource creative responsibility. we start with the plan, the site, the constraints, and the people — because that's where the actual design lives."</div></div>
    <h3 class="article-subhead">what we start with instead</h3>
    <p class="article-text">we start with questions. then we measure the space. then we analyse the site — its orientation, its context, its structural condition. then we have a second meeting where we discuss budget, timeline, and the real constraints of the project. only after all of this — which takes two to three weeks — do we produce any visual material. and when we produce visual material, it is design work: sketches, diagrams, spatial concepts. not images of other people's projects. ours.</p>
    <p class="article-text">this process is slower at the start. it requires patience from clients who are excited and want to see something immediately. but what it produces is something a moodboard never can: a design that actually belongs to the project, the site, and the people who will live in it.</p>`
  },
  light: {
    cat: 'design theory',
    title: 'light is not a finish — it is the space',
    date: 'august 2024',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=80',
    lead: 'most designers treat lighting as the last decision. we treat it as the first. the way light enters, bounces, and dissolves determines whether a room breathes or suffocates.',
    body: `<p class="article-text">there is a moment in every project walkthrough when we ask the client to stand still and simply look at the room in its existing state — before any intervention — and tell us what they feel. not what they think is wrong. not what furniture they want to change. what they feel. almost universally, the answer to a room that feels heavy, oppressive, or cold is not a colour problem or a furniture problem. it is a light problem.</p>
    <h3 class="article-subhead">the first design decision</h3>
    <p class="article-text">we design light before we design anything else. before a single material is considered, before the palette is discussed, before furniture layouts are sketched, we analyse how light enters and moves through a space across the full arc of a day. where does the morning sun land? what happens to the south-facing wall at 2pm in december versus june? where does natural light die before it reaches the back wall? these are the questions that determine every subsequent decision.</p>
    <p class="article-text"><strong>light is not a finish. it is the architecture of atmosphere.</strong> a room with perfect proportions and beautiful materials will feel wrong if the light is wrong. a room with modest proportions and simple materials will feel extraordinary if the light is right. this is not poetic — it is measurable. colour rendering index, lux levels, colour temperature: these are the invisible forces that determine whether a room is experienced as warm or cold, expansive or compressed, alive or inert.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"we design light before we design anything else. atmosphere is built before a single material is chosen."</div></div>
    <h3 class="article-subhead">the three mistakes</h3>
    <p class="article-text">the most common lighting errors we encounter are: uniform illumination, late specification, and trend dependency. uniform illumination — the practice of distributing recessed downlights across a ceiling grid — flattens every surface, removes shadow, and eliminates depth. rooms lit this way feel institutional, regardless of the materials. late specification — choosing lights from a catalogue after the design is resolved — means lights are selected for their appearance rather than their function. and trend dependency — choosing warm-toned bulbs because they're fashionable — ignores the specific characteristics of the space and its materials.</p>
    <h3 class="article-subhead">light as narrative</h3>
    <p class="article-text">we design lighting as a narrative. a room should have a hierarchy of light: a primary ambient source, secondary task or accent layers, and tertiary decorative points. each layer serves a different function, and the interplay between them creates the dimensionality that makes a room feel designed rather than lit. we also design for adaptability — a room used for working in the morning, dining in the evening, and entertaining at the weekend needs a lighting system that can move between these modes. this requires planning, not purchasing.</p>`
  },
  material: {
    cat: 'materials',
    title: 'the honest material: why we prefer stone over stone-effect',
    date: 'july 2024',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
    lead: 'imitation materials are a tax on your future self. they age poorly, feel hollow underfoot, and eventually betray themselves. honesty in material selection is not idealism — it is long-term economics.',
    body: `<p class="article-text">we are frequently asked, particularly in the mid-range residential market, whether we can use stone-effect tiles instead of stone, engineered wood instead of solid wood, or laminate instead of veneer. the question is usually framed as one of budget. and in some cases, it is. but in many cases, it is framed as a question of practicality, durability, or maintenance. and that is where we push back.</p>
    <h3 class="article-subhead">the economics of honesty</h3>
    <p class="article-text">a stone-effect porcelain tile, well selected, can be visually convincing in a photograph. in a render, it is indistinguishable. but a person who lives with it knows. they know it under bare feet — the hollow sound, the uniform temperature, the slight give that natural stone never has. they know it at the edges — the cut profile that reveals the tile body, which no amount of surface printing can disguise. they know it over time — the printed surface that chips differently from natural material, the grout that discolours faster because the tile lacks the micro-texture that helps it shed water.</p>
    <p class="article-text"><strong>the real cost of an imitation material is not its purchase price. it is its replacement cycle.</strong> a vitrified tile floor in a high-traffic hallway has a lifespan of eight to twelve years before it looks tired. a natural stone floor, properly sealed and maintained, lasts indefinitely. the capital cost is higher. the lifetime cost is lower. this is the arithmetic of material honesty.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"imitation materials are a tax on your future self. what you save on day one, you spend on year ten."</div></div>
    <h3 class="article-subhead">when imitation is acceptable</h3>
    <p class="article-text">we are not absolutists. there are contexts where imitation materials are entirely appropriate. in high-humidity environments — bathrooms, pool surrounds, outdoor applications — certain engineered materials perform better than their natural counterparts. in high-impact commercial settings, composite surfaces withstand abuse that stone cannot. in rental properties, where the investment horizon is short, the economics shift. our position is not that imitation materials are wrong. it is that they should be chosen consciously, with a clear understanding of their trade-offs — not as a default because they seem cheaper.</p>
    <h3 class="article-subhead">what material selection reveals</h3>
    <p class="article-text">material selection is a philosophical act. what a designer chooses reveals what they value: longevity or economy, authenticity or convenience, the tactile truth of a space or its photographic appearance. we value the former in each case. not because it is more expensive — often, it is not, over time — but because the people who live in a space deserve to inhabit something that does not lie to them.</p>`
  },
  client: {
    cat: 'process',
    title: 'what a good brief actually looks like',
    date: 'june 2024',
    readTime: '6 min read',
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=80',
    lead: 'the brief is not a wish list. it is a document of constraints — of what cannot move, what must function, and who will inhabit the space day after day.',
    body: `<p class="article-text">the brief is the most misunderstood document in the design process. clients believe it is a catalogue of desires — images collected, adjectives assembled, moods described. designers often treat it as a preliminary they move through quickly in order to get to the real work. both are wrong. the brief is the design. if you write a poor brief, you will design a poor space, no matter how skilled you are.</p>
    <h3 class="article-subhead">what a brief is not</h3>
    <p class="article-text">a brief is not an image board. a brief is not a list of adjectives: warm, modern, elegant, timeless. a brief is not a collection of references from instagram. a brief is not a statement of style preference. none of these things — individually or together — tell a designer what they need to know. they tell the designer what the client aspires to. they say nothing about how the client actually lives.</p>
    <p class="article-text"><strong>a brief is a document of constraints.</strong> it is the answer to the question: what cannot move? what must function, and for whom? what happens in this space on a tuesday morning, a friday night, a sunday afternoon? who will inhabit it — not abstractly, but specifically: their height, their habits, their sensitivities, their relationship to light, sound, privacy, and social density.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"a brief is a document of constraints. the designer's job is to make those constraints sing."</div></div>
    <h3 class="article-subhead">the brief we extract</h3>
    <p class="article-text">over the course of two discovery sessions, we extract what we call a human brief. the first session is conversational — we ask about daily routines, points of friction in the existing space, objects they refuse to give up, activities they wish they could do but currently cannot. the second session is spatial — we walk the existing space together and map its failures and its potential. only after both sessions do we produce the written brief.</p>
    <p class="article-text">our brief document covers: household composition and daily patterns; primary and secondary functions of every room; spatial priorities and non-negotiables; material sensitivities and preferences; maintenance expectations; budget parameters and phasing; and a timeline with fixed constraints. this document, when complete, is the frame within which every subsequent design decision is made. it is also the document against which every design decision is evaluated. a good brief makes the design accountable to something real.</p>`
  },
  scale: {
    cat: 'spatial logic',
    title: 'the scale problem: why small rooms feel smaller after renovation',
    date: 'may 2024',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&q=80',
    lead: 'furniture that is three inches too large, a ceiling dropped two inches too low, a tile with the wrong joint width — these micro-decisions compound into spaces that feel diminished rather than designed.',
    body: `<p class="article-text">one of the strangest complaints we receive from clients who have been through a renovation without us is this: the room looks finished, but it feels smaller. the contractor did everything correctly. the materials are fine. the proportions seem right. but standing in the room, something is wrong. it feels compressed, slightly airless, like a space that has been made rather than designed.</p>
    <h3 class="article-subhead">the compounding effect</h3>
    <p class="article-text">scale errors compound. individually, each one is invisible. together, they create an atmosphere of wrongness that is difficult to diagnose precisely because no single element is obviously wrong. a sofa that is 240cm in a room designed for 220cm. a ceiling dropped to 2.6m in a space that needed 2.8m. a tile laid at 300x300 in a room that needed 600x600 to feel generous. grout lines at 3mm where 1.5mm would have felt precise. curtains hung at ceiling height in a room where ceiling height ends at 2.7m and the window is 2.1m — an error that adds weight instead of drawing the eye up.</p>
    <p class="article-text"><strong>each of these decisions, made by a well-meaning contractor or an inexperienced designer, is a tax on the room's perceived size.</strong> the room has not changed dimensionally. but its psychological volume — the amount of space it feels like it contains — has been reduced.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"scale is not about dimensions. it is about the relationship between dimensions — and that relationship is felt, not measured."</div></div>
    <h3 class="article-subhead">how we work at scale</h3>
    <p class="article-text">we draw at 1:20, not 1:50. at 1:20, scale errors are visible — a sofa is not an abstract rectangle but a specific object with specific proportions relative to its room. we model in three dimensions early, not to generate pretty visuals, but to test proportional relationships: does the ceiling height feel right relative to the room's width? does the void above the kitchen cabinets compress or expand the space? does the flooring pattern create rhythm or noise?</p>
    <p class="article-text">we also have a simple rule: when in doubt, go larger. a tile that is too large for a space is far less damaging than a tile that is too small. furniture that is slightly oversized creates intimacy. furniture that is slightly undersized creates emptiness. the human eye is calibrated to feel scale relationships at a level below conscious awareness. trust it. and design to it.</p>`
  },
  contractor: {
    cat: 'india market',
    title: 'choosing a contractor in india: what we look for and why',
    date: 'april 2024',
    readTime: '7 min read',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
    lead: 'the contractor is not a vendor — they are a collaborator who will either protect or destroy three months of design work. we have a rubric. here it is, in full.',
    body: `<p class="article-text">the single most consequential decision in a residential interior project in india is not the designer you hire. it is the contractor you appoint. a great designer with a poor contractor will produce a mediocre project. a competent designer with a great contractor will produce something excellent. we have seen this play out dozens of times, and it has made us rigorous about contractor selection in a way that some clients initially find excessive.</p>
    <h3 class="article-subhead">what we look for first</h3>
    <p class="article-text">the first thing we assess in a potential contractor is not their portfolio. it is their workforce. specifically: do they have a consistent team of carpenters, painters, and civil workers, or do they hire on a project-by-project basis from the daily labour market? the answer to this question tells us everything. a contractor with a permanent team has accountability — the same workers show up every day, they develop institutional knowledge of the project, and the contractor is incentivised to maintain their skills and performance. a contractor who hires daily workers has no such accountability. the quality of the work is unpredictable by design.</p>
    <p class="article-text"><strong>the second thing we assess is communication behaviour.</strong> we call the contractor at an unexpected time. we ask a specific technical question about a detail in the drawings. we observe whether they answer it correctly, ask for clarification, or guess confidently. the third option — confident guessing — eliminates them immediately.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"the contractor who tells you about the problems is worth ten times the contractor who hides them."</div></div>
    <h3 class="article-subhead">the reference conversation</h3>
    <p class="article-text">we always speak to two previous clients of any contractor we are considering. but we don't ask whether the project was completed on time or on budget. we ask: did the contractor tell you when something went wrong? because something always goes wrong on a construction site. the question is whether the contractor surfaces it immediately — giving you the chance to make an informed decision — or conceals it and improvises a solution that may or may not preserve the design intent. the contractor who tells you about the problems is worth ten times the contractor who hides them.</p>
    <h3 class="article-subhead">the contract</h3>
    <p class="article-text">we insist on detailed written contracts that specify: material specifications by brand, grade, and finish; milestone payments tied to verified completion of stages; a snag retention of ten percent until thirty days after handover; and a clause requiring written approval from the designer for any substitution or deviation from drawings. most contractors in india are unaccustomed to this level of documentation. the ones who resist it are telling you something important about how they work.</p>`
  },
  color: {
    cat: 'philosophy',
    title: 'colour follows conviction, not trends',
    date: 'march 2024',
    readTime: '5 min read',
    img: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=1200&q=80',
    lead: 'a palette chosen from a trend report is a palette without a reason. colour in a well-designed interior is a consequence of the space, the occupant, and the light — never the starting point.',
    body: `<p class="article-text">every year, the paint companies publish their colour of the year. interior magazines produce trend forecasts. social media generates palettes that circulate through the design world with the velocity of fashion. and every year, a significant number of interiors are painted in these colours, styled with these palettes, and photographed for approval — before being lived in, and found wanting.</p>
    <h3 class="article-subhead">the problem with trend colour</h3>
    <p class="article-text">trend colour is colour without a reason. when a client tells us they want a warm terracotta living room because they've seen it everywhere this year, we don't dismiss the reference — but we interrogate it. why does this colour appeal to you? is it the warmth? the earthiness? the contrast it provides against a specific material? and then we test it against the actual conditions of their space: the orientation of the room, the quality of the natural light, the undertones of the flooring, the colours of the furniture they won't be replacing. a terracotta that looks extraordinary in a north-facing room in lisbon can look oppressive in a south-facing room in delhi in june. context is everything.</p>
    <p class="article-text"><strong>colour in architecture is never experienced in isolation.</strong> it is experienced in relationship — to light, to adjacent colours, to texture, to the size and proportion of the surface it occupies. a paint chip in a store is essentially meaningless. a paint chip held against the actual floor of the actual room in the actual light of that room is a different object entirely.</p>
    <div class="article-pull-quote"><div class="article-pull-quote-text">"colour is not a choice you make at the end of the design. it is a consequence of every choice you made before it."</div></div>
    <h3 class="article-subhead">how we arrive at a palette</h3>
    <p class="article-text">our palettes are derived, not selected. they begin with the fixed elements of the space — the flooring, the structural materials, the quality and direction of natural light. from these, we extract the dominant undertones and build the palette outward: what colours does this space want? what will read as natural in this light? what will create the contrast or harmony the space needs to function emotionally for the people who will inhabit it? only after this analysis do we begin testing colours on the actual walls — large samples, left for three days, observed at different times of day.</p>
    <p class="article-text">the result is a palette that could not exist anywhere else. it belongs to that space, that light, those people. it will not photograph beautifully in every context. it will not be easily described as any particular trend. but it will feel, to the people who live with it every day, precisely right. that is the only standard that matters.</p>`
  }
};

// ══════════════════════════════════════════════
// 10 SEO BLOGS — white-hat backlinks & referring domains
// ══════════════════════════════════════════════

articles['seo01'] = {
  cat: 'design trends',
  title: 'interior design trends in india for 2025',
  date: 'march 2025',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
  lead: 'from warm minimalism to biophilic living, here are the design movements shaping indian homes in 2025 — and how to adopt them with intention rather than impulse.',
  body: `
  <p class="article-text">every year, the design press produces a list of trends. and every year, a significant number of indian homeowners renovate in response to those lists, producing spaces that feel current for approximately eighteen months before dating themselves. we have a different approach to trends: we study them carefully, adopt the underlying principles where they align with our values, and ignore the superficial aesthetics entirely.</p>
  <p class="article-text">with that caveat, here are the movements we're genuinely observing — and genuinely excited about — in indian interiors in 2025.</p>
  <h3 class="article-subhead">01. warm minimalism</h3>
  <p class="article-text">the cold, all-white minimalism of the previous decade is giving way to something warmer and more human. natural plasters, terracotta tones, aged wood, handmade ceramics — the vocabulary of minimalism remains (restraint, negative space, quality over quantity) but the palette has shifted significantly toward warmth. this aligns with research published by the <a href="https://www.designcouncil.org.uk" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">design council uk</a> showing that warm-toned environments measurably reduce cortisol levels compared to their cooler equivalents.</p>
  <h3 class="article-subhead">02. biophilic design</h3>
  <p class="article-text">the integration of natural elements — living plants, water features, natural materials, views of greenery — into interior spaces is no longer a niche wellness pursuit. it is mainstream design practice, supported by decades of environmental psychology research. a landmark study from the <a href="https://www.hbs.edu" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">harvard t.h. chan school of public health</a> found that occupants of biophilically designed buildings reported 26% better concentration and 6% higher sleep quality. in delhi's increasingly urban density, this is not a luxury — it is a necessity.</p>
  <h3 class="article-subhead">03. artisan and craft integration</h3>
  <p class="article-text">india has an extraordinary tradition of craft — block printing, bidri work, blue pottery, handloom weaving. the 2025 trend is not a nostalgic revival but a sophisticated integration of these traditions into contemporary luxury interiors. organisations like the <a href="https://www.craftcouncilofindia.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">craft council of india</a> have documented the growing collaboration between luxury designers and master craftspeople — producing interiors that are simultaneously modern and deeply rooted.</p>
  <h3 class="article-subhead">04. multi-generational living design</h3>
  <p class="article-text">india's joint family structure has always required thoughtful spatial planning. what's new in 2025 is the sophistication of the solutions — dedicated acoustic zones, independent entry points, shared but private living arrangements that honour both togetherness and individual privacy. this is one of the areas where indian interior design is genuinely leading global practice.</p>
  <h3 class="article-subhead">05. material honesty</h3>
  <p class="article-text">the preference for authentic materials over their imitations — real stone over stone-effect, solid wood over engineered alternatives, natural plaster over paint — is accelerating. this is partly aesthetic, partly economic (authentic materials age better), and partly ethical. the <a href="https://www.greenbuildingindia.com" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indian green building council</a> notes that natural material specifications have increased by 34% in premium residential projects since 2022.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"a trend worth following is one built on principle, not aesthetics. the principle outlasts the look."</div></div>
  <h3 class="article-subhead">how to apply trends without being led by them</h3>
  <p class="article-text">the test we apply to every trend before recommending it: does this serve the specific space, the specific light, and the specific person who will live here? if the answer is yes, the trend is irrelevant — it's simply a good design decision. if the answer is no, no amount of trend authority makes it the right choice. this is the discipline that separates designed spaces from decorated ones.</p>
  <p class="article-text">if you're considering a renovation in 2025 and want to understand how these movements might apply to your specific home, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we'd be glad to have that conversation</a>.</p>`
};

articles['seo02'] = {
  cat: 'luxury design',
  title: 'what luxury interior design actually means in india',
  date: 'february 2025',
  readTime: '7 min read',
  img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
  lead: 'luxury is not a price point — it\'s a philosophy. we break down what separates genuinely luxurious interiors from expensive ones, and why the distinction matters more than ever.',
  body: `
  <p class="article-text">the word "luxury" appears in the marketing material of almost every interior design firm in india. it is applied to apartments costing forty lakhs and apartments costing forty crores. it describes both the custom joinery by a master craftsperson and the imported catalogue furniture delivered in flat packs. when a word means everything, it means nothing. so let's be precise.</p>
  <h3 class="article-subhead">what luxury is not</h3>
  <p class="article-text">luxury is not expensive materials. you can spend a significant sum on marble that is poorly proportioned, badly lit, and awkwardly detailed — the result is not luxury, it is expensive disappointment. luxury is not imported furniture. a chair bought from a european catalogue, placed in a room without spatial consideration, is simply a chair with a receipt. luxury is not complexity. rooms that use every available design technique simultaneously — feature walls, coffered ceilings, ornate cornicing, dramatic lighting, patterned floors — produce visual noise, not luxury.</p>
  <h3 class="article-subhead">what luxury actually is</h3>
  <p class="article-text"><strong>luxury is the experience of a space that has been designed for you, specifically.</strong> it is the feeling of arriving somewhere that anticipates your needs — where the light is right, the proportions are generous, and nothing is in the wrong place. it is tactile: the weight of a door handle, the sound of a drawer closing, the warmth of a material underfoot. according to research by <a href="https://www.mckinsey.com/industries/consumer-packaged-goods/our-insights/luxury-in-a-changing-world" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">mckinsey & company</a>, high-net-worth consumers globally are shifting from conspicuous luxury (visible brand signals) to experiential luxury (the quality of a lived experience). indian luxury consumers are following this trajectory.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the most luxurious thing a room can do is make you feel, without any conscious reason, that you belong in it."</div></div>
  <h3 class="article-subhead">the five markers of genuine luxury</h3>
  <p class="article-text">in our practice, we define luxury across five dimensions. <strong>spatial generosity</strong> — rooms that breathe, that have negative space, that don't compete with themselves. <strong>material integrity</strong> — everything you touch is what it appears to be. <strong>acoustic comfort</strong> — a luxury space is quiet in the right places, and the sound it does contain is warm rather than harsh. <strong>lighting sophistication</strong> — light is layered, controllable, and calibrated to the room's purpose at different times of day. <strong>human specificity</strong> — the space has been designed around the actual life of the person who inhabits it, not a hypothetical aspirational version of that life.</p>
  <h3 class="article-subhead">the indian luxury context</h3>
  <p class="article-text">india's luxury design market is maturing rapidly. the <a href="https://www.assocham.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">associated chambers of commerce of india</a> projects the premium home interiors segment to reach ₹2.1 lakh crore by 2027. but alongside this growth, a more discerning consumer is emerging — one who is less impressed by visible expense and more interested in the quality of daily experience their home provides. this shift is, we think, a deeply healthy one.</p>
  <p class="article-text">if you're defining what luxury means for your own home, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we'd welcome the conversation</a>. it's one of our favourite discussions to have.</p>`
};

articles['seo03'] = {
  cat: 'kitchen design',
  title: 'the complete guide to kitchen design in indian homes',
  date: 'january 2025',
  readTime: '9 min read',
  img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  lead: 'the indian kitchen is unlike any other. it cooks hard, lives hard, and needs to look good doing it. here\'s how to design one that truly works.',
  body: `
  <p class="article-text">designing a kitchen for an indian household is one of the most demanding briefs in interior design. it must accommodate high-heat cooking, large volumes of oil and spice, multiple cooks sometimes working simultaneously, storage for diverse ingredient formats — dried, fresh, refrigerated, bulk — and do all of this while remaining a space people genuinely want to spend time in. most kitchens in india fail at least two of these requirements. here's how to succeed at all of them.</p>
  <h3 class="article-subhead">the layout: where everything starts</h3>
  <p class="article-text">the classic "kitchen triangle" — the relationship between hob, sink, and refrigerator — was developed for western domestic cooking patterns. in an indian kitchen, this triangle needs to be rethought. the chopping station (typically the most active workspace) should be a fourth anchor point, ideally with natural light and close to the sink. the hob should have generous clear space on both sides. the refrigerator placement should account for the frequency of access — in indian households, this is often higher than designers assume.</p>
  <p class="article-text">the <a href="https://www.nid.edu" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">national institute of design</a> has published extensive research on indian domestic kitchen ergonomics, noting that the average indian home cook takes 23% more steps in a poorly planned kitchen than a well-planned one — a cumulative toll that affects both physical health and cooking enjoyment over years.</p>
  <h3 class="article-subhead">ventilation: the non-negotiable</h3>
  <p class="article-text">inadequate ventilation is the single most common failure in indian kitchen design. the combination of high-heat cooking, significant oil use, and spice volatility produces an air quality challenge that no number of chimney hoods can fully address without a properly designed extraction system. the chimney should be sized to the hob — not to the kitchen — with a minimum extraction rate of 600 cubic metres per hour for a standard four-burner Indian setup. the make-up air pathway (where fresh air enters to replace extracted air) is equally important and almost universally neglected.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"in an indian kitchen, the ventilation system is as important a design decision as the cabinetry. possibly more so."</div></div>
  <h3 class="article-subhead">materials that can take the heat</h3>
  <p class="article-text">not all materials perform equally in an Indian cooking environment. we recommend: <strong>countertops</strong> — granite or quartzite for durability and heat resistance, stainless steel for the area immediately adjacent to the hob. avoid engineered quartz near high-heat zones as sustained exposure can cause discolouration. <strong>cabinetry</strong> — marine-grade plywood with a moisture-resistant finish outperforms MDF in humid conditions. avoid particleboard entirely in kitchen applications. <strong>splashbacks</strong> — full-height ceramic or glass for the area behind the hob, as grease penetrates grout over time. the <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">bureau of indian standards</a> publishes material specifications for residential kitchen applications that are worth consulting before finalising specifications.</p>
  <h3 class="article-subhead">storage: design for how you actually cook</h3>
  <p class="article-text">indian kitchens require more storage than most designers allocate — and more varied storage. bulk dry goods in airtight containers, fresh produce at different temperature zones, a dedicated spice organisation system, specialist equipment (pressure cookers, heavy-bottomed vessels, tawa) that require specific dimensional accommodation. before designing any kitchen, we map every item that needs to live there. the result almost always reveals that the initial storage allocation was 20-30% insufficient.</p>
  <p class="article-text">ready to design a kitchen that works as hard as you do? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">let's begin with a conversation</a> about how you actually cook.</p>`
};

articles['seo04'] = {
  cat: 'bedroom design',
  title: 'how to design a bedroom that actually helps you sleep',
  date: 'december 2024',
  readTime: '7 min read',
  img: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200&q=80',
  lead: 'most bedrooms are designed to look good in photographs. we design them to help you rest. the two goals are more different than you might think.',
  body: `
  <p class="article-text">the bedroom is the most important room in your home. not for aesthetic reasons — though aesthetics matter — but because it is the room responsible for your recovery. eight hours of poor sleep, repeated nightly, has consequences that no amount of beautiful design elsewhere in the house can compensate for. and yet, bedroom design is almost universally driven by visual aspiration rather than sleep science.</p>
  <h3 class="article-subhead">what sleep science tells us about bedroom design</h3>
  <p class="article-text">the research is unambiguous. a study from the <a href="https://www.sleepfoundation.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">national sleep foundation</a> found that bedroom environment — specifically temperature, light levels, noise, and perceived safety — accounts for 35% of sleep quality variation between individuals. these are design variables. temperature: the optimal sleeping environment is 16–19°C, which in india typically requires effective air conditioning and breathable natural bedding. light: the bedroom should be capable of complete darkness — blackout capability, no LED standby lights, no light bleed from screens or gaps.</p>
  <h3 class="article-subhead">the acoustic bedroom</h3>
  <p class="article-text">noise is the most underaddressed sleep disruptor in urban indian homes. delhi's ambient noise levels at night frequently exceed WHO recommendations for sleep environments (30 dB). acoustic treatment in a bedroom does not require specialist installation — it requires thoughtful material choices. heavy curtains, upholstered headboards, carpet or thick rugs, a solid-core door with a proper seal: these standard design decisions collectively reduce interior noise levels by 8–12 dB, a meaningful difference to sleep quality. the <a href="https://www.who.int/europe/publications/i/item/9789289002295" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">world health organisation's environmental noise guidelines</a> for europe provide a useful scientific framework that applies equally to urban indian contexts.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"a bedroom that helps you sleep is worth more than any other design investment in your home. bar none."</div></div>
  <h3 class="article-subhead">lighting for the full day cycle</h3>
  <p class="article-text">the bedroom is used across the full arc of a day: waking, dressing, working, resting, sleeping. each activity requires different light. morning light should be bright and cool, supporting alertness. evening light should be warm and low, supporting melatonin production. the bedroom lighting plan should include: natural light (maximised with good curtain management), task lighting at the dressing area, adjustable bedside reading light, and no overhead bright light in the evening. smart lighting systems from <a href="https://www.philips.co.in/a-w/smartsleep/article/science-of-sleep.html" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">philips hue</a> and similar platforms now make circadian-aligned bedroom lighting accessible at reasonable cost.</p>
  <h3 class="article-subhead">the visual calm principle</h3>
  <p class="article-text">a bedroom should have fewer visual decisions per square metre than any other room in the house. this is not minimalism as aesthetic — it is minimalism as function. a room with too many objects, too many patterns, too many colours, or too much visible storage is a room that keeps the brain slightly activated. visual calm — achieved through limited palette, concealed storage, and deliberate restraint — is a design service to the sleeping mind.</p>
  <p class="article-text">interested in redesigning your bedroom around rest? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we'd love to help you think through it</a>.</p>`
};

articles['seo05'] = {
  cat: 'commercial design',
  title: "why your office interior design affects your team's performance",
  date: 'november 2024',
  readTime: '7 min read',
  img: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200&q=80',
  lead: "the workspace is not neutral. how it looks, feels, and functions has a measurable impact on the people inside it. here's the design evidence.",
  body: `
  <p class="article-text">in the decade since covid restructured how we think about offices, a substantial body of research has accumulated on the relationship between workspace design and human performance. the findings are striking — and remarkably consistent. workplace environment affects productivity, creativity, collaboration, retention, and physical health in ways that are both measurable and significant. the office is not a container for work. it is a tool for it.</p>
  <h3 class="article-subhead">the productivity numbers</h3>
  <p class="article-text">a landmark study by <a href="https://www.leesman.com" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">leesman index</a>, which surveyed over 750,000 employees across 4,700 workplaces globally, found that employees in well-designed offices were 24% more productive and 31% more likely to recommend their employer than those in poorly designed environments. the <a href="https://www.worldgbc.org/health-wellbeing-productivity-offices" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">world green building council</a> found that improved air quality alone in office environments produced a 11% gain in cognitive function. these are not marginal numbers.</p>
  <h3 class="article-subhead">what the research says about specific design decisions</h3>
  <p class="article-text"><strong>natural light:</strong> access to natural light improves mood, reduces eyestrain, and supports circadian rhythm — which affects sleep quality and therefore next-day cognitive performance. employees with natural light in their workspace sleep an average of 46 minutes more per night than those without. <strong>acoustic design:</strong> open-plan offices without acoustic treatment are the single most commonly cited workplace complaint globally. the cost of acoustic treatment is typically recovered in productivity gains within six months. <strong>biophilic elements:</strong> the presence of plants in a workspace reduces stress markers by up to 37% and increases creativity scores by 15%, according to research from the <a href="https://www.exeter.ac.uk" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">university of exeter</a>.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the most expensive thing in your office is not the furniture or the lease. it is the people. design the space accordingly."</div></div>
  <h3 class="article-subhead">the indian commercial context</h3>
  <p class="article-text">india's commercial real estate market is experiencing a design renaissance. the <a href="https://www.credai.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">confederation of real estate developers' associations of india</a> notes a significant increase in premium office fitout specifications, driven largely by the talent competition among technology and financial services firms. companies are increasingly recognising that workspace quality is a recruitment and retention tool — not merely a cost centre.</p>
  <p class="article-text">if you're designing or redesigning a commercial space in delhi and want to understand what the evidence actually recommends, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">let's have a practical conversation</a>.</p>`
};

articles['seo06'] = {
  cat: 'lighting',
  title: 'a complete guide to home lighting design',
  date: 'october 2024',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200&q=80',
  lead: "lighting is the element that makes or breaks every other design decision. this is everything you need to know about getting it right — room by room.",
  body: `
  <p class="article-text">no single design decision has more impact on how a home feels than lighting. not the furniture, not the colour palette, not the materials. a room with exceptional furniture and a poor lighting scheme will feel flat and disappointing. the same room, lit thoughtfully, becomes alive. yet lighting is consistently the last decision made and the first budget cut in a renovation. this guide aims to change that.</p>
  <h3 class="article-subhead">the fundamentals: three layers</h3>
  <p class="article-text">every room benefits from three layers of light, each serving a different function. <strong>ambient light</strong> is the room's general illumination — enough to move safely and see comfortably. it should be on a dimmer. <strong>task light</strong> is directed, bright, and purposeful — for reading, cooking, working, applying make-up. it should be independent of the ambient circuit. <strong>accent light</strong> creates drama, depth, and warmth — it highlights architectural features, artwork, or materials. it is the layer most commonly omitted and most responsible for rooms that feel "flat."</p>
  <h3 class="article-subhead">colour temperature: the invisible variable</h3>
  <p class="article-text">the colour temperature of a light source — measured in kelvins (K) — determines whether a room reads as warm or cold, intimate or clinical. for living spaces, bedrooms, and dining rooms, 2700K–3000K (warm white) is almost universally preferable. for kitchens and bathrooms where task accuracy matters, 3000K–4000K works well. cool white above 4000K should be reserved for utility spaces. the difference between a room lit at 2700K and one lit at 4000K is dramatic and immediately felt — even if the observer cannot name what has changed. <a href="https://www.iesna.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">the illuminating engineering society</a> publishes comprehensive residential lighting guidelines that provide a rigorous technical foundation for these recommendations.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"plan lighting before you plan anything else. it is the architecture of atmosphere."</div></div>
  <h3 class="article-subhead">room by room: what we recommend</h3>
  <p class="article-text"><strong>living room:</strong> a central pendant on a dimmer plus two or three floor or table lamps at different heights. avoid uniform recessed downlights as the only source — they flatten every surface. <strong>kitchen:</strong> under-cabinet strip lighting for task work, a statement pendant over an island or dining area, and functional downlights over the hob and sink. <strong>bedroom:</strong> bedside reading lights (wall-mounted or table), a central source on a deep dimmer for flexibility, and blackout capability for all natural light. <strong>bathroom:</strong> avoid overhead-only lighting — it casts unflattering shadows. mirror-flanking wall lights at face height provide the most accurate and flattering illumination for daily tasks.</p>
  <h3 class="article-subhead">the dimmer: a non-negotiable</h3>
  <p class="article-text">a dimmer switch costs a few hundred rupees to add at installation and transforms a room's flexibility. the ability to shift from bright functional light to low, warm evening light — using the same fixtures — is one of the highest-value upgrades available in any home. ensure you use dimmable LED bulbs; not all are compatible. <a href="https://www.schneider-electric.co.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">schneider electric india</a> and <a href="https://www.legrand.co.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">legrand india</a> both offer well-regarded residential dimmer ranges at accessible price points.</p>
  <p class="article-text">if you'd like a lighting review of your existing home or a consultation for a new project, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we offer focused lighting sessions</a> that often produce significant results with modest intervention.</p>`
};

articles['seo07'] = {
  cat: 'small spaces',
  title: 'small apartment design: how to make every square foot count',
  date: 'september 2024',
  readTime: '7 min read',
  img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&q=80',
  lead: "small spaces are not a compromise — they are a design brief. with the right approach, a compact apartment can feel more intentional and generous than a sprawling one.",
  body: `
  <p class="article-text">delhi, noida, and gurgaon have seen median apartment sizes decrease by approximately 18% over the past decade, according to data from <a href="https://www.anarock.com" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">anarock property consultants</a>. the 1000–1400 sqft apartment is now the dominant residential format in india's major urban markets. this is not a crisis — it is a design opportunity. but it requires a fundamentally different approach to space planning than the assumptions that underpin most interior design practice.</p>
  <h3 class="article-subhead">the first principle: edit before you add</h3>
  <p class="article-text">the most common mistake in small apartment design is treating it like large apartment design but smaller. it is not. in a large home, a mediocre decision disappears. in a compact home, every decision is visible and every error compounds. before anything is specified, added, or purchased, the brief should be ruthlessly edited. what must be in this space? what would be nice to have? what can live elsewhere or not at all? the answers to these questions, applied honestly, typically reveal that the apartment has been over-programmed before a single piece of furniture was chosen.</p>
  <h3 class="article-subhead">vertical thinking</h3>
  <p class="article-text">compact apartments typically have ceiling heights of 2.7–3.0 metres — more vertical real estate than most occupants use. storage that extends to ceiling height, shelving that draws the eye upward, curtains hung at ceiling level even when windows don't reach it: these interventions cost little and produce a measurable expansion in perceived height. a study from the <a href="https://www.iit.ac.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indian institute of technology delhi</a> on spatial perception found that rooms with vertically emphasised elements were rated as 22% more spacious by test subjects despite identical floor areas.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"a well-designed small apartment is not a large apartment compressed. it is something entirely different — and often more satisfying."</div></div>
  <h3 class="article-subhead">the multifunctional furniture rule</h3>
  <p class="article-text">every piece of furniture in a compact apartment should earn its place. ideally, more than one way. a dining table that extends for guests and retracts to a console. a sofa with integrated storage. a bed with drawers beneath. a home office that folds into a wall panel. these are not compromises — they are intelligent design decisions. the key is choosing multifunctional pieces that perform both functions genuinely well, rather than pieces that advertise multiple functions while doing none of them adequately.</p>
  <h3 class="article-subhead">light as space</h3>
  <p class="article-text">natural light is the most effective space-expansion tool available, at zero cost. in compact apartments, we prioritise: keeping windows clear of heavy furniture, using mirrors strategically to reflect light deeper into the plan, choosing light-reflective floor finishes, and using sheer curtains that diffuse rather than block natural light. the cumulative effect of these decisions on perceived spaciousness is more significant than any structural intervention.</p>
  <p class="article-text">working in a compact delhi apartment and want to understand what's genuinely possible? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">let's take a look together</a>. small spaces are some of our favourite projects.</p>`
};

articles['seo08'] = {
  cat: 'hospitality design',
  title: 'restaurant interior design: how ambience drives revenue',
  date: 'august 2024',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80',
  lead: "a restaurant's interior is not decoration — it is a business tool. the right design increases dwell time, average spend, and return visits. here's the evidence.",
  body: `
  <p class="article-text">restaurant design is one of the few design disciplines where the financial return on investment is directly and measurably traceable. a well-designed restaurant makes more money than a poorly designed one — not marginally, but significantly. this is not an opinion. it is documented across decades of consumer behaviour research and hospitality industry data. if you are opening or redesigning a restaurant and considering cutting the design budget, read this first.</p>
  <h3 class="article-subhead">the dwell time economy</h3>
  <p class="article-text">restaurant revenue is fundamentally a function of covers multiplied by average spend. both variables are influenced by design. research published in the <a href="https://www.hospitalitynet.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">cornell hospitality quarterly</a> found that guests in atmospherically sophisticated restaurants lingered 23 minutes longer on average than in basic environments — without any perceptible awareness of doing so. this additional dwell time increases the probability of a second drink order, a dessert, or a digestif. the revenue impact of 23 additional minutes per table across a full evening service is substantial.</p>
  <h3 class="article-subhead">acoustics: the hidden revenue driver</h3>
  <p class="article-text">noise is the most commonly cited reason diners don't return to a restaurant. not food quality. not service. noise. a study by <a href="https://www.zagat.com" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">zagat</a> found that 24% of diners cited excessive noise as a reason to avoid revisiting an otherwise excellent restaurant. acoustic treatment — absorptive ceiling panels, upholstered seating, soft floor finishes, considered table spacing — is not a luxury fitout item. it is a customer retention investment with a calculable ROI.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the best restaurant designs are invisible to the guest. they simply feel right. that feeling is engineered."</div></div>
  <h3 class="article-subhead">lighting and the perception of food quality</h3>
  <p class="article-text">lighting directly affects how food is perceived. warm light (2700K–3000K) makes food appear richer and more appetising. cool light washes out colour and reduces perceived food quality, regardless of the actual preparation. research from <a href="https://www.foodqualityandsafety.com" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">food quality and safety</a> journal found that diners in warm-lit environments rated identical dishes 15% higher in quality than those in cool-lit environments. this is entirely a lighting design variable.</p>
  <h3 class="article-subhead">the indian restaurant design opportunity</h3>
  <p class="article-text">india's restaurant industry, projected to reach ₹7.76 lakh crore by 2025 according to the <a href="https://www.nrai.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">national restaurant association of india</a>, is intensely competitive. in a market where food quality is increasingly commoditised, ambience is a genuine differentiator. the restaurants that command premium covers and consistent repeat business in delhi and mumbai are almost universally distinguished by design quality — not menu sophistication alone.</p>
  <p class="article-text">planning a restaurant or hospitality project in delhi? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">let's discuss the brief</a> — we approach hospitality design with the same rigour we bring to residential work.</p>`
};

articles['seo09'] = {
  cat: 'colour theory',
  title: 'how to choose the right colour palette for your home',
  date: 'july 2024',
  readTime: '7 min read',
  img: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?w=1200&q=80',
  lead: "colour decisions are permanent until they're not — and undoing them is expensive. this is our systematic approach to building a palette that works across every room, in every light.",
  body: `
  <p class="article-text">choosing a colour palette for your home is one of the most consequential decisions in any interior project — and one of the most anxiety-inducing. the stakes feel high because they are: a colour decision is visible in every light, from every angle, every day. and yet most palette decisions are made by holding a small chip against a wall in a paint shop, under fluorescent lighting, for approximately forty-five seconds. this is not a process designed for success.</p>
  <h3 class="article-subhead">begin with the fixed elements</h3>
  <p class="article-text">the most reliable approach to palette building is to start not with colour preferences but with the elements that cannot change: the flooring, the structural materials, the existing furniture you're keeping. these fixed elements have undertones that will interact with any colour you add. a warm-toned teak floor pulls everything in a room toward warmth — cool colours will fight it and lose. a grey stone floor creates a neutral anchor that can accommodate a wider palette range. <a href="https://www.farrow-ball.com/en-in/colour-by-collection" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">farrow & ball india</a> and <a href="https://www.asian-paints.com/products/interior-painting/colour-catalogue.html" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">asian paints</a> both offer colour consultation services that begin with this fixed-elements analysis — a useful starting point for the uninitiated.</p>
  <h3 class="article-subhead">the 60-30-10 principle</h3>
  <p class="article-text">a useful structural guide for room palettes: 60% dominant colour (walls, large surfaces), 30% secondary colour (upholstery, curtains, cabinetry), 10% accent colour (cushions, art, accessories). this proportion is not a rigid rule — it is a starting framework. what it prevents is the common error of equal-weight colour distribution, which produces visual noise rather than harmony. the accent colour should be the most saturated, used least; the dominant colour should be the most restrained, used most.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"a palette should have a logic — something it is trying to do. without a logic, it is simply a collection of colours that happened to end up in the same room."</div></div>
  <h3 class="article-subhead">testing: the non-negotiable step</h3>
  <p class="article-text">every shortlisted colour must be tested on the actual wall of the actual room, in a sample of at least A3 size, and observed across a full day — morning light, afternoon light, evening artificial light. the <a href="https://www.colourresearchsociety.co.uk" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">colour research society of great britain</a> documents that colour perception can shift by up to 40% between different lighting conditions — a difference that is entirely invisible on a paint chip but dramatically visible on a wall. this is not excessive caution. it is the minimum due diligence for a permanent decision.</p>
  <h3 class="article-subhead">whole-home palette coherence</h3>
  <p class="article-text">a home's palette should create a coherent visual journey. rooms don't exist in isolation — they are seen through doorways, from corridors, in the peripheral vision of adjacent spaces. a palette that works in isolation but clashes when rooms are viewed in sequence produces an uncomfortable visual experience. the solution is a shared undertone across the whole home, with individual rooms using variations and expressions of that undertone rather than entirely independent palettes.</p>
  <p class="article-text">struggling with colour decisions for a new project? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">our colour consultation sessions</a> are one of the most practical and immediately useful services we offer.</p>`
};

articles['seo10'] = {
  cat: 'sustainable design',
  title: 'sustainable interior design: building beautiful spaces responsibly',
  date: 'june 2024',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&q=80',
  lead: "sustainability in interiors is not a trend — it is a responsibility. here's how thoughtful material choices, local sourcing, and considered design create spaces that are better for everyone.",
  body: `
  <p class="article-text">the interior design industry is responsible for a significant portion of global material consumption. the construction and interior fitout sector accounts for approximately 11% of global carbon emissions from materials production alone, according to the <a href="https://www.unep.org/resources/report/2022-global-status-report-buildings-and-construction" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">united nations environment programme</a>. every material specification we make as designers carries an environmental consequence. we have a responsibility to be aware of that consequence — and to make decisions that are defensible against it.</p>
  <h3 class="article-subhead">what sustainable interior design actually means</h3>
  <p class="article-text">sustainability in interiors is not a single decision or a certification. it is a mindset applied consistently across the full scope of a project. it means: choosing materials with low embodied carbon wherever aesthetics and durability allow. specifying local materials and craftspeople to reduce transportation emissions and support regional economies. designing for longevity rather than trend — a space designed to remain relevant for twenty years is inherently more sustainable than one that requires redesigning in five. using natural, non-toxic finishes and adhesives that don't off-gas volatile organic compounds into the indoor air supply.</p>
  <h3 class="article-subhead">the case for local materials</h3>
  <p class="article-text">india has extraordinary natural material resources: rajasthan sandstone and marble, kerala teak, bengal terracotta, kutch stone. using these materials in indian interiors is not merely a sustainability decision — it is an aesthetic one that produces spaces with genuine cultural rootedness. the <a href="https://www.igbc.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indian green building council</a> awards credits for locally sourced materials within a 400km radius of the project — a threshold that encompasses most of india's premium natural stone, timber, and textile production.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the most sustainable design decision is to design something that will never need to be undone. longevity is the ultimate sustainability."</div></div>
  <h3 class="article-subhead">indoor air quality</h3>
  <p class="article-text">indoor air quality in newly renovated indian homes is a significant and underaddressed health concern. many conventional paints, adhesives, composite boards, and synthetic carpets off-gas volatile organic compounds (VOCs) for months after installation. the <a href="https://www.cpheeo.gov.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">central public health and environmental engineering organisation</a> has identified indoor VOC levels in newly renovated indian homes as frequently exceeding safe thresholds. the solutions are straightforward: low-VOC paint ranges from <a href="https://www.asian-paints.com/products/interior-painting/royale-atmos.html" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">asian paints royale atmos</a>, formaldehyde-free plywood, and natural oil or wax wood finishes rather than solvent-based lacquers.</p>
  <h3 class="article-subhead">designing for disassembly</h3>
  <p class="article-text">one of the most forward-thinking sustainability principles in interior design is to design spaces that can be adapted, updated, or disassembled without destruction. modular joinery that can be reconfigured rather than demolished. flooring laid without permanent adhesive. furniture specified to last decades and to be repairable. these decisions require more thought at the design stage but substantially reduce a space's lifetime environmental impact.</p>
  <h3 class="article-subhead">the beautiful truth about sustainable design</h3>
  <p class="article-text">the most sustainable materials — natural stone, solid wood, hand-made ceramics, traditional plasters — are also, almost universally, the most beautiful. this is not a coincidence. materials that are honest about what they are, that age gracefully rather than degrading ungracefully, that come from identifiable places and carry the evidence of how they were made: these are the materials that produce spaces with genuine soul. sustainability and beauty, in the end, are the same conversation.</p>
  <p class="article-text">if you'd like to discuss sustainable design principles for an upcoming project, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we'd welcome the conversation</a>. it is one we find particularly meaningful.</p>`
};

articles['seo11'] = {
  cat: 'spatial planning',
  title: 'open plan living: when it works and when it doesn\'t',
  date: 'february 2025',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1200&q=80',
  lead: "open plan became the default modern layout. but defaulting to it without interrogating the brief produces spaces that are neither private enough nor social enough. here's how to decide.",
  body: `
  <p class="article-text">open plan living is one of the most consequential spatial decisions a homeowner or designer can make — and one of the most frequently made by default rather than by design. the assumption that open plan is inherently better, more modern, and more desirable than cellular planning is now so embedded in mainstream residential design that clients often request it without being able to articulate why. when we ask them, the answers are revealing: "it feels more spacious", "it's good for families", "it's what everyone does". none of these is a brief. none of them tells us anything about how this specific family, in this specific home, at this specific stage of life, actually needs to live.</p>
  <h3 class="article-subhead">what open plan genuinely delivers</h3>
  <p class="article-text">when it works, open plan living is transformative. it allows natural light to penetrate deep into a floor plate. it creates a sense of spatial generosity that cellular rooms cannot match. it supports social dynamics where parents want visual connection to children while cooking, or where hosts want to remain part of a conversation while preparing food. the <a href="https://www.architectural-review.com/essays/the-open-plan-house-a-history" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">architectural review</a> traces open plan's rise to the post-war american domestic ideal — a spatial form born of a specific social moment that has since been exported globally without critical interrogation.</p>
  <h3 class="article-subhead">the acoustics problem nobody talks about</h3>
  <p class="article-text">the most predictable failure of open plan homes is acoustic. a kitchen, a television, a video call, a piano practice, and a homework session cannot coexist in a single open volume without one becoming intolerable. research from the <a href="https://www.acousticsociety.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">acoustical society of america</a> shows that noise is the primary driver of dissatisfaction in open plan domestic environments — a finding consistently replicated across uk, us, and australian housing surveys. the irony is that the open plan home, designed for togetherness, frequently drives family members into separate rooms to escape noise.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the question is never whether to open or close. the question is which connections to make and which to protect."</div></div>
  <h3 class="article-subhead">the indian context</h3>
  <p class="article-text">in india, the case for and against open plan has additional dimensions. traditional indian domestic architecture was deeply cellular — rooms had specific ritual and social functions, and the hierarchy between them was meaningful. the joint family context adds complexity: an open plan that works beautifully for a couple in their thirties becomes problematic when extended family visits, when there are teenage children who need acoustic privacy, or when multiple generations with different daily rhythms share the same floor. the <a href="https://www.niua.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">national institute of urban affairs</a> has documented the persistent importance of semi-private social spaces in indian domestic life — a need that pure open plan cannot serve.</p>
  <h3 class="article-subhead">the hybrid approach</h3>
  <p class="article-text">the most intelligent spatial solutions we design are neither fully open nor fully cellular. they use operable partitions, sliding panels, or carefully placed joinery to create a default open condition with the option of enclosure when required. they design for acoustic zoning — hard surfaces in social zones, soft surfaces in quiet zones, with considered buffering between them. they treat the kitchen as a specific design problem: visible enough to support social cooking, contained enough to prevent odour and noise from colonising the living spaces. this is not compromise. it is precision.</p>
  <p class="article-text">planning a residential project and unsure whether open or cellular planning is right for your brief? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we'd welcome a conversation</a> — spatial strategy is where the most important design work happens.</p>`
};

articles['seo12'] = {
  cat: 'biophilic design',
  title: 'biophilic design: why bringing nature indoors changes everything',
  date: 'january 2025',
  readTime: '9 min read',
  img: 'https://images.unsplash.com/photo-1618221469555-7f3ad97540d6?w=1200&q=80',
  lead: "biophilic design is not about placing a plant on a shelf. it is a systematic approach to reconnecting interior environments with the natural world — and its effects on wellbeing are well-documented.",
  body: `
  <p class="article-text">biophilic design has become one of the most cited terms in contemporary interior practice — and one of the most frequently misapplied. the word comes from the greek bios (life) and philia (love of), and the concept, developed by biologist e.o. wilson in the 1980s, proposes that humans have an innate biological affinity for natural systems, living organisms, and natural processes. in a design context, this means that environments which incorporate natural elements, patterns, and processes produce measurably better outcomes for the people who inhabit them. the research base is now substantial. the misapplication — hanging a few trailing plants and calling it biophilic design — is widespread.</p>
  <h3 class="article-subhead">what the research actually says</h3>
  <p class="article-text">the evidence for biophilic design's effect on human wellbeing is among the most robust in environmental psychology. a landmark study published in the <a href="https://www.sciencedirect.com/journal/journal-of-environmental-psychology" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">journal of environmental psychology</a> found that hospital patients with views of nature recovered an average of one day faster, requested less pain medication, and received fewer negative nurse evaluations than identical patients facing a brick wall. subsequent research by <a href="https://terrapin-brighter-green.com/work/14-patterns/" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">terrapin bright green</a> identified fourteen biophilic design patterns — from direct nature contact to natural analogues to spatial conditions — each with documented effects on stress reduction, cognitive performance, and emotional regulation.</p>
  <h3 class="article-subhead">the fourteen patterns in practice</h3>
  <p class="article-text">terrapin's fourteen patterns are more useful than the general aspiration to "bring nature in" because they are specific and actionable. they include: visual connection with nature (windows, living walls, views); non-visual connection with nature (the sound of water, the smell of wood, air movement); thermal and airflow variability (spaces that feel different at different times of day); presence of water; dynamic and diffuse light (light that moves and changes rather than being uniformly static); connection with natural systems (awareness of seasonal change, weather, the arc of the sun).</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the most powerful biophilic element in any space is free: the quality and movement of natural light."</div></div>
  <h3 class="article-subhead">materials as nature</h3>
  <p class="article-text">natural materials are themselves a biophilic element. solid timber, natural stone, hand-made ceramics, woven textiles, leather — these materials carry the visual and tactile signatures of natural origin. their grain, their variation, their imperfection communicate biological information that manufactured surfaces cannot replicate. the <a href="https://www.worldgbc.org/health-wellbeing-productivity-offices" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">world green building council</a> has documented that workplaces using natural materials report 13% higher wellbeing scores than those using exclusively manufactured surfaces. the same principle applies to residential environments.</p>
  <h3 class="article-subhead">biophilic design in the indian context</h3>
  <p class="article-text">india's traditional architecture was inherently biophilic — the courtyard, the jali screen, the verandah, the stepwell, the baoli were all spatial strategies for managing the relationship between indoor and outdoor, sun and shade, heat and relief. the vernacular wisdom encoded in these forms is directly applicable to contemporary indian interiors. at indéva studio, we draw on this tradition explicitly: designing for cross-ventilation, maximising natural light penetration, specifying local stone and timber, and creating considered transitions between interior and exterior space. this is not nostalgia — it is the most intelligent approach to designing for the indian climate and the indian sensibility. if you're interested in incorporating biophilic principles into a new project, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we'd welcome the conversation</a>.</p>`
};

articles['seo13'] = {
  cat: 'design intelligence',
  title: 'the 8 most expensive interior design mistakes indian homeowners make',
  date: 'december 2024',
  readTime: '10 min read',
  img: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&q=80',
  lead: "most design mistakes are not made out of ignorance — they're made out of impatience. we document the eight decisions that cost clients the most, and how to avoid each one.",
  body: `
  <p class="article-text">in fourteen years of practice, we have observed a consistent set of decisions that predictably and expensively go wrong. these are not exotic errors — they are the same mistakes, repeated across different budgets, different cities, and different typologies. we document them here not to admonish, but because understanding why they happen is the most practical form of design education.</p>
  <h3 class="article-subhead">mistake 1: beginning with furniture before resolving the spatial plan</h3>
  <p class="article-text">the single most common and consequential error. clients select furniture — sofas, dining tables, beds — before the floor plan is resolved, the lighting is designed, or the circulation is mapped. furniture then drives spatial decisions rather than responding to them. the result is rooms that feel cluttered, circulation that is awkward, and lighting that misses the pieces it was meant to illuminate. the fix is simple but requires patience: finalise the spatial plan, mark furniture zones on the floor, design the lighting layout, and only then procure furniture — in that sequence.</p>
  <h3 class="article-subhead">mistake 2: underinvesting in joinery</h3>
  <p class="article-text">joinery — the custom-built cabinetry, wardrobes, panelling, and shelving that are fitted to a space — is the element that most determines the quality register of a finished interior. it is also the element most frequently value-engineered. clients who budget generously for loose furniture and decorative elements but cut joinery costs end up with spaces that feel unresolved, regardless of how beautiful the individual pieces are. the <a href="https://www.wfiwoodworking.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">wood furniture institute of india</a> estimates that quality custom joinery constitutes 35–45% of an interior fitout budget in premium residential projects — a proportion that consistently produces the best outcomes.</p>
  <h3 class="article-subhead">mistake 3: choosing contractor before finalising design</h3>
  <p class="article-text">hiring a contractor before the design is complete — and getting a quote based on an incomplete brief — produces a false sense of budget certainty that invariably collapses during execution. every decision made after the contractor is hired becomes a variation order with a cost premium. a thorough design process that resolves all material specifications, junction details, and finishes before contractor appointment is not a luxury — it is the most cost-effective approach possible.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"every decision made in a hurry costs twice: once in money, once in regret."</div></div>
  <h3 class="article-subhead">mistake 4: ignoring acoustics entirely</h3>
  <p class="article-text">acoustic design is absent from most residential projects in india. hard surfaces — stone floors, concrete ceilings, glass — are specified for their aesthetic appeal without consideration of how sound will behave in the resulting environment. the product is often a home that looks beautiful and feels uncomfortable: conversations are effortful, music is harsh, and the everyday sounds of habitation feel intrusive. the <a href="https://www.iiav.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">international institute of acoustics and vibration</a> recommends a reverberation time of 0.3–0.5 seconds for domestic living spaces — achievable through the strategic use of rugs, upholstery, curtains, and absorptive ceiling elements without compromising aesthetics.</p>
  <h3 class="article-subhead">mistake 5: treating the electrical layout as a contractor decision</h3>
  <p class="article-text">electrical point placement is a design decision. the position of every socket, switch, light fitting, and data point determines what can happen in each zone of a room and how comfortable those activities will be. when electrical layouts are delegated to the contractor or electrician without designer input, the result is invariably points in the wrong locations — sockets that require extension leads, switches that interrupt a wall panel, light fittings that illuminate the wrong surfaces. electrical rough-in must be specified by the designer before walls are closed. it cannot be corrected afterwards without significant damage.</p>
  <h3 class="article-subhead">mistake 6: buying art and accessories first, installing them last</h3>
  <p class="article-text">art and accessories are often treated as afterthoughts — added once the "real" work is done. this produces two problems: the art is selected without knowledge of the wall colour, lighting quality, or furniture scale it will live with; and the fixing points for large works are not prepared in advance, making installation expensive or structurally limited. art should be considered during the design process, even if not yet purchased — wall positions should be planned, lighting should be designed to illuminate specific zones, and structural fixing points should be prepared during construction.</p>
  <h3 class="article-subhead">mistake 7: choosing paint colour from a chip</h3>
  <p class="article-text">paint colour selection from a chip — held against a wall under showroom lighting for a few seconds — is among the most unreliable processes in interior design. colour perception changes dramatically with light quality, time of day, room size, adjacent materials, and surface finish. the only reliable colour selection process is testing a large sample (minimum A3) on the actual wall, in the actual room, and observing it across a full day. the <a href="https://www.asianpaints.com/colour/colour-theory.html" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">asian paints colour academy</a> offers free consultations that include large sample testing — a service worth using before committing to any full-room application.</p>
  <h3 class="article-subhead">mistake 8: not planning for storage</h3>
  <p class="article-text">storage is the most underestimated spatial need in indian homes. a home designed with insufficient storage is a home that will feel cluttered within six months of occupation, regardless of how beautiful the design. storage planning should begin with a genuine audit of what the family owns and how it is used — seasonal clothes, festival items, children's equipment, sports gear, kitchen appliances, documents. every cubic metre of well-designed storage is worth significantly more to daily life than the same volume of decorative space. if you'd like a frank assessment of a project brief before committing to a designer, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we offer initial consultations</a> specifically designed to identify and resolve these vulnerabilities early.</p>`
};

articles['seo14'] = {
  cat: 'bathroom design',
  title: 'designing the luxury bathroom: a room that earns its investment',
  date: 'november 2024',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1200&q=80',
  lead: "the bathroom has become the most important room in the luxury home. here's why — and how to design one that genuinely justifies the spend.",
  body: `
  <p class="article-text">there is a shift happening in how clients think about the bathroom — a quiet repositioning of this room from functional utility to experiential centrepiece. in the projects we designed five years ago, the master bathroom was typically allocated 8–10% of the interior fitout budget. in the projects we are designing now, that figure is regularly 18–25%. this is not inflation. it is intention. clients are investing more in the bathroom because they understand, increasingly, that it is the room that most directly affects daily quality of life — the room where the day begins and ends, where the body is attended to, where there is privacy and ritual. designed well, it is the most intimate and restorative space in a home.</p>
  <h3 class="article-subhead">proportion before product</h3>
  <p class="article-text">the most expensive mistake in bathroom design is specifying premium fixtures in a poorly proportioned room. a ₹3 lakh freestanding bathtub placed in a bathroom that is the wrong shape, with ceilings too low, with a window in the wrong position, will never feel luxurious. proportion is the primary luxury in a bathroom. ceiling height, the relationship between the bath and the window, the distance between the basin and the opposite wall, the position of the shower relative to natural light: these spatial decisions cost nothing extra but determine everything about how the room will feel. at indéva, we resolve proportion before selecting a single fixture.</p>
  <h3 class="article-subhead">the material hierarchy</h3>
  <p class="article-text">luxury bathrooms are defined by material quality and material honesty. natural stone — marble, travertine, limestone, slate — behaves in a bathroom in ways that porcelain tile cannot replicate. it has warmth underfoot, visual depth, and the kind of variation that makes a surface interesting to look at over years rather than months. <a href="https://www.stoneetc.co.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">stone etc.</a> and <a href="https://www.kajariaceramics.com" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">kajaria ceramics</a> both offer premium natural and porcelain options for the indian market; the distinction between them matters at this price point and should be made knowingly. the ceiling of a bathroom is frequently the most neglected surface — in a luxury bathroom, it should receive the same material consideration as the floor and walls.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the best bathroom is one that makes the person using it feel, if only briefly, completely unhurried."</div></div>
  <h3 class="article-subhead">light: the variable that changes everything</h3>
  <p class="article-text">bathroom lighting is one of the most technically demanding lighting briefs in the home. it must serve vanity function (task lighting for grooming, shaving, applying make-up), atmospheric function (creating the sense of spa-like calm), and safety function (adequate illumination at the shower and bath). these are partially competing requirements, and resolving them requires layered lighting: natural light where possible (a bathroom with good natural light is incomparably better than one without), warm LED task lighting at the vanity (wall-mounted on both sides of the mirror, not overhead, to eliminate unflattering shadows), and dimmer-controlled ambient lighting for evening use. <a href="https://www.bega.com/en/lighting-design/bathrooms" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">bega's bathroom lighting guides</a> are among the most technically rigorous resources available and are worth reading before any fixture specification.</p>
  <h3 class="article-subhead">fixtures: spend where it matters</h3>
  <p class="article-text">not all fixtures warrant equal investment. the areas where quality specification has the most impact: tapware (touched multiple times daily, and tactile quality is immediately perceptible — <a href="https://www.grohe.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">grohe</a> and <a href="https://www.hansgrohe.com/in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">hansgrohe</a> remain the benchmark in india at their respective price tiers); the shower system (flow rate, head positioning, thermostatic control); and the bath, if specified. sanitary ware — WCs, basins — can often be specified from mid-tier ranges without perceptible quality compromise, as long as the form is correct for the design. the money saved can be reinvested in material and lighting quality, where the return is greater.</p>
  <p class="article-text">designing or redesigning a master bathroom and want to explore the possibilities? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">our bathroom design consultations</a> are among the most focused and practical services we offer.</p>`
};

articles['seo15'] = {
  cat: 'client guide',
  title: 'how to write a brief your interior designer will actually love',
  date: 'october 2024',
  readTime: '7 min read',
  img: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200&q=80',
  lead: "a good brief is the most underrated tool a client has. it saves time, prevents misalignment, and produces dramatically better design outcomes. here's exactly how to write one.",
  body: `
  <p class="article-text">the brief is the most consequential document in any interior design project — and the most neglected. most clients begin the design process with a conversation: some references saved on pinterest, a rough budget number, and a set of preferences articulated in real time. this is not a brief. it is the raw material from which a brief might eventually be assembled. the difference between a client who provides a thorough written brief and one who doesn't is, in our experience, approximately three months of calendar time and a substantial proportion of the design fee — because the former enables the designer to start designing, and the latter requires the designer to spend weeks extracting the information the brief would have contained.</p>
  <h3 class="article-subhead">the six components of a useful brief</h3>
  <p class="article-text">a useful interior design brief contains six things. first, a description of how you actually live — not how you aspire to live, but how you currently live. when do you wake? where do you spend most of your time? how do you cook? do you work from home, and where? how often do you entertain, and in what format? how many people are in the household, and how does that number change over a year? this is the most valuable information a designer can receive, and it is almost never volunteered without being asked.</p>
  <h3 class="article-subhead">budget: the honest number</h3>
  <p class="article-text">the second component is budget — the real number, not the aspirational one. the <a href="https://www.iiid.net" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">institute of indian interior designers</a> publishes indicative cost benchmarks for residential fitout in indian cities, updated annually — a useful reference for calibrating expectations before briefing a designer. a designer who knows your real budget from the start can design for it. a designer who discovers the real budget three months in must either redesign or compromise. neither outcome serves you.</p>
  <h3 class="article-subhead">timeline: the constraints and the fixed dates</h3>
  <p class="article-text">third: timeline. not just the desired completion date, but the fixed constraints within it. a child starting school in september. a wedding in march. a lease expiry. these are the dates that actually govern the project, and they must be disclosed upfront so the designer can build a realistic programme. timelines that are concealed or optimistically understated produce projects that miss deadlines and accumulate stress costs on both sides of the relationship.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the best brief is not a wishlist. it is an honest account of a life — its rhythms, its needs, its non-negotiables."</div></div>
  <h3 class="article-subhead">the non-negotiables vs the preferences</h3>
  <p class="article-text">fourth: a clear distinction between non-negotiables and preferences. non-negotiables are the requirements that are genuinely fixed — a home office that can be fully closed off, a kitchen large enough for two people to cook simultaneously, a bathroom with a bath rather than just a shower. preferences are the things you'd like if the design permits — a particular material, a colour direction, a specific aesthetic reference. conflating these two categories forces designers to spend creative energy optimising for constraints that aren't actually constraints, and to miss the ones that are.</p>
  <h3 class="article-subhead">the reference audit</h3>
  <p class="article-text">fifth: visual references — but curated and explained. a pinterest board of 200 images is not a reference brief. it is a data dump that requires significant interpretation. a curated selection of 10–15 images, each annotated with what specifically appeals about it (the material? the proportions? the light quality? the mood?), is a design instrument. the <a href="https://www.dezeen.com/interiors/" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">dezeen interiors archive</a> and <a href="https://www.archdigest.com/rooms/interiors" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">architectural digest's rooms section</a> are the most useful curated sources for high-quality reference imagery, and are worth browsing before preparing a brief.</p>
  <h3 class="article-subhead">the anti-brief: what you don't want</h3>
  <p class="article-text">sixth, and frequently the most useful: the anti-brief. a clear statement of what you do not want — aesthetics you actively dislike, design decisions that have frustrated you in previous homes, materials you find uncomfortable, spaces that have never felt right. negative preference data is as design-determining as positive preference data, and is far less commonly provided. if any aspect of assembling a brief feels overwhelming, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">our discovery sessions</a> are specifically structured to help you articulate it — we ask the questions, you answer them, and we document the responses into a working brief on your behalf.</p>`
};

// ══ 5 NEW SEO ARTICLES (seo16–seo20)
articles['seo16'] = {
  cat: 'india market',
  title: 'how much does interior design cost in india? a complete 2025 breakdown',
  date: 'march 2025',
  readTime: '10 min read',
  img: 'https://images.unsplash.com/photo-1600210491892-03d54741ef7a?w=1200&q=80',
  lead: "from per-square-foot rates to full turnkey fees, this is the most transparent breakdown of interior design pricing in india — what you get at every level, and where the hidden costs actually live.",
  body: `
  <p class="article-text">the single most googled question in indian interior design is some variation of: how much will this cost me? it is also the question most designers answer vaguely, because the honest answer is complicated and the uncomfortable ones drive clients away. we've decided to answer it completely — because a client who understands costs is a client who can make good decisions, and that makes our work better.</p>
  <h3 class="article-subhead">the three pricing models you'll encounter</h3>
  <p class="article-text">interior design in india is priced in three primary ways. the first is per-square-foot, which is the most common and the most misleading. a designer who quotes ₹1,200 per sq ft and one who quotes ₹800 per sq ft are not necessarily offering different qualities of design — they may be bundling different elements into that figure. always ask: what does the per-sq-ft fee include? does it cover design fees only, or does it include materials and execution? the <a href="https://www.iiid.net" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">institute of indian interior designers (IIID)</a> recommends that design fees be quoted separately from construction and material costs — a convention that is unfortunately not yet universal in the indian market.</p>
  <p class="article-text">the second model is a percentage of project cost: the designer charges 10–15% of the total project cost as their fee, with the remainder going to materials, vendors, and contractors. this aligns incentives sensibly (the designer benefits from finding good value, not from specifying expensive materials), but requires the client to trust the designer's procurement judgement. the third model — fixed design fee plus client-managed procurement — gives the client maximum cost transparency but requires significant time and attention from the client themselves.</p>
  <h3 class="article-subhead">what does interior design actually cost in delhi in 2025?</h3>
  <p class="article-text">for a premium 3BHK apartment (approximately 2,000 sq ft of carpet area) in south or central delhi, a complete interior fitout in 2025 — including design fees, all joinery, furniture, materials, lighting, and project management — typically ranges from ₹35 to ₹90 lakhs, depending on specification level. this breaks down roughly as follows. design fees for a firm of established reputation: ₹4–8 lakhs. custom joinery and built-ins (wardrobes, kitchen, study): ₹10–18 lakhs. loose furniture (sofas, beds, dining, occasional pieces): ₹6–14 lakhs. flooring (tile, wood, stone): ₹4–8 lakhs. lighting (fixtures, cabling, controls): ₹2–5 lakhs. soft furnishings (curtains, rugs, cushions): ₹2–5 lakhs. works and art: ₹1–4 lakhs. project management and contingency: 10–15% of total.</p>
  <p class="article-text">according to <a href="https://www.99acres.com/articles/interior-design-cost-india.html" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">99acres' 2024 interior design cost survey</a>, the average all-in cost for a premium 3BHK renovation in delhi-ncr has risen 22% since 2022, driven largely by material costs and imported fixture pricing following rupee depreciation. this trajectory is expected to continue through 2025.</p>
  <h3 class="article-subhead">villa and bungalow projects: a different calculus</h3>
  <p class="article-text">for independent villa or bungalow projects — typically 4,000–10,000 sq ft — the cost dynamics change significantly. larger homes benefit from efficiencies in joinery and material procurement, but have more complex spatial requirements (staircases, double-height volumes, multiple bedroom suites, landscape interface) that add design complexity. a well-specified 6,000 sq ft villa in delhi or gurgaon should be budgeted at ₹1.5–3.5 crores for a complete interior fitout. for farmhouse and resort-adjacent properties in haryana or rajasthan, material transportation costs and local contractor limitations frequently add 15–25% to urban equivalents.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the cheapest interior is the one done right the first time. the most expensive is the one that needs to be redone."</div></div>
  <h3 class="article-subhead">the hidden costs most clients don't account for</h3>
  <p class="article-text">the costs that most frequently surprise clients are not the visible ones — it is the structural works required to achieve the design (breaking down walls, relocating plumbing, upgrading electrical infrastructure), the cost of living elsewhere during execution (which in delhi ranges from ₹80,000–₹2,50,000/month for temporary accommodation equivalent to the home being renovated), and the cost of variation orders generated by client changes during execution. the <a href="https://www.credai.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">confederation of real estate developers' associations of india (CREDAI)</a> has documented that variation orders account for an average 12% cost overrun on residential interior projects — almost entirely avoidable with thorough pre-execution design resolution.</p>
  <h3 class="article-subhead">how to evaluate whether you're getting value</h3>
  <p class="article-text">value in interior design is not the lowest cost — it is the best outcome for the investment made. the markers of a firm that delivers value: they invest heavily in the design phase (drawings, models, material samples, specification documents), because every hour spent on design saves multiple hours of expensive site correction. they have established contractor relationships with track records you can verify. they provide a detailed specification document before work begins, not after. they provide a complete cost breakdown before you commit to execution, not mid-project. and their completed projects look as good in person as they do in photographs — which is the final test that matters. if you'd like to discuss your project's cost structure before committing to any designer, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we offer initial consultations</a> that include a frank cost assessment based on your specific brief and location.`
};

articles['seo17'] = {
  cat: 'villa & farmhouse',
  title: 'designing a luxury villa in india: what separates the extraordinary from the expensive',
  date: 'february 2025',
  readTime: '9 min read',
  img: 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=1200&q=80',
  lead: "india's finest villas share one quality that no budget can buy: spatial intelligence. we examine what makes a villa truly luxurious — from site planning through to the last door handle.",
  body: `
  <p class="article-text">india is building more villas than at any point in its history. across delhi-ncr, bangalore, hyderabad, mumbai's periphery, and the growing second-home markets of rajasthan, goa, and himachal pradesh, ambitious homeowners are investing crores in properties that will define their family's quality of life for decades. and yet a significant proportion of these villas — however expensively appointed — will never feel truly luxurious. they will feel expensive. the two are not the same thing, and understanding the difference before you begin is the most valuable thing this article can offer you.</p>
  <h3 class="article-subhead">the site is the design</h3>
  <p class="article-text">the most consequential design decisions in a villa happen before a single interior element is chosen — they happen when the building is positioned on its site, when the orientation of the primary rooms is determined, and when the relationship between indoor and outdoor space is resolved. a villa oriented correctly to capture morning light in the breakfast room, prevailing breeze through the living areas, and sheltered sun in the pool zone will feel luxurious regardless of how it is furnished. a villa oriented incorrectly will feel uncomfortable regardless of how much is spent inside it. <a href="https://www.architecturaldigest.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">architectural digest india</a> has documented several of india's finest contemporary villas, and the commonality across all of them is site intelligence, not material expenditure.</p>
  <h3 class="article-subhead">the hierarchy of spaces</h3>
  <p class="article-text">a well-designed villa has a clear spatial hierarchy: a sequence of spaces that moves the inhabitant from public to private, from activity to rest, with each transition feeling considered and appropriate. the entrance sequence — from gate to door — should be designed as deliberately as any room. it sets the register for everything that follows. the public rooms (entrance hall, drawing room, dining, verandah) should be generous and capable of supporting formal entertaining without feeling cavernous when used privately. the private rooms (bedrooms, family room, studies) should be insulated — acoustically and visually — from the public zone. this hierarchy, when executed well, is what makes a villa feel like a home rather than a hotel.</p>
  <p class="article-text">according to research by <a href="https://www.jll.co.in/en/trends-and-insights/research/residential" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">jll india's residential research division</a>, demand for luxury independent villas in delhi-ncr has grown 47% between 2022 and 2024, with the ₹5–15 crore segment seeing the most significant activity. the segment is growing faster than the supply of designers capable of executing at the required standard — making the selection of the right design partner the most important decision a villa client will make.</p>
  <h3 class="article-subhead">material authenticity at villa scale</h3>
  <p class="article-text">at villa scale, material choices have implications they do not have in apartments. stone used internally and externally must weather the indian climate — extreme heat, monsoon humidity, and temperature cycling — while maintaining its appearance and structural integrity. indian marble varieties such as makrana, kishangarh, and banswara have been proven over centuries in this climate; imported european marbles are beautiful but require more careful maintenance specification. the <a href="https://www.stoneetc.co.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">stone etc. showroom in delhi</a> carries one of india's finest selections of both domestic and imported natural stone and is an essential reference point for any villa specification.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the extraordinary villa is not the one with the most expensive materials. it is the one where every room feels exactly as it should — in every season, at every time of day."</div></div>
  <h3 class="article-subhead">landscape as interior</h3>
  <p class="article-text">the finest villas treat the landscape as an extension of the interior — a series of outdoor rooms with their own spatial logic, materials, and lighting. the transition between inside and outside should be as considered as any internal junction. level changes, threshold materials, covered and uncovered zones, the positioning of the pool relative to the principal rooms, the planting strategy that provides privacy without enclosure — these are design decisions, not landscape contractor decisions. organisations like the <a href="https://www.isola.co.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">isola design group</a> in india specialise in the integration of landscape and interior at villa scale and represent the quality standard that premium villa projects should aspire to.</p>
  <h3 class="article-subhead">the service infrastructure</h3>
  <p class="article-text">a luxury villa must function as well as it looks. the service infrastructure — staff quarters, service entries, laundry, back-of-house storage, generator, water storage, and home automation — must be planned with the same rigour as the principal spaces. a villa that functions poorly — where staff are visible when they shouldn't be, where generator noise intrudes, where water pressure fluctuates — will never feel luxurious regardless of its aesthetic quality. these systems should be designed in from the start, not retrofitted later at significant cost and visual compromise. if you are planning a villa project and want an honest assessment of your brief's completeness, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">a consultation with indéva</a> is specifically designed for this stage.`
};

articles['seo18'] = {
  cat: 'client guide',
  title: 'interior designer vs architect: who do you actually need for your project?',
  date: 'january 2025',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1551516594-56cb78394645?w=1200&q=80',
  lead: "the difference between an interior designer and an architect is not just training — it is philosophy, scope, and legal responsibility. knowing which you need can save your project from the start.",
  body: `
  <p class="article-text">this is among the most frequently misunderstood questions in the indian design market. clients often begin a project with one type of professional and discover, at significant cost, that they needed the other — or needed both, in the right sequence. the confusion is understandable: the boundaries between the two disciplines are not always clearly communicated, and a number of practitioners operate in both domains simultaneously. here is a clear framework for thinking about which professional you need, when, and why.</p>
  <h3 class="article-subhead">what an architect does — and what they're legally responsible for</h3>
  <p class="article-text">an architect in india is a licensed professional regulated by the <a href="https://www.coa.gov.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">council of architecture</a> under the architects act, 1972. they are legally authorised — and in most municipal jurisdictions legally required — to prepare and certify the drawings submitted for building plan approval. they are responsible for structural logic, building envelope, fire safety compliance, and setback and coverage regulations. if your project involves new construction, significant structural modifications (removing load-bearing walls, adding floors, modifying the building envelope), or requires municipal approval, you legally require a registered architect. an interior designer cannot substitute for this role, regardless of how experienced they are.</p>
  <p class="article-text">according to the <a href="https://www.coa.gov.in/guidelines.php" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">council of architecture's practice guidelines</a>, there are approximately 1,20,000 registered architects in india — a figure that sounds large until you consider the scale of construction activity. in delhi alone, building plan applications run to tens of thousands per year. the practical implication: good architects are in demand and book well in advance. if your project requires one, begin that search earlier than you think necessary.</p>
  <h3 class="article-subhead">what an interior designer does — and where they excel</h3>
  <p class="article-text">an interior designer's expertise lies in the spatial experience within a building's existing envelope. this includes spatial planning (how rooms are laid out and connected), material and finish specification, lighting design, furniture selection and custom specification, joinery and built-in design, colour strategy, and the procurement and coordination of everything that goes inside a completed shell. interior design is not regulated in india in the same way architecture is — there is no licensing requirement equivalent to the architects act — which means the quality range among practitioners is extremely wide. the <a href="https://www.iiid.net" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">institute of indian interior designers (IIID)</a> is the primary professional body, and membership — particularly at fellowship level — is a useful signal of experience and commitment to professional standards.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the architect gives you the building. the interior designer gives you the experience of living inside it. the best projects need both — but not always simultaneously."</div></div>
  <h3 class="article-subhead">the sequencing question: who comes first?</h3>
  <p class="article-text">for new construction or major renovation, the architect should come first — they establish the spatial envelope within which the interior designer will work. the relationship between the two disciplines is most productive when the interior designer is involved during the architectural stage, influencing decisions that affect the interior quality: ceiling heights, window positions, structural bay sizes, service routes. involving the interior designer after the architecture is complete means accepting spatial decisions that may compromise the interior — lower ceiling heights, windows in inconvenient positions, columns that interrupt furniture arrangements. the ideal sequence is overlapping engagement, not serial handover.</p>
  <h3 class="article-subhead">the firm that does both: what to look for</h3>
  <p class="article-text">some firms — including indéva — operate across both architecture and interior design, providing integrated services from structural concept through to final styling. this integration eliminates the most common point of failure in design projects: the handover between architect and interior designer, where spatial decisions get locked in before interior requirements are fully understood. when evaluating a firm that claims both capabilities, ask specifically: who does the architectural work, are they registered with the council of architecture, what is the process for coordinating between the architectural and interior phases, and can you see examples of projects where both services were delivered? a firm that answers these questions confidently and specifically is one worth trusting. <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we're happy to walk you through our integrated process</a> in a conversation before you commit to any direction.`
};

articles['seo19'] = {
  cat: 'india market',
  title: 'vastu and modern interior design: how to honour both without compromising either',
  date: 'december 2024',
  readTime: '9 min read',
  img: 'https://images.unsplash.com/photo-1600566752229-250ed79470f8?w=1200&q=80',
  lead: "vastu shastra and contemporary design are not in conflict — if you understand what each is actually asking for. here is how india's best designers reconcile ancient principles with modern living.",
  body: `
  <p class="article-text">vastu shastra is among the most frequently mentioned requirements in indian interior design briefs, and among the least well understood. clients invoke it as a constraint without always being able to articulate what it specifically requires. some designers dismiss it as superstition. others treat it as absolute and allow it to override spatial logic that would produce a better-functioning home. both approaches produce poor outcomes. the productive relationship between vastu and contemporary design requires understanding what vastu is actually doing — and what it isn't.</p>
  <h3 class="article-subhead">what vastu shastra actually says</h3>
  <p class="article-text">vastu shastra — literally "the science of dwelling" — is a traditional hindu system of architecture and spatial arrangement developed over several thousand years. its core logic is directional: it assigns qualities and functions to the eight cardinal and sub-cardinal directions, and prescribes which activities and spaces should occupy which zones. the northeast (ishan) is associated with water and lightness — kitchens here are considered inauspicious because fire opposes water. the southeast (agni) is associated with fire — the kitchen belongs here. the southwest is associated with earth and stability — the master bedroom belongs here, as the heaviest room in the home. the north and east, receiving morning light, are considered auspicious for living spaces and entrances. <a href="https://www.vaastu.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">the vastu shastra foundation of india</a> maintains rigorous documentation of classical principles that is worth consulting before engaging any practitioner who claims vastu expertise.</p>
  <h3 class="article-subhead">where vastu and environmental design align</h3>
  <p class="article-text">here is what is genuinely interesting about vastu's directional prescriptions: many of them produce environments that are, by modern environmental psychology and passive design standards, genuinely better. a kitchen in the southeast receives morning light — useful for the preparation of breakfast. a master bedroom in the southwest is shielded from both morning and afternoon sun, making it naturally cooler and darker for sleep. north and east-facing living spaces receive consistent, glare-free light throughout the day — the optimal condition for comfort and visual comfort. the <a href="https://www.igbc.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indian green building council's</a> passive design guidelines align, in several key respects, with vastu prescriptions — not because the ancient system anticipated modern science, but because both are responding to the same physical realities of light, heat, and wind in the indian subcontinent.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"vastu and contemporary design are most often in conflict not with each other, but with the site's orientation. understand the site first."</div></div>
  <h3 class="article-subhead">where the conflicts arise — and how to resolve them</h3>
  <p class="article-text">genuine conflicts between vastu principles and good contemporary design most commonly arise from one source: the site itself is oriented in a direction that makes vastu compliance and spatial quality mutually exclusive. a plot oriented with its long axis east-west, in a vastu framework, prescribes the entrance on the north or east face — but the site's relationship to the road, the street, and the neighbouring buildings may make a south or west entrance the only functionally sensible option. in these cases, we take the following approach: prioritise the spatial decisions that have the greatest impact on how the home functions and feels; apply vastu principles where they can be implemented without spatial compromise; and where a genuine conflict exists, explain it clearly to the client so they can make an informed decision rather than a constrained one.</p>
  <h3 class="article-subhead">remedies: what works and what doesn't</h3>
  <p class="article-text">the vastu remedy industry — crystals, yantras, colour applications, mirrors positioned to "correct" directional violations — is largely without empirical foundation and frequently misused. a mirror placed in the northeast to "activate" the water zone will not overcome a kitchen that is structurally fixed in the wrong location. remedies are most legitimate when they address a real spatial condition: a southeast kitchen that lacks cross-ventilation can be improved with specific exhaust positioning; a northeast bathroom (considered inauspicious) can be made less heavy through lighter material choices and generous natural light. these are good design decisions that happen to align with the remedy's logic — but they work for design reasons, not ritual ones.</p>
  <h3 class="article-subhead">working with a vastu consultant</h3>
  <p class="article-text">if vastu compliance is important to you, we recommend engaging a qualified vastu consultant at the briefing stage — before design begins — rather than at the end as a corrective exercise. the <a href="https://www.vaastu.org/consultants" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">vastu shastra foundation</a> maintains a directory of certified practitioners. their input, received early, can be integrated into the spatial logic of the design without compromising it. received late, it produces retrofitted compromises that satisfy neither vastu principles nor good design. if you're working on a project where vastu compliance is part of the brief, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">we have extensive experience</a> integrating these requirements into architecturally rigorous outcomes.`
};

articles['seo20'] = {
  cat: 'client guide',
  title: 'how to hire an interior designer in india: the questions every client should ask',
  date: 'november 2024',
  readTime: '10 min read',
  img: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?w=1200&q=80',
  lead: "most clients choose a designer on the basis of portfolio photographs. here is a better way — the twelve questions that reveal whether a designer is right for your project before a single rupee changes hands.",
  body: `
  <p class="article-text">choosing an interior designer is one of the highest-stakes decisions in a renovation project. you are entering a relationship that will last 6–18 months, during which a significant proportion of your disposable wealth will be spent, and the quality of your daily life for years afterwards will be determined. and yet most clients make this decision based on a portfolio of photographs, an initial meeting chemistry, and a quoted fee. this is an insufficient basis for a decision of this magnitude. here are the twelve questions that we believe every client should ask — and what the answers reveal.</p>
  <h3 class="article-subhead">question 1: can i speak to three previous clients, not two?</h3>
  <p class="article-text">every design firm will provide two references. two references can be curated to exclude anyone unhappy. three is harder to curate — and the third reference often provides information the first two don't. when speaking to references, ask specifically: did the project complete on time? did it complete within the agreed budget? were there variation orders, and how were they handled? would you use this designer again — and if not, why not? a designer confident in their track record will provide three references without hesitation.</p>
  <h3 class="article-subhead">question 2: who will actually work on my project?</h3>
  <p class="article-text">in many design firms, the principal — whose name and portfolio you reviewed — will not be the person managing your project. a junior associate will handle day-to-day decisions, with the principal appearing at key presentations. this is not necessarily a problem — good firms have good teams — but it should be disclosed, and the client should meet the person who will actually be their point of contact before signing any agreement. the <a href="https://www.iiid.net/publications" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">IIID's guide to engaging an interior designer</a> specifically recommends clarifying project staffing before appointment.</p>
  <h3 class="article-subhead">question 3: what does your design process look like, week by week?</h3>
  <p class="article-text">a designer who can answer this question specifically — what deliverable is produced in week one, what decisions are required from the client in week three, what the sign-off process is before moving to execution — is a designer who has a process. a designer who answers in generalities ("we work collaboratively to develop your vision") does not. process is not bureaucracy — it is the mechanism by which good design is protected through execution.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the right designer for your project is not the most famous, the most expensive, or the most liked. it is the one who understands how you actually live."</div></div>
  <h3 class="article-subhead">question 4: what happens if i change my mind mid-project?</h3>
  <p class="article-text">client-initiated changes during execution are the primary source of cost overruns and project delays in indian interior design. how a designer handles change orders — whether they have a clear policy, whether they document changes formally, whether they assess the cost and timeline impact before proceeding — reveals the maturity of their practice. a designer who says "of course, we can change that, no problem" without a formal change control process is a designer who will produce a disputed final invoice.</p>
  <h3 class="article-subhead">question 5: who are your contractors and how long have you worked with them?</h3>
  <p class="article-text">the relationship between a designer and their contractor is as important as the relationship between a designer and their client. a designer who has worked with the same principal contractor for three or more years has a relationship built on accountability — the contractor understands the designer's quality standards, and the designer knows the contractor's capabilities and limitations. a designer who appoints a new contractor for each project is introducing a relationship risk that the client bears. according to the <a href="https://www.credai.org" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">confederation of real estate developers of india</a>, contractor selection is the single variable most correlated with project outcome quality in residential fitout.</p>
  <h3 class="article-subhead">questions 6–12: the deeper due diligence</h3>
  <p class="article-text">the remaining seven questions are: how do you handle a situation where something goes wrong on site? (reveals accountability and communication). what is included in and excluded from your design fee? (reveals transparency). do you have professional indemnity insurance? (reveals professionalism). how do you document material specifications — can i see an example specification sheet from a previous project? (reveals rigour). what is your policy on procurement commissions from vendors? (reveals whether you have a conflict of interest in your recommendations). how do you handle the final handover? (reveals whether they stay engaged through completion). and finally: what has gone wrong on a previous project, and how did you resolve it? (reveals character — anyone who says nothing has gone wrong is either dishonest or inexperienced).</p>
  <h3 class="article-subhead">what to do with the answers</h3>
  <p class="article-text">the purpose of these questions is not to produce a score — it is to reveal how the designer thinks under scrutiny. a designer who answers all twelve questions specifically, honestly, and without defensiveness is a designer whose practice is built on solid foundations. one who deflects, generalises, or becomes uncomfortable with the questions is showing you something important before you've committed anything. at indéva, we welcome every one of these questions and provide documentary evidence where it's appropriate. <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">start that conversation here</a> — and bring your most difficult questions.`
};

// ══ NEW SEO BLOGS seo21–seo25

articles['seo21'] = {
  cat: 'interior design cost',
  title: 'interior design cost in india: a complete guide for 2025',
  date: 'march 2026',
  readTime: '10 min read',
  img: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=1200&q=80',
  lead: 'interior design pricing in india varies enormously — from ₹800 per sqft to ₹8,000 and beyond. here is an honest, detailed breakdown of what you are actually paying for, and what determines where your project lands.',
  body: `
  <p class="article-text">the single most common question we receive from prospective clients is: how much does interior design cost in india? the honest answer is: it depends — but not randomly. every variable that determines cost can be explained, understood, and used to make a more informed decision. this guide covers all of them.</p>
  <h3 class="article-subhead">the four pricing models used by indian designers</h3>
  <p class="article-text"><strong>per square foot (most common):</strong> the industry most commonly quotes a per-sqft rate covering design fees and basic execution. for mid-range residential projects in delhi-ncr, this typically ranges from ₹1,200 to ₹2,500 per sqft. for luxury residential work — which involves higher material specifications, custom furniture, and senior design attention — the range is ₹3,000 to ₹6,000 per sqft. ultra-luxury projects with imported materials and extensive custom fabrication can exceed ₹8,000 per sqft.</p>
  <p class="article-text"><strong>percentage of project cost (common for high-value projects):</strong> the designer charges 10–18% of the total project value as a design and project management fee. this aligns the designer's financial interest with quality — the better the outcome, the more justified the fee. it also means the designer has no incentive to over-specify materials.</p>
  <p class="article-text"><strong>fixed design fee + separate execution:</strong> the designer charges a fixed fee for drawings, specifications, and design management. execution is contracted separately. this model provides the clearest separation of design value from procurement value and is increasingly preferred by sophisticated clients.</p>
  <p class="article-text"><strong>retainer model (used for large or long-duration projects):</strong> a monthly retainer covers the designer's availability and attention. common for commercial projects and large residences where the engagement spans 12+ months.</p>
  <h3 class="article-subhead">what drives cost up</h3>
  <p class="article-text">imported materials: italian marble, european hardware, french upholstery fabrics — each adds significantly to material cost without necessarily improving design quality. a skilled designer can achieve comparable aesthetic results with premium indian materials at 30–40% lower cost. custom fabrication: custom furniture, custom joinery, and custom lighting fixtures are significantly more expensive than catalogue alternatives but produce spaces that cannot be replicated. acoustic and smart-home systems: home automation, multi-room audio, motorised blinds, and acoustic treatment are specialist sub-disciplines with significant cost implications. site conditions: older properties, properties requiring structural interventions, or properties with challenging access conditions add cost that no designer can avoid.</p>
  <h3 class="article-subhead">what you should not economise on</h3>
  <p class="article-text">flooring and surfaces: the materials that bear the most daily contact — floors, countertops, cabinet faces — are the materials that deteriorate most visibly when under-specified. saving on these is a short-term decision with long-term consequences. hardware: handles, hinges, locks, and tapware are touched hundreds of times per day. under-specified hardware fails, loosens, and looks worn within 3–5 years. lighting: good lighting design — which is primarily a labour and planning cost, not a fixture cost — transforms how a space feels. it cannot be added retrospectively without significant disruption. waterproofing: invisible until it fails. a waterproofing failure in a bathroom or terrace typically costs 3–5x its original prevention cost to remediate.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the question is never how much does it cost. it is always: what am i actually getting for this number — and what will it cost me if i choose wrong?"</div></div>
  <h3 class="article-subhead">typical total project costs in delhi-ncr (2025)</h3>
  <p class="article-text">a 2bhk apartment (1,200–1,500 sqft) with mid-range specifications: ₹18–32 lakhs total. a 3bhk apartment (1,800–2,500 sqft) with good specifications: ₹35–60 lakhs total. a 4bhk apartment or independent floor (3,000–4,500 sqft) with luxury specifications: ₹90 lakhs – ₹1.8 crore. a full villa (6,000+ sqft) with ultra-luxury specifications: ₹2.5 crore and above. these figures include design fees, materials, furniture, and execution. they exclude loose furnishings (sofas, beds, soft furnishings purchased separately), art, and landscaping.</p>
  <p class="article-text">these are honest estimates based on current market rates. for a specific cost estimate on your project, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">request a consultation from indéva</a>. we provide detailed project cost frameworks before any commitment is made.`
};

articles['seo22'] = {
  cat: 'home renovation',
  title: 'home renovation in delhi: what to know before you begin',
  date: 'march 2026',
  readTime: '9 min read',
  img: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1200&q=80',
  lead: 'renovating a home in delhi involves decisions that most guides do not prepare you for — from rwa permissions and structural surveys to contractor accountability and material lead times. here is the complete picture.',
  body: `
  <p class="article-text">home renovation in delhi is a different undertaking from renovation in most other cities. delhi's built environment is diverse — it ranges from dda flats constructed in the 1970s to builder floors completed last year, from heritage bungalows in lutyens' delhi to high-rise apartments in gurugram and noida. each property type carries its own structural considerations, regulatory requirements, and renovation challenges. this guide addresses the full picture.</p>
  <h3 class="article-subhead">before anything else: the structural survey</h3>
  <p class="article-text">the single most important step before committing to any renovation budget is a structural assessment of the property. in older dda and cooperative housing society flats, structural alterations — removal or modification of walls, creation of openings, addition of mezzanine levels — may be prohibited by building bylaws or physically inadvisable due to the construction method. the <a href="https://www.dda.gov.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">delhi development authority</a> publishes building bylaws that govern what alterations are permitted in dda properties. for builder floors and independent properties, a structural engineer's report is essential before any load-bearing modification is planned.</p>
  <h3 class="article-subhead">rwa and society permissions</h3>
  <p class="article-text">if your property is in a residential society or colony governed by an rwa (resident welfare association), you will typically need written permission before beginning any renovation that affects common areas, building façade, or involves heavy construction activity. most rwas in delhi require: a renovation plan submitted by a registered architect or designer, a security deposit against potential common area damage, agreed working hours (typically 9am–6pm on weekdays, restricted or prohibited on sundays), and noise management commitments. failing to obtain rwa permission before beginning work can result in stoppage orders, disputes with neighbours, and difficulties on resale.</p>
  <h3 class="article-subhead">the contractor problem in delhi</h3>
  <p class="article-text">delhi's construction labour market is large, skilled, and largely unregulated. this creates both opportunity and risk. the opportunity: skilled craftspeople — from marble cutters to traditional plasterwork specialists — are available at relatively competitive rates. the risk: without accountability structures, quality control is dependent entirely on supervision. the most common renovation failures in delhi — waterproofing that fails within two years, tiling that moves, joinery that warps — are almost always attributable not to material failure but to supervision failure. a designer or project manager who is on-site consistently is worth more than any material upgrade.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"in delhi, the difference between a renovation that lasts twenty years and one that needs redoing in five is almost always supervision, not specification."</div></div>
  <h3 class="article-subhead">material lead times to plan for</h3>
  <p class="article-text">imported materials (italian stone, european cabinetry, specialty hardware) carry lead times of 8–16 weeks from order to delivery. custom furniture — even furniture made in delhi — requires 6–10 weeks from final design approval to delivery. bespoke joinery from reputable fabricators carries 4–8 week lead times. these timelines must be planned into the project schedule from the outset; late ordering is the most common cause of project delay in delhi residential renovations. the renovation market in delhi is also seasonal — contractors are significantly busier between october and march (the post-monsoon construction season), which affects both availability and pricing.</p>
  <h3 class="article-subhead">a realistic renovation timeline</h3>
  <p class="article-text">a complete 3bhk renovation (full civil, electrical, plumbing, joinery, furniture, and finishing) in delhi typically takes 5–8 months from design sign-off to handover, assuming good project management and no significant structural interventions. partial renovations — single rooms, kitchen and bathrooms only — can be completed in 6–10 weeks. any timeline shorter than these should be approached with scepticism; the most common cause of cost overruns is rushing execution phases that require curing and settling time.</p>
  <p class="article-text">planning a renovation in delhi? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indéva offers pre-renovation consultations</a> that assess your property, brief, and budget before any commitment — saving time, money, and frustration downstream.`
};

articles['seo23'] = {
  cat: 'modular kitchen',
  title: 'modular kitchen design in india: what actually matters in 2025',
  date: 'february 2026',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=80',
  lead: 'the modular kitchen market in india is flooded with nearly identical products at wildly different price points. here is how to cut through the marketing, understand what you are really buying, and make a decision you will not regret.',
  body: `
  <p class="article-text">the indian modular kitchen market has grown explosively over the past decade. organised players like godrej interio, livspace, homelane, and hafele have been joined by hundreds of smaller fabricators in every city. the result is a market of enormous choice — and enormous confusion. most clients are sold on finish photographs and brand reputation without understanding the underlying variables that determine whether a kitchen will look good and function well after ten years of daily use. this guide addresses those variables directly.</p>
  <h3 class="article-subhead">the box matters more than the shutter</h3>
  <p class="article-text">the most important component of a modular kitchen is the carcass — the box that everything hangs from and rests on. most marketing focuses on the shutter (the visible door face), but it is the carcass that determines durability. the standard in india is 18mm commercial-grade plywood or marine plywood for the carcass — these are significantly more moisture-resistant and structurally stable than mdf or particleboard alternatives. the kitchen is a high-moisture environment; any carcass material that swells with humidity will fail within 3–7 years, regardless of how premium the shutter looks. ask your fabricator specifically: what is the carcass material, and what is its bwr (boiling water resistant) rating?</p>
  <h3 class="article-subhead">hardware is the first thing to fail</h3>
  <p class="article-text">hinges, drawer channels, and corner mechanisms are opened and closed thousands of times per year. the difference between good and poor hardware is measured in years of smooth operation versus years of sticking, dropping, and misalignment. the industry gold standard is <a href="https://www.hettich.com/en_IN" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">hettich</a> and <a href="https://www.hafele.com/in/en/" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">hafele</a> fittings, which are tested to 80,000–100,000 open-close cycles. a kitchen with premium carcass and premium hardware will outlast a kitchen with premium shutters and economy hardware by a significant margin.</p>
  <h3 class="article-subhead">counter top material: the honest guide</h3>
  <p class="article-text"><strong>granite</strong> remains the most practical choice for indian cooking conditions — high heat tolerance, scratch resistance, and genuine longevity. its weakness is its aesthetic heaviness; it requires careful pattern and colour selection. <strong>quartz (engineered stone)</strong> offers a contemporary look with good durability, but is not heat-proof — pots from the stove placed directly on quartz will cause thermal shock damage. <strong>corian and solid surface</strong> materials are seamless, easy to maintain, and available in contemporary finishes, but are softer than stone and susceptible to scratching. <strong>italian and indian marble</strong> is unmatched aesthetically but requires sealing, is susceptible to staining from acidic foods (citrus, turmeric), and demands careful maintenance discipline. beautiful in the right context; problematic in a working kitchen used daily for indian cooking.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the kitchen that looks best on day one is not always the kitchen that performs best on day 3,650. choose accordingly."</div></div>
  <h3 class="article-subhead">layout: the work triangle remains correct</h3>
  <p class="article-text">kitchen design theory has produced many layout models, but the fundamental principle — that the three primary work points (refrigerator, sink, cooking range) should be within efficient reach of each other without crossing traffic paths — remains the most reliable guide. the optimal work triangle perimeter is 4–8 metres. beyond this, the kitchen becomes fatiguing to work in. within this constraint, the most functional layouts for indian cooking — which involves simultaneous multiple burner use and significant preparation — are typically the l-shaped or u-shaped configurations, not the galley or single-wall layouts common in smaller apartments.</p>
  <h3 class="article-subhead">what a realistic modular kitchen budget looks like</h3>
  <p class="article-text">a genuinely good quality modular kitchen for a standard 3bhk in delhi — marine ply carcass, german hardware, acrylic or laminate shutters, granite countertop, chimney, hob, and under-counter appliances — will cost ₹3.5–6 lakhs depending on size and configuration. a kitchen with imported lacquered or wooden shutters, quartz countertop, and premium appliances will range from ₹7–15 lakhs. anything significantly below ₹3 lakhs for a full kitchen is almost certainly compromising on carcass material, hardware quality, or both. <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indéva designs and specifies kitchens</a> as part of complete interior projects — with full transparency on material specifications and procurement.`
};

articles['seo24'] = {
  cat: 'interior design tips',
  title: 'small apartment interior design: making 600–1200 sqft feel generous',
  date: 'january 2026',
  readTime: '9 min read',
  img: 'https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?w=1200&q=80',
  lead: 'small apartments demand more design intelligence than large ones, not less. here are the principles — and specific decisions — that make compact indian apartments genuinely spacious to live in.',
  body: `
  <p class="article-text">india's urban housing market is producing smaller apartments than ever. the average new-build apartment in delhi, mumbai, and bengaluru has decreased in size by approximately 15% over the past decade, driven by land cost and affordability pressures. at the same time, buyer expectations for quality of life within those apartments have increased. this tension — smaller spaces, higher expectations — is one of the most interesting design challenges of our time. here is how we approach it.</p>
  <h3 class="article-subhead">the light principle: borrow it aggressively</h3>
  <p class="article-text">natural light is the single most powerful spatial amplifier available. a room that receives generous natural light reads as 20–30% larger than an identical room with poor light. in small apartments, every design decision that affects light should be evaluated with this in mind. partition walls that block light should be replaced with glass partitions or removed entirely where structural conditions permit. doors should be considered for removal or replacement with frameless glass versions. window treatments should maximise daylight — sheer curtains that diffuse rather than block, venetian blinds that redirect light upward to the ceiling, or concealed roller blinds that disappear completely when open.</p>
  <h3 class="article-subhead">storage: the invisible architecture</h3>
  <p class="article-text">the defining characteristic of a well-designed small apartment is that storage is invisible. every centimetre of wall height to ceiling should be considered for storage — not just to the standard 6–7 foot height but to the full ceiling height, using upper zones for seasonal items. under-bed storage, integrated into a platform bed with hydraulic lifts, recovers the single largest under-used volume in any bedroom. window seats with integrated storage solve the twin problems of seating and storage simultaneously. staircases in duplex apartments offer extraordinary storage potential that most designers underuse. the goal is not to minimise possessions (an unrealistic expectation in indian households) but to give every possession a designated place that allows the living surfaces to remain clear.</p>
  <h3 class="article-subhead">furniture scale is everything</h3>
  <p class="article-text">the most common design mistake in small apartments is full-scale furniture. a 3-seater sofa designed for a 2,500 sqft living room placed in a 400 sqft living area does not simply look large — it changes the spatial experience of the entire room, blocking circulation, limiting peripheral space, and making the room feel crowded regardless of what else is done. the correct approach is to select furniture scaled to the room — shorter sofas, round dining tables (which require less floor space than rectangular alternatives), beds with lower profiles, and chairs with open bases that allow the floor to read through them. japanese design, which has addressed small-space living with great rigour, offers useful reference for what appropriate scale looks like.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"a small apartment designed well is not a compromise. it is a different — and sometimes better — way of living."</div></div>
  <h3 class="article-subhead">vertical emphasis: the ceiling as asset</h3>
  <p class="article-text">small apartments tend to focus design attention on the floor plane. the ceiling — and the vertical dimension generally — is underused. tall, slender elements draw the eye upward and make rooms read taller. floor-to-ceiling shelving and joinery creates a sense of height even in rooms with standard 9-foot ceilings. vertical linear ceiling treatments — shadow gaps, linear coffers running along the length of the room — extend the perceived length of the space. pendant lights hung low over a dining table reduce the apparent volume of the room to a human scale, making the space feel more intimate and complete rather than sparse.</p>
  <h3 class="article-subhead">the palette: restraint and continuity</h3>
  <p class="article-text">a small apartment with four different flooring materials, two wall paint colours, and varied ceiling treatments reads as a series of small rooms. the same apartment with continuous flooring throughout, a consistent wall palette, and a unified material language reads as a single generous space. this does not mean everything must be identical — texture, sheen, and tonal variation within a restrained palette produce interest without fragmentation. the single most effective spatial decision available in any small apartment is continuous flooring from the entrance to the furthest point in the home, without breaks or transitions.</p>
  <p class="article-text">working with a small apartment and want to understand what is genuinely possible within your square footage? <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indéva offers spatial consultations</a> specifically designed to assess what can be achieved before you commit to a full project.`
};

articles['seo25'] = {
  cat: 'false ceiling design',
  title: 'false ceiling design in india: a complete guide to gypsum, pop, and beyond',
  date: 'december 2025',
  readTime: '8 min read',
  img: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=80',
  lead: 'false ceilings are one of the most searched-for interior topics in india — and one of the most poorly understood. here is what actually matters: materials, costs, lighting integration, and the design decisions that separate good ceilings from ones you will regret.',
  body: `
  <p class="article-text">false ceiling design is among the most-searched interior design topics in india, and with good reason: the ceiling is one of the largest surfaces in any room, has enormous impact on the perceived quality of the space, and involves technical decisions — lighting integration, acoustic properties, material behaviour — that are not well-explained in most design guides. this article covers everything that actually matters.</p>
  <h3 class="article-subhead">the three main false ceiling materials: honest comparison</h3>
  <p class="article-text"><strong>gypsum board (drywall):</strong> the material of choice for contemporary, clean-line interiors. gypsum board produces a smooth, paint-ready surface with no visible joints when properly taped and finished. it is lightweight, allows any profile of cove, recess, or shadow gap, and integrates cleanly with linear and recessed lighting. its weakness: it is brittle — a sharp impact will dent or crack it, and it is not moisture-tolerant in its standard form (moisture-resistant variants exist for bathrooms and high-humidity zones). gypsum ceilings in a standard flat typically cost ₹55–120 per sqft for supply and installation, excluding lighting and painting.</p>
  <p class="article-text"><strong>pop (plaster of paris):</strong> the traditional false ceiling material in india, pop allows elaborate moulded profiles, cornicing, and decorative medallions. it is durable and repairable — a crack or dent can be patched invisibly. its weakness is weight (significantly heavier than gypsum) and the labour-intensity of fine finishing. pop is the correct material for classical and traditional aesthetic intentions; it is the wrong material when a clean, contemporary line is the goal, because pop's jointed construction and finishing characteristics produce a different visual result than gypsum's seamless surface.</p>
  <p class="article-text"><strong>wood and wood-effect panels:</strong> solid wood, veneer panels, and wood-effect pvc panels are used in contemporary interiors for warmth and texture. genuine wood ceilings are expensive and require careful specification for fire safety compliance under the <a href="https://www.bis.gov.in" target="_blank" rel="noopener noreferrer" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">bureau of indian standards</a> building codes. wood-effect pvc alternatives are water-resistant and lower cost but have a distinctly synthetic quality that is visible in premium finishes.</p>
  <h3 class="article-subhead">lighting integration: where most false ceilings go wrong</h3>
  <p class="article-text">the most common false ceiling failure is not structural — it is lighting. recessed spotlights placed on a 600mm grid across a ceiling produce what lighting designers call "operating theatre lighting" — flat, shadowless, and fundamentally unflattering to both spaces and the people in them. a well-lit false ceiling uses recessed lights sparingly for task lighting, supplements with cove lighting that washes the ceiling with indirect illumination, and integrates pendant or suspended fixture points at key locations. the ceiling itself should not be the primary light source in a living area — it should be the light's delivery mechanism.</p>
  <div class="article-pull-quote"><div class="article-pull-quote-text">"the worst ceiling is the one that was designed to look good in the shop — not to function in the room."</div></div>
  <h3 class="article-subhead">height loss: the calculation every client should do</h3>
  <p class="article-text">a standard false ceiling reduces room height by 9–12 inches (23–30 cm). in an apartment with a 9-foot (274 cm) floor-to-structural-slab height, this brings the finished ceiling height to approximately 7.5–8 feet (229–244 cm) — which is acceptable for a bedroom but begins to feel low in a living area. where slab heights are generous (10+ feet), this height loss is inconsequential. where slab heights are 8.5 feet or below — common in older dda and cooperative housing — a full false ceiling may produce a room that feels oppressively low. in these cases, partial false ceilings (creating a dropped zone over the dining area or television zone, for example, while leaving the central volume at full height) produce better spatial results.</p>
  <h3 class="article-subhead">what a realistic false ceiling costs in delhi (2025)</h3>
  <p class="article-text">standard flat gypsum ceiling with basic grid lighting layout: ₹55–80 per sqft (installed). gypsum with cove lighting profile and shadow gap detail: ₹90–130 per sqft. pop decorative ceiling with cornice and medallion: ₹120–200 per sqft (depending on detail complexity). these rates exclude electrical wiring, light fixtures, and paint — which together typically add ₹40–70 per sqft for a well-specified residential project. for a complete ceiling design for your home or office, <a href="#contact" onclick="showPage('contact')" style="color:var(--gold);text-decoration:none;border-bottom:1px solid var(--line-gold);">indéva provides detailed specifications</a> as part of every interior project — no vague estimates, no surprises.`
};

// ══ OPEN ARTICLE
function openArticle(id) {
  var a = articles[id];
  if(!a) return;
  var catEl = document.getElementById('article-overlay-cat');
  var contentEl = document.getElementById('articleContent');
  if(catEl) catEl.textContent = a.cat;
  if(contentEl) {
    contentEl.innerHTML = '<div class="article-cat-tag">' + a.cat + '</div>' +
      '<h2 class="article-headline">' + a.title + '</h2>' +
      '<div class="article-meta"><span class="article-meta-item">' + a.date + '</span><span class="article-meta-item">·</span><span class="article-meta-item">' + a.readTime + '</span></div>' +
      '<img src="' + a.img + '" alt="' + a.title + '" class="article-img" width="1200" height="900" decoding="async" loading="lazy">' +
      '<div class="article-lead">' + a.lead + '</div>' +
      a.body;
  }
  var overlay = document.getElementById('article-overlay');
  overlay.classList.add('open');
  overlay.scrollTop = 0;
  document.body.style.overflow = 'hidden';

  // ── SEO: update all meta tags for this article
  var articleUrl = 'https://www.indevastudio.com/insights/' + id;
  var articleTitle = a.title + ' — indéva studio';
  var articleDesc = a.lead.replace(/'/g, "\\'").substring(0, 160);
  var articleImg = a.img || 'https://www.indevastudio.com/og-default.jpg';

  document.title = articleTitle;

  var setMeta = function(id, attr, val) { var el = document.getElementById(id); if(el) el.setAttribute(attr, val); };
  setMeta('canonical-tag',       'href',    articleUrl);
  setMeta('og-type',             'content', 'article');
  setMeta('og-title',            'content', articleTitle);
  setMeta('og-description',      'content', articleDesc);
  setMeta('og-url',              'content', articleUrl);
  setMeta('og-image',            'content', articleImg);
  setMeta('twitter-title',       'content', articleTitle);
  setMeta('twitter-description', 'content', articleDesc);
  setMeta('twitter-image',       'content', articleImg);

  // JSON-LD Article schema
  var jsonld = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": a.title,
    "description": a.lead,
    "image": articleImg,
    "datePublished": a.date,
    "author": { "@type": "Organization", "name": "indéva studio" },
    "publisher": {
      "@type": "Organization",
      "name": "indéva studio",
      "logo": { "@type": "ImageObject", "url": "https://www.indevastudio.com/favicon-32x32.png" }
    },
    "mainEntityOfPage": { "@type": "WebPage", "@id": articleUrl },
    "keywords": a.cat + ", interior design, luxury interiors, indéva studio, new delhi"
  };
  var ldEl = document.getElementById('jsonld-article');
  if(ldEl) ldEl.textContent = JSON.stringify(jsonld);

  // Update URL without page reload (path-based, not hash — Google indexes paths not fragments)
  try { history.pushState({ article: id }, articleTitle, '/insights/' + id); } catch(e) {}
}

function closeArticle() {
  var overlay = document.getElementById('article-overlay');
  overlay.classList.remove('open');
  document.body.style.overflow = '';

  // ── SEO: restore default meta tags
  var defaultTitle = 'indéva studio — luxury interior design, new delhi';
  var defaultDesc  = 'indéva studio is a luxury interior design and architecture studio based in new delhi, india. we design homes, offices, and hospitality spaces with precision, craft, and conviction.';
  var defaultUrl   = 'https://www.indevastudio.com/';
  var defaultImg   = 'https://www.indevastudio.com/og-default.jpg';

  document.title = defaultTitle;

  var setMeta = function(id, attr, val) { var el = document.getElementById(id); if(el) el.setAttribute(attr, val); };
  setMeta('canonical-tag',       'href',    defaultUrl);
  setMeta('og-type',             'content', 'website');
  setMeta('og-title',            'content', defaultTitle);
  setMeta('og-description',      'content', defaultDesc);
  setMeta('og-url',              'content', defaultUrl);
  setMeta('og-image',            'content', defaultImg);
  setMeta('twitter-title',       'content', defaultTitle);
  setMeta('twitter-description', 'content', defaultDesc);
  setMeta('twitter-image',       'content', defaultImg);

  var ldEl = document.getElementById('jsonld-article');
  if(ldEl) ldEl.textContent = '';

  try { history.pushState({}, defaultTitle, '/insights'); } catch(e) {}
}

// Article reading progress bar
document.getElementById('article-overlay').addEventListener('scroll', function() {
  var overlay = this;
  var bar = document.getElementById('articleProgressBar');
  if(!bar) return;
  var scrolled = overlay.scrollTop;
  var total = overlay.scrollHeight - overlay.clientHeight;
  var pct = total > 0 ? Math.min(100, (scrolled / total) * 100) : 0;
  bar.style.width = pct + '%';
});

// ══ VENDOR SCROLL
function scrollToVendorCat(cat) {
  document.querySelectorAll('.vendors-tab-btn').forEach(function(b){ b.classList.remove('active'); });
  var clicked = event.target; if(clicked) clicked.classList.add('active');
  var map = {hardware:'vendor-hardware', kitchen:'vendor-kitchen', sanitary:'vendor-sanitary',
    paints:'vendor-paints', smart:'vendor-smart', lighting:'vendor-lighting',
    tiles:'vendor-tiles', wood:'vendor-wood', lifts:'vendor-lifts', hvac:'vendor-hvac', fire:'vendor-fire'};
  var el = document.getElementById(map[cat]);
  if(el) el.scrollIntoView({behavior:'smooth', block:'start'});
}

// ── PAGE NAVIGATION

/* ══ PROJECTS SYSTEM ══════════════════════════════════════════ */
(function() {
'use strict';
const CDN = 'https://www.indevastudio.com/project-images-for-website/';
const img = fn => (fn.startsWith('/') || fn.startsWith('./') || fn.startsWith('http')) ? fn : CDN + encodeURIComponent(fn);

const CAPS = {
  'desktop version banner.webp':{t:'Grand Exterior',c:'A statement facade reflecting quiet permanence'},
  'mobile version banner.webp':{t:'Exterior — Alternate',c:'The structure in a different light'},
  'front elevation.webp':{t:'Front Elevation',c:'Proportions drawn from first principles'},
  'Main elevation.webp':{t:'Primary Elevation',c:'Architecture as a resolved composition'},
  'side elevation.webp':{t:'Side Elevation',c:'The lateral facade — structure made visible'},
  'living room lobby.webp':{t:'Living Lobby',c:'A threshold between arrival and repose'},
  'living area.webp':{t:'Living Area',c:'Light gathered and held without effort'},
  'kitchen and common washroom.webp':{t:'Kitchen & Utility',c:'Function arranged with precision'},
  'Kitchen Area.webp':{t:'Kitchen Area',c:'A kitchen sized for use, not display'},
  'Kitchen.webp':{t:'Kitchen Detail',c:'Material choices made once and not revisited'},
  'https://www.indevastudio.com/urban-apartment-kitchen-1.jpg':{t:'Kitchen & Breakfast Bar',c:'A sage-glass kitchen opening to a curved, fluted-wood breakfast bar'},
  'https://www.indevastudio.com/urban-apartment-kitchen-2.jpg':{t:'Kitchen Cabinetry',c:'Glossy sage cabinetry with warm, backlit display niches'},
  'https://www.indevastudio.com/vasant-kunj-cover.jpg':{t:'Parents\' Bedroom — Full View',c:'Rajasthani mural, cane headboard, and layered warm lighting'},
  'https://www.indevastudio.com/vasant-kunj-bedroom-1.jpg':{t:'Mural Headboard Wall',c:'Rajasthani-inspired mural flanked by cane detailing and brass sconces'},
  'https://www.indevastudio.com/vasant-kunj-bedroom-2.jpg':{t:'Window Seat & TV Wall',c:'Cane-front TV console beside a cushioned daybed'},
  'https://www.indevastudio.com/vasant-kunj-bedroom-3.jpg':{t:'Bed Wall, Straight-On',c:'Arched upholstered headboard framed by brass pendant lighting'},
  'https://www.indevastudio.com/vasant-kunj-bedroom-4.jpg':{t:'TV Unit Detail',c:'Olive fluted panel with marble inlay and display shelving'},
  'Master washroom.webp':{t:'Master Washroom',c:'Restraint applied to every surface'},
  'foyer area.webp':{t:'Entrance Foyer',c:'The first room sets the tone for all others'},
  'lobby area.webp':{t:'Lobby',c:'Space held in deliberate stillness'},
  'Master bedroom design.webp':{t:'Master Bedroom',c:'A room that prioritises rest above all'},
  "Daughter's Bedroom.webp":{t:"Daughter's Bedroom",c:'Proportion scaled to a smaller world'},
  'Studio Workspace.webp':{t:'Studio — Main Floor',c:'A workspace that enables focused work'},
  'Workstation Area.webp':{t:'Workstation Zone',c:'Desks positioned for natural light'},
  'Conference Room.webp':{t:'Conference Room',c:'A room for clear thinking'},
  'Cafeteria Area.webp':{t:'Cafeteria',c:'Informal gathering, formally resolved'},
  'Entrance area.webp':{t:'Office Entrance',c:'The threshold of a working day'},
  'https://www.indevastudio.com/resham%20lobby%20ceiling%20art.webp':{t:'Lobby — Ceiling Installation',c:'A handcrafted glass installation anchors the lobby in amber and clear tones'},
  'https://www.indevastudio.com/resham%20lobby%20seating%20area.webp':{t:'Lobby — Seating Area',c:'Chesterfield leather seating against inlaid marble flooring'},
  'https://www.indevastudio.com/resham%20guest%20room%20corridor.webp':{t:'Guest Room Corridor',c:'Wood-panelled doors and sculptural wall sconces line each floor'},
  'https://www.indevastudio.com/resham%20corridor%20view.webp':{t:'Corridor',c:'Consistent detailing carried the full length of every floor'},
  'https://www.indevastudio.com/resham%20suite%20bedroom.webp':{t:'Suite Bedroom',c:'A tufted headboard and cane seating warm a restrained palette'},
  'https://www.indevastudio.com/resham%20room%20dining%20nook.webp':{t:'Room Dining Nook',c:'A round table and velvet chairs beside the window'},
  'https://www.indevastudio.com/resham%20room%20entry%20and%20wardrobe.webp':{t:'Room Entry & Wardrobe',c:'Herringbone flooring and PU-finished joinery at the entry'},
  'https://www.indevastudio.com/resham%20bathroom%20with%20jacuzzi.webp':{t:'Bathroom with Jacuzzi',c:'Italian marble tiling surrounds a full jacuzzi tub'},
  'https://www.indevastudio.com/resham%20bedroom%20and%20ensuite%20bath.webp':{t:'Bedroom & Ensuite Bath',c:'The bedroom opens directly onto a marble-clad soaking tub'},
  'https://www.indevastudio.com/resham%20meeting%20room.webp':{t:'Meeting Room',c:'A small conference space finished in marble and brass-legged seating'},
};
const cap = fn => CAPS[fn] || {t:fn.replace(/\.webp$/,'').replace(/[-_]/g,' '),c:'ind\u00e9va studio'};

/* ─── TO ADD A NEW PROJECT ───────────────────────────────────
   Copy one object in PROJECTS below, update:
   - id:          unique slug used in the URL  /projects/[id]
   - name:        display name
   - location:    city
   - typology:    'Residential' | 'Hospitality' | 'Commercial'
   - area:        floor area string
   - year:        year string
   - status:      'Completed' | 'Ongoing'
   - description: 1-line factual summary
   - editorial:   2–3 sentence HTML paragraph (use <em> for emphasis)
   - cover:       filename of the cover image (must be in project-images-for-website/)
   - images:      array of all image filenames to show in gallery
   - parallax:    filename used for the mid-page parallax break
   - parallaxLbl: short label shown on the parallax image
   Then add its image captions to CAPS above.
─────────────────────────────────────────────────────────── */
window.PROJECTS = [
  {id:'mini-farmhouse',name:'Mini Farmhouse',location:'Delhi',typology:'Residential',area:'4,800 sqft',year:'2024',status:'Completed',
   duration:'5 months',scope:'Interior Design + Furniture + Execution',
   services:['Space Planning','Interior Design','Custom Furniture','Site Execution'],
   challenge:'Holding a large open volume together while still giving each family zone — living, dining, bedrooms — a distinct identity without breaking sightlines or adding unnecessary partitions.',
   approach:'Every material and dimension was locked into working drawings before site work began. The layout followed structure first; nothing was decided on-site by improvisation.',
   description:'a residence built on restraint. light, material, and proportion \u2014 nothing else.',
   editorial:'<p>planned from structure. built without deviation. <em>material decisions followed function.</em></p><p>the brief: a home that holds light without chasing it. rooms sized for use, not impression. every surface chosen once.</p>',
   cover:'desktop version banner.webp',
   images:['desktop version banner.webp','Main elevation.webp','side elevation.webp','living room lobby.webp','Kitchen Area.webp','Kitchen.webp','kitchen and common washroom.webp','Master washroom.webp','foyer area.webp','lobby area.webp','living area.webp','mobile version banner.webp','Master bedroom design.webp',"Daughter's Bedroom.webp"],
   parallax:'front elevation.webp',parallaxLbl:'front elevation'},
  {id:'resham-hotel',name:'Resham Hotel',location:'Murthal',typology:'Hospitality',area:'23 rooms',year:'2026',status:'Completed',
   duration:'6 months',scope:'Concept + Interior Design + Site Execution',
   services:['Concept Design','Interior Design','Custom Furniture','Site Execution'],
   challenge:'Delivering a consistent, elevated guest experience across 23 rooms and shared lobby/lounge areas near a major highway landmark, without the material palette feeling repetitive room to room.',
   approach:'A restrained material kit — Italian marble, MDF wall mouldings, and PU-finished furniture — was standardised across all 23 rooms and corridors, then varied through lighting and layout so each space still reads as considered rather than templated.',
   description:'a 23-room highway hotel near Amrik Sukhdev, Murthal, built on Italian marble, MDF mouldings, and PU-finished furniture \u2014 consistent, elevated, repeatable.',
   editorial:'<p>the brief was consistency at scale. <em>a restrained material kit — Italian marble, MDF mouldings, PU-finished furniture — was standardised across all 23 rooms.</em></p><p>lighting and layout carried the variation, so no two spaces feel templated despite sharing the same palette.</p>',
   cover:'https://www.indevastudio.com/resham%20lobby%20ceiling%20art.webp',
   images:['https://www.indevastudio.com/resham%20lobby%20ceiling%20art.webp','https://www.indevastudio.com/resham%20lobby%20seating%20area.webp','https://www.indevastudio.com/resham%20guest%20room%20corridor.webp','https://www.indevastudio.com/resham%20corridor%20view.webp','https://www.indevastudio.com/resham%20suite%20bedroom.webp','https://www.indevastudio.com/resham%20room%20dining%20nook.webp','https://www.indevastudio.com/resham%20room%20entry%20and%20wardrobe.webp','https://www.indevastudio.com/resham%20bathroom%20with%20jacuzzi.webp','https://www.indevastudio.com/resham%20bedroom%20and%20ensuite%20bath.webp','https://www.indevastudio.com/resham%20meeting%20room.webp'],
   parallax:'https://www.indevastudio.com/resham%20lobby%20ceiling%20art.webp',parallaxLbl:'lobby ceiling installation'},
  {id:'studio-workspace',name:'Studio Workspace',location:'Gurgaon',typology:'Commercial',area:'3,200 sqft',year:'2023',status:'Completed',
   duration:'3 months',scope:'Space Planning + Interiors + Custom Furniture',
   services:['Space Planning','Interior Design','Custom Furniture'],
   challenge:'Fitting focused individual workstations, meeting rooms, and a cafeteria into a mid-size floor plate without the space feeling cramped or corridor-driven.',
   approach:'Daylight access drove the layout — workstations were placed first, everything else followed. Conference rooms were sized for their actual use, not for appearance.',
   description:'a workplace designed for sustained focus. natural light, spatial clarity, no excess.',
   editorial:'<p>the brief asked for a space that enables work without distraction. <em>the layout followed.</em></p><p>workstations positioned for light. conference rooms sized for their actual use.</p>',
   cover:'Studio Workspace.webp',
   images:['Studio Workspace.webp','Workstation Area.webp','Conference Room.webp','Cafeteria Area.webp','Entrance area.webp'],
   parallax:'Workstation Area.webp',parallaxLbl:'workstation zone'},
  {id:'dda-apartment',name:'DDA Apartment',location:'Delhi',typology:'Residential',area:'1,800 sqft',year:'2024',status:'Completed',
   duration:'3 months',scope:'Space Planning + Interior Design + Execution',
   services:['Space Planning','Interior Design','Site Execution'],
   challenge:'Achieving density without compromise — fitting full storage, kitchen, and living function into a compact 1,800 sqft footprint.',
   approach:'Storage was resolved first, then light, then material. Rooms were sized for use, not aspiration.',
   description:'a compact DDA apartment in Delhi where every square foot was planned, not decorated.',
   editorial:'<p>the challenge was density without compromise. <em>rooms were sized for use, not aspiration.</em></p><p>storage was resolved first. then light. then material.</p>',
   cover:'https://www.indevastudio.com/urban-apartment-kitchen-1.jpg',
   images:['https://www.indevastudio.com/urban-apartment-kitchen-1.jpg','https://www.indevastudio.com/urban-apartment-kitchen-2.jpg'],
   parallax:'https://www.indevastudio.com/urban-apartment-kitchen-1.jpg',parallaxLbl:'kitchen'},
  {id:'patel-nagar',name:'Patel Nagar Retail Store',location:'Patel Nagar, Delhi',typology:'Commercial',area:'2 floors',year:'2026',status:'Ongoing',
   duration:'In progress',scope:'Concept + Retail Interior Design + Execution',
   services:['Concept Design','Retail Interior Design','Site Execution'],
   challenge:'Building a fast, Gen Z-legible retail identity across two floors without relying on a large footprint or heavy fixtures.',
   approach:'Fixtures were pulled back so the merchandise \u2014 walls of folded color \u2014 could do the talking. The ground floor moves customers up naturally; the first floor slows them down around a branded, photograph-ready lounge.',
   description:'a menswear store rebuilt around a Gen Z customer — fast to read, quick to shop, built for the phone camera as much as the rack.',
   editorial:'<p>the brief was speed and identity, not square footage. <em>fixtures were pulled back so the merchandise — walls of folded color — could do the talking.</em></p><p>the ground floor moves customers up naturally; the first floor slows them down around a branded lounge built to be photographed.</p>',
   cover:'https://www.indevastudio.com/patel-nagar-retail-1.jpg',
   images:['https://www.indevastudio.com/patel-nagar-retail-1.jpg','https://www.indevastudio.com/patel-nagar-retail-2.jpg','https://www.indevastudio.com/patel-nagar-retail-3.jpg','https://www.indevastudio.com/patel-nagar-retail-4.jpg'],
   parallax:'https://www.indevastudio.com/patel-nagar-retail-2.jpg',parallaxLbl:'folded knitwear wall'},
  {id:'vasant-kunj',name:'Vasant Kunj',location:'New Delhi',typology:'Residential',area:'DDA Residence',year:'2025',status:'Completed',
   duration:'2 months',scope:'Interior Design + Custom Joinery + Execution',
   services:['Interior Design','Custom Furniture & Joinery','Site Execution'],
   challenge:'Achieving a sophisticated, quiet material palette resolved almost entirely through joinery and lighting — with no reliance on applied decoration.',
   approach:'Every surface — the fluted headboard wall, the backlit TV panel, the window seat — was drawn before it was built. Lighting was layered, not applied: cove, panel and pendant sources let the room shift from morning clarity to evening intimacy.',
   description:'a parents\' bedroom built on walnut fluting, warm beige lacquer, and brushed brass — quiet sophistication resolved through joinery, not decoration.',
   editorial:'<p>the brief was comfort without excess. <em>every surface — the fluted headboard wall, the backlit TV panel, the window seat — was drawn before it was built.</em></p><p>lighting was layered, not applied: cove, panel and pendant sources let the room shift from the clarity of morning to the intimacy of evening.</p>',
   cover:'https://www.indevastudio.com/vasant-kunj-cover.jpg',
   images:['https://www.indevastudio.com/vasant-kunj-bedroom-1.jpg','https://www.indevastudio.com/vasant-kunj-bedroom-2.jpg','https://www.indevastudio.com/vasant-kunj-bedroom-3.jpg','https://www.indevastudio.com/vasant-kunj-bedroom-4.jpg'],
   parallax:'https://www.indevastudio.com/vasant-kunj-bedroom-1.jpg',parallaxLbl:'parents\' bedroom'},
  {id:'south-delhi-neoclassical', name:'South Delhi Neo-Classical Residence', location:'South Delhi', typology:'Residential',
   area:'1,500 sqft (2 BHK)', year:'2026', status:'Completed',
   duration:'3 months', scope:'Interior Design + Turnkey Execution', budget:'₹20 Lakhs',
   services:['Space Planning','Interior Design','Custom Furniture','Layered Lighting','Site Execution'],
   challenge:'Balancing classic architectural detailing — wall mouldings, panelled walls, fluted surfaces — with genuinely livable, practical space in a compact 1,500 sqft 2 BHK, without the home tipping into overly ornate or impractical.',
   approach:'Classic proportions and detailing were paired with contemporary, streamlined furniture rather than heavy period pieces. Storage was built into the architecture itself — wardrobes and units resolved as part of the wall panelling rather than added afterward — and lighting was layered across ambient, accent and functional sources through both bedrooms and the living space.',
   description:'a 1,500 sqft 2 BHK in South Delhi in a contemporary neo-classical style — warm neutrals, wall mouldings and bespoke furniture, built for understated, everyday luxury rather than ornament.',
   editorial:'<p>the house was compact. the detailing was not sacrificed for it. <em>classic mouldings and panelling were paired with streamlined, contemporary furniture so the home read as timeless, not ornate.</em></p><p>storage and lighting were resolved as part of the architecture — built into the panelling, layered across ambient, accent and functional sources in every room.</p>',
   cover:'https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-living-room-seating.webp',
   images:['https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-living-room-seating.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-living-room-entrance-view.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-living-room-wall-panelling.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-living-room-tv-unit-pooja.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-kitchen.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-master-bedroom-balcony-view.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-master-bedroom-bed-view.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-master-bedroom-tv-unit.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-master-bedroom-hallway.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-bedroom-headboard-view.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-bedroom-window-seating.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-bedroom-tv-unit.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-bedroom-wardrobe-entry.webp','https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-wardrobe-interior-detail.webp'],
   parallax:'https://www.indevastudio.com/south-delhi-neoclassical-images/south-delhi-neoclassical-master-bedroom-bed-view.webp',parallaxLbl:'master bedroom'},
];

let curP=null, lbImgs=[], lbIdx=0;

/* init hero image */
const ixHeroImg = document.getElementById('pix-hero-img');
if (ixHeroImg) ixHeroImg.src = img(window.PROJECTS[0].cover);

/* ── RENDER INDEX ─────────────────────────────────────────── */
function renderIndex() {
  const grid = document.getElementById('pix-grid');
  if (!grid) return;
  grid.innerHTML = window.PROJECTS.map((p,i) => `
    <div class="pcard" data-f="${p.typology.toLowerCase()}"
         style="transition-delay:${(i%3)*.1}s"
         onclick="window.pOpenProject('${p.id}')">
      <div class="pcard-iw">
        <img class="pcard-img" src="${img(p.cover)}" alt="${p.name}" loading="lazy" width="1200" height="900" decoding="async">
        <div class="pcard-dim"></div>
        <div class="pcard-vw">view project</div>
      </div>
      <div class="pcard-info">
        <div class="pcard-type">${p.typology}</div>
        <div class="pcard-name">${p.name}</div>
        <div class="pcard-loc">${p.location}</div>
      </div>
      <div class="pcard-arr">&#x2197;</div>
    </div>`).join('');
}

/* ── FILTERS ──────────────────────────────────────────────── */
function initFilters() {
  document.querySelectorAll('#projects .fpill').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('#projects .fpill').forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.f;
      document.querySelectorAll('#projects .pcard').forEach(c => {
        const show = f==='all' || c.dataset.f===f;
        c.style.display = show ? '' : 'none';
        if (show) { c.classList.remove('vis'); setTimeout(() => c.classList.add('vis'),40); }
      });
    });
  });
}

/* ── OPEN PROJECT DETAIL ──────────────────────────────────── */
window.pOpenProject = function(id) {
  const p = window.PROJECTS.find(x => x.id===id);
  if (!p) return;
  curP = p;

  /* update browser URL without triggering main showPage */
  try { history.pushState({projId:id}, '', `/projects/${id}`); } catch(e) {}

  /* switch sub-views */
  document.getElementById('pv-index').classList.remove('active');
  document.getElementById('pv-detail').classList.add('active');
  document.getElementById('p-back-bar').classList.add('show');
  window.scrollTo(0,0);

  /* reset reveals */
  document.querySelectorAll('#pv-detail .rv').forEach(el => el.classList.remove('vis'));
  document.querySelectorAll('#pv-detail .ds-i').forEach(el => el.classList.remove('vis'));

  lbImgs = p.images.map(fn => ({src:img(fn), ...cap(fn)}));

  /* hero */
  const hi = document.getElementById('pdet-hero-img');
  hi.src = img(p.cover); hi.alt = `${p.name} — ind\u00e9va studio`;
  document.getElementById('pdet-kicker').innerHTML = `ind&eacute;va studio &nbsp;&middot;&nbsp; ${p.typology}`;
  document.getElementById('pdet-title').textContent = p.name;
  document.getElementById('pdet-desc').textContent = p.description;
  document.getElementById('pdet-meta').innerHTML =
    [['location',p.location],['area',p.area],['duration',p.duration]]
    .map(([l,v]) => `<div class="dh-mi"><span class="dh-ml">${l}</span><span class="dh-mv">${v}</span></div>`)
    .join('');

  /* strip */
  document.getElementById('pdet-strip').innerHTML =
    [['type',p.typology],['year',p.year],['area',p.area],['status',p.status]]
    .map(([l,v]) => `<div class="ds-i"><div class="ds-l">${l}</div><div class="ds-v">${v}</div></div>`)
    .join('');

  /* project facts */
  document.getElementById('pdet-facts').innerHTML = `
    <div class="pf-row"><div class="pf-l">scope of work</div><div class="pf-v">${p.scope}</div></div>
    <div class="pf-row"><div class="pf-l">key challenge</div><div class="pf-v">${p.challenge}</div></div>
    <div class="pf-row"><div class="pf-l">design approach</div><div class="pf-v">${p.approach}</div></div>
    <div class="pf-row"><div class="pf-l">services provided</div><div class="pf-v pf-tags">${p.services.map(s=>`<span class="pf-tag">${s}</span>`).join('')}</div></div>
  `;

  /* editorial */
  document.getElementById('pdet-editorial').innerHTML = p.editorial;

  /* gallery */
  document.getElementById('pdet-gcount').textContent = `${String(p.images.length).padStart(2,'0')} images`;
  document.getElementById('pdet-gallery').innerHTML = p.images.map((fn,i) => {
    const c = cap(fn);
    return `<div class="gimg" onclick="window.pLbOpen(${i})">
      <img class="gimg-img" src="${img(fn)}" alt="${c.t}" loading="lazy" width="1200" height="900" decoding="async">
      <div class="gimg-xp">&#x26F6;</div>
      <div class="gimg-cap"><div class="gimg-ct">${c.t}</div><div class="gimg-cs">${c.c}</div></div>
    </div>`;
  }).join('');

  /* parallax */
  document.getElementById('pdet-par-img').src = img(p.parallax);
  document.getElementById('pdet-par-img').alt = `${p.name} — indéva studio`;
  document.getElementById('pdet-par-lbl').textContent = p.parallaxLbl;

  /* closing */
  document.getElementById('pdet-closing').src = img(p.images[p.images.length-1]);
  document.getElementById('pdet-closing').alt = `${p.name} — indéva studio`;

  /* next project */
  const ni = window.PROJECTS.indexOf(p);
  const nx = window.PROJECTS[(ni+1) % window.PROJECTS.length];
  document.getElementById('pdet-next').innerHTML =
    `<div><div class="dn-l">next project</div><div class="dn-n">${nx.name}</div></div>
     <button class="dn-btn" onclick="window.pOpenProject('${nx.id}')">&#8594;</button>`;

  setTimeout(pReveal, 80);
};

/* ── SHOW INDEX ───────────────────────────────────────────── */
window.pShowIndex = function() {
  document.getElementById('pv-detail').classList.remove('active');
  document.getElementById('pv-index').classList.add('active');
  document.getElementById('p-back-bar').classList.remove('show');
  window.scrollTo(0,0);
  try { history.pushState({}, '', '/projects'); } catch(e) {}
  pReveal();
};

/* ── LIGHTBOX ─────────────────────────────────────────────── */
window.pLbOpen = function(i) {
  lbIdx = i;
  const lb = document.getElementById('p-lightbox');
  lb.style.display = 'flex';
  requestAnimationFrame(() => requestAnimationFrame(() => lb.classList.add('vis')));
  document.body.style.overflow = 'hidden';
  pLbRender();
};
function pLbRender() {
  const it = lbImgs[lbIdx];
  const el = document.getElementById('plb-img');
  el.style.opacity = '0';
  setTimeout(() => {
    el.src = it.src; el.style.opacity = '1'; el.style.transition = 'opacity .3s';
    el.alt = it.t || '';
    document.getElementById('plb-title').textContent = it.t;
    document.getElementById('plb-sub').textContent   = it.c;
    document.getElementById('plb-ctr').textContent   =
      `${String(lbIdx+1).padStart(2,'0')} / ${String(lbImgs.length).padStart(2,'0')}`;
  }, 180);
}
window.pLbNav = function(d) { lbIdx = (lbIdx+d+lbImgs.length)%lbImgs.length; pLbRender(); };
window.pLbClose = function() {
  const lb = document.getElementById('p-lightbox');
  lb.classList.remove('vis');
  setTimeout(() => { lb.style.display='none'; document.getElementById('plb-img').src=''; document.body.style.overflow=''; }, 400);
};

/* ── PARALLAX ─────────────────────────────────────────────── */
function pParallax() {
  const pg = document.getElementById('projects');
  if (!pg || !pg.classList.contains('active')) return;
  const sy = window.scrollY;
  if (document.getElementById('pv-index').classList.contains('active')) {
    const el = document.getElementById('pix-hero-img');
    if (el) el.style.transform = `translateY(${sy*.3}px)`;
  } else {
    const hi = document.getElementById('pdet-hero-img');
    if (hi) hi.style.transform = `translateY(${sy*.34}px)`;
    const pe = document.getElementById('pdet-par');
    const pi = document.getElementById('pdet-par-img');
    if (pe && pi) {
      const r = pe.getBoundingClientRect();
      pi.style.transform = `translateY(${(window.innerHeight/2-(r.top+r.height/2))*.28}px)`;
    }
  }
}

/* ── SCROLL REVEAL ────────────────────────────────────────── */
function pReveal() {
  const pg = document.getElementById('projects');
  if (!pg || !pg.classList.contains('active')) return;
  const vh = window.innerHeight * .9;
  document.querySelectorAll('#projects .rv').forEach(el => {
    if (el.getBoundingClientRect().top < vh) el.classList.add('vis');
  });
  document.querySelectorAll('#projects .pcard').forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight*.92) el.classList.add('vis');
  });
  document.querySelectorAll('#projects .ds-i').forEach(el => {
    if (el.getBoundingClientRect().top < vh) el.classList.add('vis');
  });
}

/* ── KEYBOARD ─────────────────────────────────────────────── */
document.addEventListener('keydown', e => {
  const lb = document.getElementById('p-lightbox');
  if (!lb || !lb.classList.contains('vis')) return;
  if (e.key==='Escape')     window.pLbClose();
  if (e.key==='ArrowRight') window.pLbNav(1);
  if (e.key==='ArrowLeft')  window.pLbNav(-1);
});

/* ── BROWSER HISTORY ──────────────────────────────────────── */
window.addEventListener('popstate', e => {
  const pg = document.getElementById('projects');
  if (!pg || !pg.classList.contains('active')) return;
  if (e.state && e.state.projId) window.pOpenProject(e.state.projId);
  else window.pShowIndex();
});

/* ── SCROLL LISTENER ──────────────────────────────────────── */
window.addEventListener('scroll', () => { pParallax(); pReveal(); }, {passive:true});

/* ── DEEP-LINK ON LOAD ────────────────────────────────────── */
window.pInitRoute = function() {
  const m = location.pathname.match(/\/projects\/([a-z0-9-]+)/);
  if (m) window.pOpenProject(m[1]);
};

/* ── INIT ─────────────────────────────────────────────────── */
renderIndex();
initFilters();
window.pInitRoute();
setTimeout(pReveal, 150);

})(); /* end IIFE */
/* ══ END PROJECTS SYSTEM ══════════════════════════════════════ */


function showPage(id, pushState) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-link'));

  const page = document.getElementById(id);
  if (page) {
    page.classList.add('active');
    window.scrollTo(0,0);
    // trigger reveals
    setTimeout(triggerReveal, 60);
    // init projects system if navigating to projects
    if (id === 'projects' && window.pInitRoute) { setTimeout(window.pInitRoute, 80); }
  }

  const navBtn = document.querySelector(`.nav-link[onclick="showPage('${id}')"]`);
  if (navBtn) navBtn.classList.add('active-link');

  // update nav solid state
  handleScroll();

  // ── URL routing: update browser URL to match page
  const pageUrls = {
    'home':        '/',
    'about':       '/about',
    'services':    '/services',
    'process':     '/process',
    'projects':    '/projects',
    'philosophy':  '/philosophy',
    'blog':        '/insights',
    'vendors':     '/vendors',
    'furniture':   '/furniture',
    'contact':     '/contact'
  };
  const url = pageUrls[id] || '/';
  if (pushState !== false) {
    try { history.pushState({ page: id }, '', url); } catch(e) {}
  }

  // ── SEO: keep canonical + og:url + title + description in sync with current page
  const BASE = 'https://www.indevastudio.com';
  const fullUrl = BASE + url;
  const canonEl = document.getElementById('canonical-tag');
  if (canonEl) canonEl.setAttribute('href', fullUrl);
  const ogUrlEl = document.getElementById('og-url');
  if (ogUrlEl) ogUrlEl.setAttribute('content', fullUrl);

  const pageMeta = {
    'home':       { title: 'indéva studio — luxury interior design, new delhi', desc: 'indéva studio is a luxury interior design and architecture studio based in new delhi, india. we design homes, offices, and hospitality spaces with precision, craft, and conviction.' },
    'about':      { title: 'about us — indéva studio', desc: 'learn about indéva studio — our philosophy, our team, and our approach to luxury interior design in new delhi, india.' },
    'services':   { title: 'services — indéva studio', desc: 'luxury interior design services including residential, hospitality, commercial and custom furniture by indéva studio, new delhi.' },
    'process':    { title: 'our process — indéva studio', desc: 'a transparent, rigorous design process from initial brief to final handover. discover how indéva studio works.' },
    'projects':   { title: 'projects — indéva studio', desc: 'selected interior design and architecture projects by indéva studio across luxury residences, villas, restaurants and commercial spaces.' },
    'philosophy': { title: 'our philosophy — indéva studio', desc: 'design with conviction. the design philosophy underpinning every project at indéva studio, new delhi.' },
    'blog':       { title: 'insights — indéva studio', desc: 'expert insights on luxury interior design, architecture, materials and process from indéva studio, new delhi.' },
    'vendors':    { title: 'material & vendor network — indéva studio', desc: 'the material and vendor network indéva studio works with — trusted manufacturers, technical specialists and material partners across categories.' },
    'furniture':  { title: 'furniture & collection — indéva studio', desc: 'custom furniture and joinery by indéva studio — form, function, and durability, conceived to survive life, not just a photoshoot.' },
    'contact':    { title: 'contact — indéva studio', desc: 'start a conversation with indéva studio. reach out to discuss your interior design or architecture project in new delhi.' }
  };
  const meta = pageMeta[id] || pageMeta['home'];
  document.title = meta.title;
  const setContent = (elId, val) => { const el = document.getElementById(elId); if (el) el.setAttribute('content', val); };
  setContent('og-title',            meta.title);
  setContent('og-description',      meta.desc);
  setContent('twitter-title',       meta.title);
  setContent('twitter-description', meta.desc);
  const robotsEl = document.querySelector('meta[name="robots"]');
  if (robotsEl) robotsEl.setAttribute('content', 'index, follow');
  const descEl = document.querySelector('meta[name="description"]');
  if (descEl) descEl.setAttribute('content', meta.desc);
}

// ── SCROLL REVEAL
function triggerReveal() {
  const reveals = document.querySelectorAll('.page.active .reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

  reveals.forEach(el => {
    el.classList.remove('in');
    observer.observe(el);
  });
}

// ── NAV SOLID ON SCROLL
function handleScroll() {
  const nav = document.getElementById('navbar');
  nav.classList.toggle('solid', window.scrollY > 40);
}
window.addEventListener('scroll', handleScroll, { passive:true });

// ── PROJECT FILTER
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const filter = this.dataset.filter;
    document.querySelectorAll('.project-row').forEach(row => {
      const show = filter === 'all' || row.dataset.type === filter;
      row.style.display = show ? 'grid' : 'none';
    });
  });
});

// ── INIT
triggerReveal();

/* ---- originally inline at line 7658 ---- */
// ══ WHATSAPP — direct open on FAB click
function openWhatsApp() {
  var msg = "hi! i'd like to discuss a design project with indéva studio.";
  try { gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'fab_button', method: 'direct_open' }); } catch(e) {}
  window.open('https://wa.me/919717881083?text=' + encodeURIComponent(msg), '_blank');
}
// Panel send button
function waSend() {
  var input = document.getElementById('waInput');
  var msg   = (input && input.value.trim()) ? input.value.trim() : "hi! i'd like to discuss a project with indéva studio.";
  try { gtag('event', 'whatsapp_click', { event_category: 'engagement', event_label: 'panel_send', method: 'chat_panel' }); } catch(e) {}
  window.open('https://wa.me/919717881083?text=' + encodeURIComponent(msg), '_blank');
  if (input) { input.value = ''; waAutoResize(input); }
}
function waKeydown(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); waSend(); } }
function trackPhoneClick() {
  try { gtag('event', 'phone_call_click', { event_category: 'engagement', event_label: 'call_fab_button', phone_number: '+919717881083' }); } catch(e) {}
}
function waAutoResize(el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,100)+'px'; }
function toggleWa() {
  var panel=document.getElementById('waPanel'), fab=document.getElementById('waFab');
  if(!panel) return;
  var open=panel.classList.toggle('open'); fab.classList.toggle('active',open);
  var badge=document.getElementById('waBadge');
  if(open&&badge){badge.style.opacity='0';setTimeout(function(){if(badge.parentNode)badge.parentNode.removeChild(badge);},300);}
}
document.addEventListener('click',function(e){
  var w=document.getElementById('waWidget');
  if(w&&!w.contains(e.target)){
    var p=document.getElementById('waPanel'),f=document.getElementById('waFab');
    if(p&&p.classList.contains('open')){p.classList.remove('open');if(f)f.classList.remove('active');}
  }
});

// ══ CUSTOM CURSOR — disabled, using normal system cursor

// ══ HERO SLIDESHOW
(function(){
  var slides = document.querySelectorAll('#home .hero-slide');
  var label  = document.getElementById('hero-space-label');
  if(!slides.length) return;
  var cur = 0;
  setInterval(function(){
    slides[cur].classList.remove('active');
    cur = (cur + 1) % slides.length;
    slides[cur].classList.add('active');
    if(label) {
      label.style.opacity = '0';
      setTimeout(function(){
        label.textContent = slides[cur].dataset.label || '';
        label.style.opacity = '1';
      }, 400);
    }
  }, 5000);
})();

/* ---- originally inline at line 7720 ---- */
  var SUPABASE_URL = 'https://rolarfaotykmprzvcmgh.supabase.co';
  var SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvbGFyZmFvdHlrbXByenZjbWdoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY4OTI1OTgsImV4cCI6MjEwMjQ2ODU5OH0.B7mIRJLh9Q7rzQvrGguqjlhzIMgmoJmiq29Kl6lRkPI';
  var supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ---- originally inline at line 7728 ---- */
(function() {
  emailjs.init('HGr3wuPNyLvmq1S14');
})();

function submitEnquiry() {
  var btn       = document.getElementById('submitEnquiryBtn');
  var statusMsg = document.getElementById('formStatusMsg');

  var name     = (document.getElementById('cf-name').value     || '').trim();
  var email    = (document.getElementById('cf-email').value    || '').trim();
  var phone    = (document.getElementById('cf-phone').value    || '').trim();
  var type     = (document.getElementById('cf-type').value     || '');
  var area     = (document.getElementById('cf-area').value     || '').trim();
  var budget   = (document.getElementById('cf-budget').value   || '');
  var timeline = (document.getElementById('cf-timeline').value || '');
  var hp       = (document.getElementById('cf-hp')            ? document.getElementById('cf-hp').value : '');

  // Honeypot — bots fill this, humans don't
  if (hp) { resetForm(); return; }

  // Validation
  function fieldErr(id, msg) {
    var el = document.getElementById(id);
    if (el) el.classList.add('error');
    if (statusMsg) { statusMsg.textContent = msg; statusMsg.style.color = '#e55544'; }
    return false;
  }
  if (!name)  return fieldErr('cf-name',  'please enter your name.');
  if (!phone || phone.replace(/[^0-9]/g,'').length < 7) return fieldErr('cf-phone', 'please enter a valid phone number.');
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return fieldErr('cf-email', 'please enter a valid email address.');

  // Clear error states
  ['cf-name','cf-email','cf-phone','cf-area'].forEach(function(id){
    var el = document.getElementById(id); if (el) el.classList.remove('error');
  });

  btn.textContent   = 'sending…';
  btn.style.opacity = '0.55';
  btn.disabled      = true;
  statusMsg.textContent = '';

  var leadRow = {
    name: name, email: email, phone: phone,
    project_type: type || null, budget: budget || null, area: area || null,
    timeline: timeline || null, source: 'contact-page'
  };

  function sendEmailJsNotification() {
    if (typeof emailjs === 'undefined') return Promise.resolve();
    var params = {
      to_name: 'Indéva studio', to_email: 'ceo@indevastudio.com',
      from_name: name, from_email: email, reply_to: email,
      phone: phone, project_type: type||'—',
      area: area||'—', budget: budget||'—', timeline: timeline||'—',
      subject: 'new enquiry from ' + name,
      message: 'Name: '+name+'\nPhone: '+phone+'\nEmail: '+email+'\nType: '+(type||'—')+'\nArea: '+(area||'—')+'\nBudget: '+(budget||'—')+'\nTimeline: '+(timeline||'—')
    };
    return emailjs.send('service_3dpadmb', 'template_jg3vvys', params).catch(function(){});
  }

  // Primary: insert the lead directly into Supabase
  supabaseClient.from('lead submissions').insert([leadRow])
  .then(function(res) {
    if (res.error) throw res.error;
    trackAndComplete(type, budget);
    sendEmailJsNotification(); // best-effort, doesn't block success
  })
  .catch(function(err) {
    console.error('Supabase insert failed, falling back to EmailJS', err);
    // Fallback: still get the lead to us by email even if Supabase is unreachable
    sendEmailJsNotification().then(function() {
      trackAndComplete(type, budget);
    });
  });

  function trackAndComplete(pType, bBudget) {
    try { gtag('event','lead_form_submit',{event_category:'lead',event_label:'contact_page',project_type:pType||'—',budget:bBudget||'—'}); } catch(e){}
    resetForm();
    var modal = document.getElementById('thankYouModal');
    if (modal) modal.classList.add('open');
  }

  function resetForm() {
    ['cf-name','cf-email','cf-phone','cf-area'].forEach(function(id){
      var el = document.getElementById(id); if (el) { el.value = ''; el.classList.remove('error'); }
    });
    ['cf-type','cf-budget','cf-timeline'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.selectedIndex = 0;
    });
    if (btn)       { btn.textContent = 'submit enquiry'; btn.style.opacity = '1'; btn.disabled = false; }
    if (statusMsg) { statusMsg.textContent = 'we respond within 24 hours'; statusMsg.style.color = 'var(--white-muted)'; }
  }
}

// legacy alias
function closeThankyou() {
  var m = document.getElementById('thankYouModal');
  if (m) m.classList.remove('open');
}

function _unused_old_submitEnquiry() {
  var btn       = document.getElementById('submitEnquiryBtn');
  var statusMsg = document.getElementById('formStatusMsg');

  var name     = document.getElementById('cf-name').value.trim();
  var email    = document.getElementById('cf-email').value.trim();
  var phone    = document.getElementById('cf-phone').value.trim();
  var type     = document.getElementById('cf-type').value;
  var area     = document.getElementById('cf-area').value.trim();
  var budget   = document.getElementById('cf-budget').value;
  var timeline = document.getElementById('cf-timeline').value;

  if (!name) {
    statusMsg.textContent = 'please enter your name.';
    statusMsg.style.color = '#e55544';
    return;
  }
  if (!email) {
    statusMsg.textContent = 'please enter your email.';
    statusMsg.style.color = '#e55544';
    return;
  }

  btn.textContent  = 'sending…';
  btn.style.opacity = '0.55';
  btn.disabled     = true;
  statusMsg.textContent = 'sending your enquiry…';
  statusMsg.style.color = 'var(--white-muted)';

  var fullMsg = 'You have got a new query!\n\n' +
    'Name: '         + name              + '\n' +
    'Email: '        + email             + '\n' +
    'Phone: '        + (phone    || '—') + '\n' +
    'Project Type: ' + (type     || '—') + '\n' +
    'Location: '     + (location || '—') + '\n' +
    'Area: '         + (area     || '—') + '\n' +
    'Budget: '       + (budget   || '—') + '\n' +
    'Timeline: '     + (timeline || '—');

  var params = {
    to_name:      'Indéva studio',
    to_email:     'hello@indevastudio.com',
    cc_email:     'ceo@indevastudio.com',
    from_name:    name,
    from_email:   email,
    reply_to:     email,
    user_name:    name,
    user_email:   email,
    phone:        phone    || 'Not provided',
    project_type: type     || 'Not specified',
    location:     location || 'Not provided',
    area:         area     || 'Not provided',
    budget:       budget   || 'Not specified',
    timeline:     timeline || 'Not specified',
    message:      fullMsg,
    body:         fullMsg,
    content:      fullMsg,
    subject:      'You have got a new query from ' + name
  };

  emailjs.send('service_3dpadmb', 'template_jg3vvys', params)
    .then(function(res) {
      console.log('Email sent OK:', res.status, res.text);
      try { gtag('event', 'lead_form_submit', { event_category: 'lead', event_label: 'contact_page_form', project_type: type || 'not specified', budget: budget || 'not specified' }); } catch(e) {}
      resetAndRedirect();
    }, function(err) {
      console.error('EmailJS error:', JSON.stringify(err));
      resetAndRedirect(); // still redirect so visitor lands on thank-you page
    });

  function resetAndRedirect() {
    ['cf-name','cf-email','cf-phone','cf-area'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.value = '';
    });
    ['cf-type','cf-budget','cf-timeline'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.selectedIndex = 0;
    });
    btn.textContent   = 'submit enquiry';
    btn.style.opacity = '1';
    btn.disabled      = false;
    statusMsg.textContent = 'we respond within 48 hours';
    statusMsg.style.color = 'var(--white-muted)';
    // Show thank you modal
    var modal = document.getElementById('thankYouModal');
    if (modal) modal.classList.add('open');
  }
}

function closeThankyou() {
  var modal = document.getElementById('thankYouModal');
  if (modal) modal.classList.remove('open');
  var catLink = document.getElementById('ty-catalog-link');
  if (catLink) catLink.style.display = 'none';
}

// Close thank you modal on overlay click
document.addEventListener('DOMContentLoaded', function() {
  var m = document.getElementById('thankYouModal');
  if (m) m.addEventListener('click', function(e) {
    if (e.target === m) closeThankyou();
  });

  // ── Hash-based routing: redirect legacy #blog/slug URLs to /insights/slug
  // Supports: https://www.indevastudio.com/#blog/floorplans (legacy)
  function handleHash() {
    var hash = window.location.hash; // e.g. #blog/floorplans
    if (hash && hash.indexOf('#blog/') === 0) {
      var slug = hash.replace('#blog/', '');
      if (slug && articles[slug]) {
        // Redirect to canonical path-based URL
        try { history.replaceState({ article: slug }, '', '/insights/' + slug); } catch(e) {}
        showPage('blog', false);
        setTimeout(function() { openArticle(slug); }, 100);
      }
    }
  }
  handleHash();

  // ── Pathname-based routing: load correct page from URL on first visit
  var urlToPage = {
    '/':           'home',
    '/about':      'about',
    '/services':   'services',
    '/process':    'process',
    '/projects':   'projects',
    '/philosophy': 'philosophy',
    '/insights':   'blog',
    '/vendors':    'vendors',
    '/furniture':  'furniture',
    '/contact':    'contact'
  };
  var currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  // Handle article deep-links: /insights/:slug
  var articleSlugMatch = currentPath.match(/^\/insights\/(.+)$/);
  if (articleSlugMatch) {
    var slug = articleSlugMatch[1];
    showPage('blog', false);
    if (articles && articles[slug]) {
      setTimeout(function() { openArticle(slug); }, 150);
    }
  } else {
    var initialPage = urlToPage[currentPath] || 'home';
    if (initialPage !== 'home') {
      showPage(initialPage, false);
    }
  }

  // ── Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    handleHash();
    if (e.state && e.state.page) {
      showPage(e.state.page, false);
    } else {
      var path = window.location.pathname.replace(/\/$/, '') || '/';
      var pg = urlToPage[path] || 'home';
      showPage(pg, false);
    }
  });
});

/* ---- originally inline at line 8050 ---- */
/* ── HOME ENQUIRY FORM ── */
function submitHomeEnquiry() {
  var btn    = document.getElementById('hefBtn');
  var status = document.getElementById('hefStatus');

  var name   = (document.getElementById('hef-name').value || '').trim();
  var phone  = (document.getElementById('hef-phone').value || '').trim();
  var email  = (document.getElementById('hef-email').value || '').trim();
  var type   = (document.getElementById('hef-type').value || '');
  var msg    = (document.getElementById('hef-message').value || '').trim();

  // Validation
  if (!name)  { status.textContent = 'please enter your name.'; status.style.color='#e55544'; return; }
  if (!phone) { status.textContent = 'please enter your phone number.'; status.style.color='#e55544'; return; }
  if (!email || !email.includes('@')) { status.textContent = 'please enter a valid email.'; status.style.color='#e55544'; return; }

  btn.textContent = 'sending…'; btn.style.opacity = '0.6'; btn.disabled = true;
  status.textContent = ''; 

  var subject = 'New homepage enquiry from ' + name;
  var msgBody = 'New quick enquiry from homepage!\n\n'
    + 'Name: '         + name  + '\n'
    + 'Phone: '        + phone + '\n'
    + 'Email: '        + email + '\n'
    + 'Project Type: ' + (type || 'Not specified') + '\n'
    + 'Message: '      + (msg  || '—');

  function clearForm() {
    ['hef-name','hef-phone','hef-email','hef-message'].forEach(function(id){
      var el = document.getElementById(id); if (el) el.value = '';
    });
    var sel = document.getElementById('hef-type'); if (sel) sel.selectedIndex = 0;
  }

  function showThankYou() {
    btn.textContent = 'sent ✓'; btn.style.opacity = '1';
    clearForm();
    setTimeout(function(){
      btn.textContent = 'send enquiry →'; btn.disabled = false; btn.style.opacity = '1';
    }, 4000);
    var modal = document.getElementById('thankYouModal');
    if (modal) modal.classList.add('open');
  }

  // Send via EmailJS — always call showThankYou regardless of result
  try {
    emailjs.send('service_3dpadmb', 'template_jg3vvys', {
      to_name:      'Indéva studio',
      to_email:     'hello@indevastudio.com',
      cc_email:     'ceo@indevastudio.com',
      from_name:    name,
      from_email:   email,
      reply_to:     email,
      user_name:    name,
      user_email:   email,
      phone:        phone,
      project_type: type || 'Not specified',
      message:      msgBody,
      body:         msgBody,
      content:      msgBody,
      subject:      subject
    })
    .then(function()  { showThankYou(); })
    .catch(function() { showThankYou(); }); // show thank you even if email fails
  } catch(e) {
    showThankYou(); // show thank you even on JS error
  }
}

/* ── CATALOGUE MODAL ── */
function openCatalogueModal() {
  catResetModal();
  document.getElementById('catalogueModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCatalogueModal() {
  document.getElementById('catalogueModal').classList.remove('open');
  document.body.style.overflow = '';
  setTimeout(catResetModal, 400);
}
document.getElementById('catalogueModal').addEventListener('click', function(e) {
  if (e.target === this) closeCatalogueModal();
});

/* ── Reset modal to step 1 */
function catResetModal() {
  document.getElementById('cat-step-1').style.display = '';
  document.getElementById('cat-step-2').style.display = 'none';
  document.getElementById('cat-step-3').style.display = 'none';
  document.getElementById('cat-whatsapp').value = '';
  document.getElementById('cat-country').selectedIndex = 0;
  var btn = document.getElementById('catSendOtpBtn');
  btn.textContent = 'send otp via whatsapp';
  btn.disabled = false; btn.style.opacity = '1';
  document.getElementById('catStatus1').textContent = 'we will send a 6-digit code to your whatsapp.';
  document.getElementById('catStatus1').style.color = 'var(--white-muted)';
  document.querySelectorAll('.cat-otp-digit').forEach(function(d){ d.value = ''; d.classList.remove('filled'); });
  window._catOtp = null;
  window._catPhone = null;
}

/* ── STEP 1: Send OTP */
function catSendOtp() {
  var phone  = document.getElementById('cat-whatsapp').value.trim().replace(/\D/g,'');
  var cc     = document.getElementById('cat-country').value;
  var status = document.getElementById('catStatus1');
  var btn    = document.getElementById('catSendOtpBtn');

  if (!phone || phone.length < 7) {
    status.textContent = 'please enter a valid whatsapp number.';
    status.style.color = '#e55544'; return;
  }

  // Generate 6-digit OTP
  var otp = String(Math.floor(100000 + Math.random() * 900000));
  window._catOtp   = otp;
  window._catPhone = cc + phone;

  // Send OTP via WhatsApp (opens wa.me with the OTP message — recipient is the user's own number)
  var msg = 'Your indéva studio catalogue download code is: ' + otp + '. Valid for 10 minutes. Do not share this code.';
  var fullNumber = cc.replace('+','') + phone;
  window.open('https://wa.me/' + fullNumber + '?text=' + encodeURIComponent(msg), '_blank');

  // Also send via EmailJS for logging (silent fail ok)
  if (typeof emailjs !== 'undefined') {
    emailjs.send('service_3dpadmb', 'template_jg3vvys', {
      to_name: 'Indéva studio', to_email: 'hello@indevastudio.com',
      from_name: 'Catalogue Download', from_email: 'hello@indevastudio.com',
      subject: 'Catalogue OTP Request — ' + cc + phone,
      message: 'OTP ' + otp + ' sent to WhatsApp: ' + cc + phone,
      body: 'OTP ' + otp + ' sent to WhatsApp: ' + cc + phone,
      content: 'OTP ' + otp + ' sent to WhatsApp: ' + cc + phone,
      user_name: 'Catalogue Visitor', user_email: 'noreply@indevastudio.com',
      phone: cc + phone
    }).catch(function(){});
  }

  btn.textContent = 'code sent ✓'; btn.disabled = true; btn.style.opacity = '0.7';
  status.textContent = 'otp sent — check your whatsapp now.';
  status.style.color = 'var(--gold)';

  // Move to step 2 after short delay
  setTimeout(function(){
    document.getElementById('cat-step-1').style.display = 'none';
    document.getElementById('cat-step-2').style.display = '';
    document.getElementById('cat-otp-sub').textContent =
      'enter the 6-digit code sent to ' + cc + ' ' + phone.replace(/(\d{5})(\d+)/, function(m,a,b){ return a.slice(0,2)+'*****'+b.slice(-2); }) + ' via whatsapp.';
    // Focus first digit
    var digits = document.querySelectorAll('.cat-otp-digit');
    catInitOtpBoxes(digits);
    digits[0].focus();
  }, 1200);
}

/* ── OTP box keyboard behaviour */
function catInitOtpBoxes(digits) {
  digits.forEach(function(d, i) {
    d.value = '';
    d.classList.remove('filled');
    d.oninput = function() {
      var v = this.value.replace(/\D/g,'');
      this.value = v ? v[0] : '';
      this.classList.toggle('filled', !!this.value);
      if (this.value && i < digits.length - 1) digits[i+1].focus();
    };
    d.onkeydown = function(e) {
      if (e.key === 'Backspace' && !this.value && i > 0) digits[i-1].focus();
    };
    d.onpaste = function(e) {
      var pasted = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g,'');
      if (pasted.length >= 6) {
        e.preventDefault();
        for(var j=0;j<6;j++){ digits[j].value=pasted[j]||''; digits[j].classList.toggle('filled',!!digits[j].value); }
        digits[5].focus();
      }
    };
  });
}

/* ── STEP 2: Verify OTP */
function catVerifyOtp() {
  var digits  = document.querySelectorAll('.cat-otp-digit');
  var entered = Array.from(digits).map(function(d){ return d.value; }).join('');
  var status  = document.getElementById('catStatus2');
  var btn     = document.getElementById('catVerifyBtn');

  if (entered.length < 6) {
    status.textContent = 'please enter all 6 digits.';
    status.style.color = '#e55544'; return;
  }
  if (entered !== window._catOtp) {
    status.textContent = 'incorrect code — please try again.';
    status.style.color = '#e55544';
    digits.forEach(function(d){ d.style.borderColor='#e55544'; setTimeout(function(){ d.style.borderColor=''; },1200); });
    return;
  }

  // OTP correct — show step 3 and trigger download
  btn.disabled = true; btn.style.opacity = '0.6';
  document.getElementById('cat-step-2').style.display = 'none';
  document.getElementById('cat-step-3').style.display = '';

  setTimeout(function(){ catDoDownload(); }, 600);
  setTimeout(function(){ closeCatalogueModal(); }, 3200);
}

/* ── Resend OTP */
function catResendOtp() {
  document.getElementById('cat-step-2').style.display = 'none';
  document.getElementById('cat-step-1').style.display = '';
  var btn = document.getElementById('catSendOtpBtn');
  btn.textContent = 'send otp via whatsapp'; btn.disabled = false; btn.style.opacity = '1';
  document.getElementById('catStatus1').textContent = 'we will send a new code to your whatsapp.';
  document.getElementById('catStatus1').style.color = 'var(--white-muted)';
}

/* ── Catalogue PDF served as static file (was 11.6 MB inline base64, now /catalogue/indeva-catalogue-2025.pdf) ── */

function catDoDownload() {
    // direct download — served as static file from /catalogue/
    var a = document.createElement('a');
    a.href = '/catalogue/indeva-catalogue-2025.pdf';
    a.download = 'indeva-catalogue-2025.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

/* ═══════════════════════════════════════════════════
   STORYTELLING NARRATION ENGINE  v2
   Uses Web Speech API — robust female voice selection
═══════════════════════════════════════════════════ */
var StoryNarrator = (function() {

  var SEGMENTS = [
    { text: "The art of the lived-in aura.", caption: "the art of the lived-in aura." },
    { text: "A space is only successful when it vanishes into the background of a life well lived. We reject sterile perfection in favour of effortless chic — environments that feel gathered over a lifetime, not staged for a photoshoot. Balancing meticulous technical precision with the soulful, indefinable spirit of je ne sais quoi.", caption: "a space that vanishes into the background of a life well-lived." },
    { text: "Pillar one. Human centricity first. Design is a service to the soul. We prioritise the habitability of a room. Before selecting a colour palette, we map the morning light, the flow of conversation, and the physical comfort of a seated guest. A chair is only beautiful if it invites you to stay.", caption: "pillar 01 — human-centricity first." },
    { text: "Pillar two. The invisible detail. True luxury is felt, not seen. We obsess over elements you do not notice until they are missing — the silent glide of a drawer, the tactile weight of a door handle, the acoustic warmth of a well-layered room.", caption: "pillar 02 — the invisible detail." },
    { text: "Pillar three. The art of the mix. We reject the total look of a single era or brand. We pair sleek modern industrialism with the warmth of an antique. This juxtaposition creates a dialogue that prevents a space from feeling dated, allowing it to remain timeless through its eclectic soul.", caption: "pillar 03 — harmony found in contradiction." },
    { text: "Pillar four. Je ne sais quoi. A room that is too perfect is a room without character. We leave space for the happy accident — books slightly off centre, a weathered patina, a rug with a softened edge. Perfection is the enemy of comfort.", caption: "pillar 04 — we leave space for the happy accident." },
    { text: "Pillar five. Confidence over rules. Design rules are references, not commandments. We break them when a space asks us to. This confidence ensures the result is not a copy of a magazine, but an original expression of identity. This is the indéva studio philosophy.", caption: "pillar 05 — intuition as the ultimate guide." }
  ];

  var synth       = window.speechSynthesis;
  var state       = 'idle';
  var segIdx      = 0;
  var timerID     = null;
  var keepAliveID = null;
  var sessionStart = 0;
  var accumulated  = 0;
  var bars         = [];

  var totalChars = SEGMENTS.reduce(function(a, s) { return a + s.text.length; }, 0);
  var TOTAL_SECS = totalChars / 14;

  function domReady(fn) {
    if (document.readyState !== 'loading') { fn(); }
    else { document.addEventListener('DOMContentLoaded', fn); }
  }

  domReady(function() {
    buildBars();
    var dur = document.getElementById('storyDuration');
    if (dur) dur.textContent = fmtTime(TOTAL_SECS);
  });

  function buildBars() {
    var c = document.getElementById('waveBars');
    if (!c) return;
    var hs = [5,10,18,26,34,26,18,10,5,12,22,30,22,12,7];
    c.innerHTML = '';
    bars = hs.map(function(h, i) {
      var b = document.createElement('div');
      b.className = 'wave-bar';
      var lo = Math.max(3, Math.round(h * 0.22));
      b.style.cssText = 'height:'+lo+'px;--min-h:'+lo+'px;--max-h:'+h+'px;'
        +'--dur:'+(0.45+Math.random()*0.65).toFixed(2)+'s;'
        +'--delay:'+(i*0.065).toFixed(2)+'s;';
      c.appendChild(b);
      return b;
    });
  }

  function wavePlaying(on) {
    bars.forEach(function(b) { on ? b.classList.add('playing') : b.classList.remove('playing'); });
  }

  function fmtTime(s) {
    s = Math.max(0, s);
    return Math.floor(s/60) + ':' + (s%60 < 10 ? '0' : '') + Math.floor(s%60);
  }

  function setCaption(txt) {
    var el = document.getElementById('storyCaptionText');
    if (!el) return;
    el.style.opacity = '0';
    setTimeout(function() { el.textContent = txt; el.style.opacity = '1'; }, 180);
  }

  function setProgress(elapsedMs) {
    var secs = elapsedMs / 1000;
    var pct  = Math.min(100, (secs / TOTAL_SECS) * 100);
    var fill = document.getElementById('storyFill');
    var dot  = document.getElementById('storyDot');
    var el   = document.getElementById('storyElapsed');
    if (fill) fill.style.width  = pct + '%';
    if (dot)  dot.style.left   = pct + '%';
    if (el)   el.textContent   = fmtTime(secs);
  }

  function setIcons(playing) {
    var pi = document.getElementById('storyPlayIcon');
    var pa = document.getElementById('storyPauseIcon');
    if (!pi || !pa) return;
    pi.style.display = playing ? 'none'  : 'block';
    pa.style.display = playing ? 'block' : 'none';
    wavePlaying(playing);
  }

  function startTick() {
    clearInterval(timerID);
    sessionStart = Date.now();
    timerID = setInterval(function() {
      setProgress(accumulated + (Date.now() - sessionStart));
    }, 250);
  }

  function pauseTick() {
    clearInterval(timerID);
    accumulated += Date.now() - sessionStart;
  }

  function startKeepAlive() {
    clearInterval(keepAliveID);
    keepAliveID = setInterval(function() {
      if (state === 'playing' && synth.speaking) {
        synth.pause(); synth.resume();
      }
    }, 10000);
  }

  function stopKeepAlive() { clearInterval(keepAliveID); }

  function getFemaleVoice() {
    var voices = synth.getVoices();
    if (!voices.length) return null;
    var preferred = ['samantha','victoria','karen','moira','tessa','fiona',
                     'zira','hazel','susan','kate','serena','nicky',
                     'google uk english female','microsoft zira','microsoft hazel','google us english'];
    for (var p = 0; p < preferred.length; p++) {
      for (var v = 0; v < voices.length; v++) {
        if (voices[v].name.toLowerCase().indexOf(preferred[p]) !== -1) return voices[v];
      }
    }
    // fallback: first english voice
    for (var v = 0; v < voices.length; v++) {
      if (voices[v].lang && voices[v].lang.toLowerCase().indexOf('en') === 0) return voices[v];
    }
    return voices[0] || null;
  }

  function speakSegment(idx) {
    if (idx >= SEGMENTS.length) { onFinished(); return; }
    var seg = SEGMENTS[idx];
    setCaption(seg.caption);
    var utt = new SpeechSynthesisUtterance(seg.text);
    utt.rate  = 0.88;
    utt.pitch = 1.0;
    utt.volume = 1.0;
    var voice = getFemaleVoice();
    if (voice) utt.voice = voice;
    utt.onend = function() {
      if (state === 'playing') { segIdx = idx + 1; speakSegment(segIdx); }
    };
    utt.onerror = function() {
      if (state === 'playing') { segIdx = idx + 1; speakSegment(segIdx); }
    };
    synth.speak(utt);
  }

  function onFinished() {
    state = 'idle'; segIdx = 0; accumulated = 0;
    pauseTick(); stopKeepAlive();
    setIcons(false);
    setProgress(TOTAL_SECS * 1000);
    setCaption('narration complete.');
    setTimeout(function() {
      setProgress(0); setCaption('press play to begin the narration');
    }, 2000);
  }

  function play() {
    if (state === 'playing') return;
    state = 'playing';
    setIcons(true);
    startTick();
    startKeepAlive();
    if (synth.paused) {
      synth.resume();
    } else {
      synth.cancel();
      setTimeout(function() { speakSegment(segIdx); }, 120);
    }
  }

  function pause() {
    if (state !== 'playing') return;
    state = 'paused';
    setIcons(false);
    pauseTick();
    synth.pause();
  }

  function restart() {
    synth.cancel();
    state = 'idle'; segIdx = 0; accumulated = 0;
    clearInterval(timerID); stopKeepAlive();
    setIcons(false);
    setProgress(0);
    setCaption('press play to begin the narration');
    setTimeout(function() { play(); }, 200);
  }

  // Public API
  return {
    toggle:  function() { state === 'playing' ? pause() : play(); },
    restart: function() { restart(); }
  };

})();

function toggleStoryNarration()  { StoryNarrator.toggle();  }
function restartStoryNarration() { StoryNarrator.restart(); }

/* ---- originally inline at line 8630 ---- */
/* ══════════════════════════════════
   FLOAT ENQUIRY MODAL — open / close / submit
══════════════════════════════════ */
function openFloatEnquiry(source) {
  document.getElementById('floatEnquiryBackdrop').classList.add('open');
  document.getElementById('floatEnquiryModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  // GA4: track popup open
  try { gtag('event', 'lead_popup_open', { event_category: 'engagement', event_label: source || 'unknown' }); } catch(e) {}
}

function closeFloatEnquiry() {
  document.getElementById('floatEnquiryBackdrop').classList.remove('open');
  document.getElementById('floatEnquiryModal').classList.remove('open');
  document.body.style.overflow = '';
  // Don't re-show within this tab session, and reset the 24hr cooldown from dismiss time
  try { sessionStorage.setItem('feq_dismissed', '1'); } catch(e) {}
  try { localStorage.setItem('feq_last_shown', Date.now().toString()); } catch(e) {}
}

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeFloatEnquiry();
});

function feqSubmit() {
  var n = (document.getElementById('feq-name').value || '').trim();
  var p = (document.getElementById('feq-phone').value || '').trim();
  var e = (document.getElementById('feq-email').value || '').trim();
  var t = (document.getElementById('feq-type').value || '');
  var m = (document.getElementById('feq-message').value || '').trim();
  var status = document.getElementById('feqStatus');
  var btn    = document.getElementById('feqBtn');

  if (!n) { status.textContent = 'please enter your name.'; status.style.color = '#e55544'; return; }
  if (!p) { status.textContent = 'please enter your phone number.'; status.style.color = '#e55544'; return; }
  if (!e || !e.includes('@')) { status.textContent = 'please enter a valid email.'; status.style.color = '#e55544'; return; }

  btn.textContent = 'sending…'; btn.disabled = true; btn.style.opacity = '0.6';
  status.textContent = ''; status.style.color = 'var(--white-muted)';

  // GA4: track popup form submission
  try {
    gtag('event', 'lead_popup_submit', {
      event_category: 'lead',
      event_label: 'homepage_popup',
      project_type: t || 'not specified'
    });
  } catch(err) {}

  try {
    emailjs.send('service_3dpadmb', 'template_jg3vvys', {
      to_email:     'hello@indevastudio.com',
      from_name:    n, from_email: e, reply_to: e,
      user_name:    n, user_email: e, phone: p,
      project_type: t || 'Not specified',
      message:      'Name: ' + n + ' | Phone: ' + p + ' | Email: ' + e + ' | Type: ' + t + ' | Msg: ' + m,
      subject:      'Homepage popup enquiry from ' + n
    });
  } catch(err) {}

  setTimeout(function() {
    btn.textContent = 'send enquiry →'; btn.disabled = false; btn.style.opacity = '1';
    document.getElementById('feq-name').value = '';
    document.getElementById('feq-phone').value = '';
    document.getElementById('feq-email').value = '';
    document.getElementById('feq-message').value = '';
    document.getElementById('feq-type').selectedIndex = 0;
    closeFloatEnquiry();
    var ty = document.getElementById('thankYouModal');
    if (ty) ty.classList.add('open');
  }, 1800);
}

/* ---- originally inline at line 9539 ---- */
function openLeadPopup() {
  var dismissed = false;
  try { dismissed = sessionStorage.getItem('lp_dismissed'); } catch(e){}
  document.getElementById('leadPopupBackdrop').classList.add('open');
  document.getElementById('leadPopup').classList.add('open');
  document.body.style.overflow = 'hidden';
  try { gtag('event', 'lead_popup_open', { event_category: 'engagement', event_label: 'manual' }); } catch(e) {}
}

function closeLeadPopup() {
  document.getElementById('leadPopupBackdrop').classList.remove('open');
  document.getElementById('leadPopup').classList.remove('open');
  document.body.style.overflow = '';
  try { sessionStorage.setItem('lp_dismissed', '1'); } catch(e) {}
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeLeadPopup();
});

function lpSubmit() {
  var name     = (document.getElementById('lp-name').value  || '').trim();
  var phone    = (document.getElementById('lp-phone').value || '').trim();
  var email    = (document.getElementById('lp-email').value || '').trim();
  var location = (document.getElementById('lp-location').value || '').trim();
  var type     = (document.getElementById('lp-type').value || '').trim();
  var budget   = (document.getElementById('lp-budget').value || '').trim();
  var status = document.getElementById('lpStatus');
  var btn    = document.getElementById('lpBtn');
  if (!name || !phone || !email) {
    if (status) { status.textContent = 'please fill in all fields.'; status.style.color='#e88'; }
    return;
  }
  if (!email.includes('@')) {
    if (status) { status.textContent = 'please enter a valid email.'; status.style.color='#e88'; }
    return;
  }
  if (btn) btn.disabled = true;

  function sendLpEmailNotification() {
    if (typeof emailjs === 'undefined') return Promise.resolve();
    var params = {
      to_name: 'Indéva studio', to_email: 'hello@indevastudio.com',
      from_name: name, from_email: email, reply_to: email,
      user_name: name, user_email: email, phone: phone,
      subject: 'new quick enquiry from ' + name,
      message: 'Name: ' + name + ' | Phone: ' + phone + ' | Email: ' + email + ' | Location: ' + (location||'not specified') + ' | Project Type: ' + (type||'not specified') + ' | Budget: ' + (budget||'not specified') + ' | Source: lead popup'
    };
    return emailjs.send('service_3dpadmb', 'template_jg3vvys', params).catch(function(){});
  }

  supabaseClient.from('lead submissions').insert([{ name: name, phone: phone, email: email, location: location, project_type: type, budget: budget, source: 'lead_popup' }])
  .then(function(res) {
    if (res.error) throw res.error;
    sendLpEmailNotification();
    if (status) { status.textContent = 'thank you — we will be in touch.'; status.style.color='#9A6A3A'; }
    setTimeout(closeLeadPopup, 2000);
  })
  .catch(function(err) {
    console.error('Supabase insert failed, falling back to EmailJS', err);
    sendLpEmailNotification().then(function() {
      if (status) { status.textContent = 'thank you — we will be in touch.'; status.style.color='#9A6A3A'; }
      setTimeout(closeLeadPopup, 2000);
    });
  });
}

// Auto-open after delay
setTimeout(function() {
  try {
    var dismissed = sessionStorage.getItem('lp_dismissed');
    var lastShown = localStorage.getItem('lp_last_shown');
    var now = Date.now();
    if (!dismissed && (!lastShown || now - parseInt(lastShown) > 172800000)) {
      openLeadPopup();
      localStorage.setItem('lp_last_shown', now.toString());
    }
  } catch(e) {}
}, 18000);

// ── MOBILE NAVIGATION ─────────────────────────────
function toggleDrawer() {
  var ham = document.getElementById('hamburger');
  var drawer = document.getElementById('mobileDrawer');
  var overlay = document.getElementById('drawerOverlay');
  if (!drawer) return;
  var isOpen = drawer.classList.toggle('open');
  if (overlay) overlay.classList.toggle('open', isOpen);
  if (ham) { ham.classList.toggle('open', isOpen); ham.setAttribute('aria-expanded', String(isOpen)); }
  document.body.style.overflow = isOpen ? 'hidden' : '';
}
function showPageMob(id) {
  if (typeof showPage === 'function') showPage(id);
  ['mobileDrawer','drawerOverlay'].forEach(function(i){ var e=document.getElementById(i); if(e) e.classList.remove('open'); });
  var h=document.getElementById('hamburger'); if(h){h.classList.remove('open');h.setAttribute('aria-expanded','false');}
  document.body.style.overflow='';
  window.scrollTo(0,0);
}
var pendingCatalog = null;

function downloadCatalog(fileSlug, downloadName, label) {
  pendingCatalog = { fileSlug: fileSlug, downloadName: downloadName, label: label };
  var heading = document.getElementById('catalogGateHeading');
  if (heading) heading.innerHTML = 'download the<br><em>' + label.toLowerCase() + '</em>.';
  document.getElementById('catalogGateBackdrop').classList.add('open');
  document.getElementById('catalogGateModal').classList.add('open');
  document.body.style.overflow = 'hidden';
  try { gtag('event', 'catalog_gate_open', { event_category: 'engagement', event_label: label }); } catch(e) {}
}

function closeCatalogGate() {
  document.getElementById('catalogGateBackdrop').classList.remove('open');
  document.getElementById('catalogGateModal').classList.remove('open');
  document.body.style.overflow = '';
}

function showCatalogDownloadLink() {
  if (!pendingCatalog) return;
  var link = document.getElementById('ty-catalog-link');
  if (!link) return;
  link.href = 'https://www.indevastudio.com/project-images-for-website/' + pendingCatalog.fileSlug + '.pdf';
  link.download = pendingCatalog.downloadName;
  link.textContent = 'download your catalogue →';
  link.style.display = 'block';
  link.onclick = function() {
    try { gtag('event', 'pdf_download', { event_category: 'Furniture Catalogue', event_label: pendingCatalog.label }); } catch(e) {}
  };
}

function catalogGateSubmit() {
  var name  = (document.getElementById('cg-name').value  || '').trim();
  var phone = (document.getElementById('cg-phone').value || '').trim();
  var email = (document.getElementById('cg-email').value || '').trim();
  var status = document.getElementById('cgStatus');
  var btn    = document.getElementById('cgBtn');
  if (!name || !phone || !email) {
    if (status) { status.textContent = 'please fill in all fields.'; status.style.color='#e88'; }
    return;
  }
  if (!email.includes('@')) {
    if (status) { status.textContent = 'please enter a valid email.'; status.style.color='#e88'; }
    return;
  }
  if (btn) btn.disabled = true;
  var catalogLabel = pendingCatalog ? pendingCatalog.label : 'Furniture Catalogue';

  function sendGateEmailNotification() {
    if (typeof emailjs === 'undefined') return Promise.resolve();
    var params = {
      to_name: 'Indéva studio', to_email: 'hello@indevastudio.com',
      from_name: name, from_email: email, reply_to: email,
      user_name: name, user_email: email, phone: phone,
      subject: 'catalogue request: ' + catalogLabel + ' — ' + name,
      message: 'Name: ' + name + ' | Phone: ' + phone + ' | Email: ' + email + ' | Catalogue: ' + catalogLabel
    };
    return emailjs.send('service_3dpadmb', 'template_jg3vvys', params).catch(function(){});
  }

  supabaseClient.from('lead submissions').insert([{ name: name, phone: phone, email: email, source: 'furniture_catalog_' + (pendingCatalog ? pendingCatalog.fileSlug : 'unknown') }])
  .then(function(res) {
    if (res.error) throw res.error;
    sendGateEmailNotification();
    closeCatalogGate();
    showCatalogDownloadLink();
    var ty = document.getElementById('thankYouModal');
    if (ty) ty.classList.add('open');
    if (btn) btn.disabled = false;
    if (status) status.textContent = '';
    document.getElementById('cg-name').value = '';
    document.getElementById('cg-phone').value = '';
    document.getElementById('cg-email').value = '';
  })
  .catch(function(err) {
    console.error('Supabase insert failed, falling back to EmailJS', err);
    sendGateEmailNotification().then(function() {
      closeCatalogGate();
      showCatalogDownloadLink();
      var ty = document.getElementById('thankYouModal');
      if (ty) ty.classList.add('open');
      if (btn) btn.disabled = false;
      if (status) status.textContent = '';
    });
  });
}

function downloadProcessPDF() {
  try { gtag('event', 'pdf_download', { event_category: 'Process' }); } catch(e) {}
  var a = document.createElement('a');
  a.href = 'https://www.indevastudio.com/indeva-studio-process.pdf';
  a.download = 'Indeva-Studio-Process.pdf';
  a.target = '_blank';
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
