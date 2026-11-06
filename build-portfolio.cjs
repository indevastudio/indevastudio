#!/usr/bin/env node
/**
 * indéva studio — portfolio builder
 * Renders the /projects "selected work." section from content/projects.json
 * into projects.html, between <!--portfolio:start--> and <!--portfolio:end-->.
 * Run from the repo root: node build-portfolio.cjs
 *
 * Images: for "<image>-<size>.webp" it also emits an AVIF <source> when
 * "<image>-<size>.avif" exists next to it (see tools/make-avif.py).
 */
const fs = require('fs');
const path = require('path');
const ROOT = __dirname;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/projects.json'), 'utf8'));
const FILE = path.join(ROOT, 'projects.html');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const has = f => fs.existsSync(path.join(ROOT, f));
const STATUS = { 'Completed': 'done', 'In Progress': 'wip', 'Design Development': 'dev' };
const FILTERS = ['All', 'Residential', 'Farmhouses', 'Commercial', 'Hospitality', 'Furniture', 'Design Development', 'In Progress'];

function picture(p, eager) {
  if (!p.image) {
    return `<div class="pf-ph" role="img" aria-label="Images to be added"><span>Layouts and renders<br>to be added</span></div>`;
  }
  const set = ext => p.sizes.filter(s => has(`${p.image}-${s}.${ext}`)).map(s => `/${p.image}-${s}.${ext} ${s}w`).join(', ');
  const sizes = p.layout === 'wide' ? '100vw' : p.layout === 'large' ? '(max-width: 800px) 100vw, 60vw' : '(max-width: 800px) 100vw, 42vw';
  const avif = set('avif');
  const src = `/${p.image}-${p.sizes[0]}.webp`;
  return `<picture>${avif ? `<source type="image/avif" srcset="${avif}" sizes="${sizes}">` : ''}` +
    `<img src="${src}" srcset="${set('webp')}" sizes="${sizes}" width="${p.w}" height="${p.h}" alt="${esc(p.alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async"></picture>`;
}

function card(p, i) {
  const facts = [p.area, ...(p.facts || [])].filter(Boolean).map(f => `<li>${esc(f)}</li>`).join('');
  return `<article class="pf-item ${p.layout}" data-filters="${esc(p.filters.join('|'))}">
<a class="pf-link" href="/projects/${p.slug}">
<figure class="pf-fig">${picture(p, i === 0)}
<span class="pf-status ${STATUS[p.status]}">${esc(p.status)}</span>${p.imageKind === 'render' ? '<span class="pf-kind">design render</span>' : ''}</figure>
<div class="pf-meta"><span>${esc(p.category)}</span><span>${esc(p.location)}</span></div>
<h3>${esc(p.name)}</h3>
<p>${esc(p.summary)}</p>
<ul class="pf-facts">${facts}</ul>
</a>
</article>`;
}

const projects = data.projects;
const html = `<!--portfolio:start-->
<section class="pf-head">
<div class="pf-eyebrow"><span></span>portfolio</div>
<h1>selected work.</h1>
<p class="pf-lede">A collection of spaces, ideas and work in progress. Each shaped by the way people live, the constraints of the site and the details that bring a design to life.</p>
<dl class="pf-key" aria-label="How projects are labelled">
<div><dt><span class="pf-status done">Completed</span></dt><dd>Built by our team and handed over. Photographs are of the finished space.</dd></div>
<div><dt><span class="pf-status wip">In Progress</span></dt><dd>On site now. Shown with design renders until the work is finished.</dd></div>
<div><dt><span class="pf-status dev">Design Development</span></dt><dd>Plans, drawings and renders. Not yet built.</dd></div>
</dl>
</section>
<section id="work" class="pf-work" aria-label="Projects">
<div class="pf-bar">
<div role="group" aria-label="Filter projects" class="pf-filters">
${FILTERS.map((f, i) => `<button type="button" class="cs-filter" data-filter="${f === 'All' ? 'all' : esc(f)}" aria-pressed="${i === 0}">${esc(f)}</button>`).join('\n')}
</div>
<p id="cs-count" aria-live="polite">Showing ${projects.length} projects</p>
</div>
<div class="pf-grid" id="pf-grid">
${projects.map(card).join('\n')}
</div>
<p class="pf-empty" id="pf-empty" hidden>No projects in this category yet.</p>
</section>
<section class="pf-more" aria-label="More of our work">
<div class="pf-more-col">
<div class="pf-eyebrow"><span></span>technical documentation</div>
<h2>the drawings behind the work</h2>
<p>Working drawings, design-intent sets and BOQs are where a design becomes buildable. A few we can share publicly:</p>
<ul class="pf-docs">${data.documentation.map(d => `<li><a href="${d.href}" target="_blank" rel="noopener"><span class="pf-doc-kind">${esc(d.kind)}</span><span class="pf-doc-t">${esc(d.title)}</span><span class="pf-doc-n">${esc(d.note)}</span></a></li>`).join('')}</ul>
</div>
<div class="pf-more-col">
<div class="pf-eyebrow"><span></span>furniture &amp; joinery</div>
<h2>made for the room it lives in</h2>
<p>Kitchens, wardrobes, panelling and loose furniture, drawn and built by our team to the exact wall, ceiling and window they sit beside.</p>
<p><a class="pf-arrow" href="/furniture">See the furniture catalogue</a></p>
<p><a class="pf-arrow" href="/services/modular-kitchen-design">Kitchens &amp; wardrobes</a></p>
</div>
<div class="pf-more-col">
<div class="pf-eyebrow"><span></span>studio explorations</div>
<h2>material studies and experiments</h2>
<p>Samples, prototypes and ideas we test before they reach a client's home. We'll publish them here as we document them.</p>
</div>
</section>
<!--portfolio:end-->`;

let page = fs.readFileSync(FILE, 'utf8');
const a = page.indexOf('<!--portfolio:start-->'), b = page.indexOf('<!--portfolio:end-->');
if (a < 0 || b < 0) throw new Error('portfolio markers not found in projects.html');
page = page.slice(0, a) + html + page.slice(b + '<!--portfolio:end-->'.length);
fs.writeFileSync(FILE, page);
console.log(`portfolio: ${projects.length} projects written to projects.html`);
