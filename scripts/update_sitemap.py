#!/usr/bin/env python3
"""
update_sitemap.py — indéva studio
Rebuilds sitemap.xml from all files in the repo.
Runs after generate_blog.py in the GitHub Actions workflow.

- Scans insights/ for all index.html blog post pages
- Includes static pages (home, about, insights, delhi, gurgaon, noida, sonipat)
- Always uses https://www.indevastudio.com (canonical www)
- Outputs to sitemap.xml in repo root
"""

import pathlib, datetime, xml.etree.ElementTree as ET

REPO_ROOT   = pathlib.Path(__file__).parent.parent
SITE_ORIGIN = "https://www.indevastudio.com"
TODAY       = datetime.date.today().isoformat()

# ── STATIC PAGES ─────────────────────────────────────────────────────────────
STATIC_PAGES = [
    { "loc": "/",        "priority": "1.00", "changefreq": "weekly"  },
    { "loc": "/about",   "priority": "0.90", "changefreq": "monthly" },
    { "loc": "/insights/","priority": "0.90", "changefreq": "daily"   },
    { "loc": "/delhi",   "priority": "0.95", "changefreq": "monthly" },
    { "loc": "/gurgaon", "priority": "0.95", "changefreq": "monthly" },
    { "loc": "/noida",   "priority": "0.95", "changefreq": "monthly" },
    { "loc": "/sonipat", "priority": "0.95", "changefreq": "monthly" },
]

def build_sitemap():
    root = ET.Element("urlset", {
        "xmlns":       "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xmlns:image": "http://www.google.com/schemas/sitemap-image/0.9",
    })

    def add_url(loc, priority, changefreq, lastmod=TODAY):
        u = ET.SubElement(root, "url")
        ET.SubElement(u, "loc").text         = f"{SITE_ORIGIN}{loc}"
        ET.SubElement(u, "lastmod").text     = lastmod
        ET.SubElement(u, "changefreq").text  = changefreq
        ET.SubElement(u, "priority").text    = priority

    # static pages
    for page in STATIC_PAGES:
        add_url(page["loc"], page["priority"], page["changefreq"])

    # blog pages — scan insights/ directory
    insights_dir = REPO_ROOT / "insights"
    blog_files = sorted(insights_dir.glob("*/index.html"))
    print(f"found {len(blog_files)} blog post(s)")

    for blog_file in blog_files:
        slug = blog_file.parent.name
        # Try to get real lastmod from file mtime
        mtime = datetime.date.fromtimestamp(blog_file.stat().st_mtime).isoformat()
        add_url(f"/insights/{slug}/", "0.80", "monthly", lastmod=mtime)

    # Serialise
    ET.indent(root, space="  ")
    tree = ET.ElementTree(root)
    out  = REPO_ROOT / "sitemap.xml"
    tree.write(out, encoding="utf-8", xml_declaration=True)
    print(f"sitemap written → {out}")
    print(f"  {len(STATIC_PAGES)} static pages + {len(blog_files)} blog posts = "
          f"{len(STATIC_PAGES) + len(blog_files)} total URLs")

if __name__ == "__main__":
    build_sitemap()
