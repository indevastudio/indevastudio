"""Creates <name>-<size>.avif next to each portfolio .webp listed in content/projects.json.
Skips files that already exist. Then run: node build-portfolio.cjs
Usage: python3 tools/make-avif.py [extra.webp ...]"""
import json, os, sys
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
files = [f"{p['image']}-{s}.webp" for p in json.load(open('content/projects.json'))['projects'] if p['image'] for s in p['sizes']] + sys.argv[1:]
for src in files:
    dst = src[:-5] + '.avif'
    if os.path.exists(src) and not os.path.exists(dst):
        Image.open(src).save(dst, 'AVIF', quality=55); print('wrote', dst)
