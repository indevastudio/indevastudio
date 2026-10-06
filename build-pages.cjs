#!/usr/bin/env node
/**
 * indéva studio — static page builder
 *
 * site-app.html is the single source for the main site. It holds every
 * section (home, about, services, ...) as <div class="page" id="...">.
 * This script writes one static HTML file per URL that contains ONLY that
 * URL's section, with its own <title>, description, canonical and <h1>, so
 * every URL has unique, crawlable content in the HTML itself.
 *
 *   site-app.html  ->  index.html, about.html, services.html, process.html,
 *                      philosophy.html, contact.html, furniture.html, vendors.html
 *
 * /projects and /insights are separate pages (projects.html, insights/index.html)
 * and are not built here. Edit site-app.html, never the generated files.
 * Run: node build-pages.cjs   (also run by .github/workflows/seo-build.yml)
 */
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const ORIGIN = 'https://www.indevastudio.com';
const SRC = path.join(ROOT, 'site-app.html');

const PAGES = [
  { id: 'home', file: 'index.html', url: '/' }, // keeps the <head> written in site-app.html
  { id: 'about', file: 'about.html', url: '/about',
    title: 'about indéva studio — architecture-led interior design, delhi',
    desc: 'indéva studio is an architecture-led interior design and execution studio in delhi, founded by arpit saini. our approach, our principles and how we work.' },
  { id: 'services', file: 'services.html', url: '/services',
    title: 'services — interior design, furniture & execution | indéva studio',
    desc: 'architecture and interior design, custom furniture and joinery, and turnkey project execution across delhi ncr, delivered by one accountable studio.' },
  { id: 'process', file: 'process.html', url: '/process',
    title: 'our process — from brief to handover | indéva studio',
    desc: 'how indéva studio runs a project: brief, design, drawings, material selection, site execution and handover, with clear decisions at every stage.' },
  { id: 'philosophy', file: 'philosophy.html', url: '/philosophy',
    title: 'design philosophy — indéva studio',
    desc: 'the principles behind indéva studio’s interiors: human-centred planning, honest materials, invisible detail and design that is built to be lived in.' },
  { id: 'contact', file: 'contact.html', url: '/contact',
    title: 'contact indéva studio — start your interior project',
    desc: 'talk to indéva studio about your home, office or hospitality project in delhi ncr. call +91 97178 81083, email hello@indevastudio.com or send the enquiry form.' },
  { id: 'furniture', file: 'furniture.html', url: '/furniture',
    title: 'custom furniture & joinery — indéva studio',
    desc: 'custom furniture and joinery designed and built by indéva studio: seating, beds, storage and dining pieces made for daily use, not just a photoshoot.' },
  { id: 'vendors', file: 'vendors.html', url: '/vendors',
    title: 'material & vendor network — indéva studio',
    desc: 'the manufacturers, material partners and technical specialists indéva studio works with across hardware, surfaces, lighting, sanitaryware and services.' },
];

const esc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;|#)/g, '&amp;').replace(/"/g, '&quot;');

// Replace <script>/<style> bodies with spaces so tag counting ignores markup inside JS/CSS.
function mask(html) {
  return html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, m => ' '.repeat(m.length));
}

function findPages(html) {
  const masked = mask(html);
  const re = /<div class="page(?: active)?" id="([a-z]+)">/g;
  const pages = [];
  let m;
  while ((m = re.exec(masked))) {
    // walk forward to the matching </div>
    const tagRe = /<div\b|<\/div>/g;
    tagRe.lastIndex = m.index;
    let depth = 0, end = -1, t;
    while ((t = tagRe.exec(masked))) {
      depth += t[0] === '</div>' ? -1 : 1;
      if (depth === 0) { end = t.index + t[0].length; break; }
    }
    if (end < 0) throw new Error(`unclosed page div #${m[1]}`);
    pages.push({ id: m[1], start: m.index, end });
  }
  return pages;
}

function setHead(html, p) {
  if (!p.title) return html;
  const url = ORIGIN + p.url;
  const rep = (re, val, label) => {
    if (!re.test(html)) throw new Error(`${p.file}: ${label} not found in site-app.html`);
    html = html.replace(re, (_, a, b) => a + val + b);
  };
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${p.title}</title>`);
  rep(/(<meta name="description" content=")[^"]*(")/, esc(p.desc), 'meta description');
  rep(/(<link rel="canonical"[^>]*href=")[^"]*(")/, url, 'canonical');
  rep(/(<meta property="og:url"[^>]*content=")[^"]*(")/, url, 'og:url');
  rep(/(<meta property="og:title"[^>]*content=")[^"]*(")/, esc(p.title), 'og:title');
  html = html.replace(/(<meta property="og:description"[^>]*content=")[^"]*(")/, (_, a, b) => a + esc(p.desc) + b);
  html = html.replace(/(<meta name="twitter:title"[^>]*content=")[^"]*(")/, (_, a, b) => a + esc(p.title) + b);
  html = html.replace(/(<meta name="twitter:description"[^>]*content=")[^"]*(")/, (_, a, b) => a + esc(p.desc) + b);
  return html;
}

function build() {
  const src = fs.readFileSync(SRC, 'utf8');
  const sections = findPages(src);
  const byId = Object.fromEntries(sections.map(s => [s.id, s]));
  const first = sections[0].start, last = sections[sections.length - 1].end;
  const prefix = src.slice(0, first), suffix = src.slice(last);

  for (const p of PAGES) {
    const s = byId[p.id];
    if (!s) throw new Error(`section #${p.id} missing from site-app.html`);
    let block = src.slice(s.start, s.end)
      .replace(/^<div class="page(?: active)?" id="([a-z]+)">/, '<div class="page active" id="$1">');
    if (p.id !== 'home') {
      // the section's first heading becomes the page's single <h1>
      let done = false;
      block = block.replace(/<h2(\b[^>]*)>([\s\S]*?)<\/h2>/, (m, a, inner) => { done = true; return `<h1${a}>${inner}</h1>`; });
      if (!done) throw new Error(`#${p.id} has no <h2> to promote to <h1>`);
    }
    // keep scripts that lived inside removed sections (they define shared functions)
    const kept = sections.filter(o => o.id !== p.id)
      .map(o => (src.slice(o.start, o.end).match(/<script\b[\s\S]*?<\/script>/gi) || []).join('\n'))
      .filter(Boolean).join('\n');
    let out = prefix + block + (kept ? '\n' + kept + '\n' : '') + suffix;
    if (p.id !== 'home') out = out.replace(/<h1(\b[^>]*class="hero-headline[\s\S]*?)<\/h1>/, '<h2$1</h2>'); // safety: no stray home h1
    out = setHead(out, p);
    out = out.replace(/^(<!DOCTYPE html>\s*)/i, '$1<!-- GENERATED by build-pages.cjs from site-app.html. Edit site-app.html, not this file. -->\n');
    const h1s = (out.match(/<h1\b/g) || []).length;
    if (h1s !== 1) throw new Error(`${p.file}: expected 1 <h1>, found ${h1s}`);
    fs.writeFileSync(path.join(ROOT, p.file), out);
    console.log(`  ${p.file.padEnd(16)} ${(out.length / 1024).toFixed(0).padStart(4)} KB  #${p.id}`);
  }
}

build();
console.log('pages built from site-app.html');
