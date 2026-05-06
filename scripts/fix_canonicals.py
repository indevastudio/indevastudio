#!/usr/bin/env python3
"""
fix_canonicals.py — run once to fix non-www canonical URLs in existing blog posts.

Before running this, change SITE_ORIGIN in generate_blog.py to www.
After running this, all existing blog posts will have the correct www canonical.

Usage:
  python scripts/fix_canonicals.py
  git add insights/
  git commit -m "fix: add www to canonical URLs on all existing blog posts"
  git push
"""

import pathlib, re

REPO_ROOT = pathlib.Path(__file__).parent.parent
INSIGHTS  = REPO_ROOT / "insights"

WRONG = "https://indevastudio.com"
RIGHT = "https://www.indevastudio.com"

def fix_file(path):
    content = path.read_text(errors="replace")
    if WRONG not in content:
        return False
    fixed = content.replace(WRONG, RIGHT)
    path.write_text(fixed)
    return True

def main():
    files = sorted(INSIGHTS.glob("*/index.html"))
    fixed = 0
    for f in files:
        if fix_file(f):
            print(f"  fixed: {f.parent.name}")
            fixed += 1
    print(f"\ndone — {fixed}/{len(files)} files updated")
    if fixed == 0:
        print("no files needed fixing — canonical URLs are already correct")

if __name__ == "__main__":
    main()
