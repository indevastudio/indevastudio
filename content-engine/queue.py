#!/usr/bin/env python3
"""List the brief queue, or print the next brief to write.

  python3 content-engine/queue.py          show every brief and its status
  python3 content-engine/queue.py --next   print the id of the next ready brief (empty if none)
  python3 content-engine/queue.py --set <id> <status>   update a brief's status
"""
import glob, os, re, sys
import yaml

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'briefs')


def briefs():
    out = []
    for f in glob.glob(os.path.join(DIR, '*.md')):
        if os.path.basename(f).startswith('_'):
            continue
        m = re.match(r'^---\n([\s\S]*?)\n---', open(f, encoding='utf-8').read())
        d = yaml.safe_load(m.group(1)) if m else {}
        d['_file'] = f
        out.append(d)
    return sorted(out, key=lambda d: (d.get('priority', 99), d.get('id', '')))


def main():
    a = sys.argv[1:]
    if a[:1] == ['--next']:
        nxt = [b for b in briefs() if b.get('status') == 'ready']
        print(nxt[0]['id'] if nxt else '')
    elif a[:1] == ['--set'] and len(a) == 3:
        b = next((b for b in briefs() if b.get('id') == a[1]), None)
        if not b:
            sys.exit(f'no brief {a[1]}')
        s = open(b['_file'], encoding='utf-8').read()
        s = re.sub(r'^status: \S+', f'status: {a[2]}', s, count=1, flags=re.M)
        open(b['_file'], 'w', encoding='utf-8').write(s)
        print(f'{a[1]} → {a[2]}')
    else:
        for b in briefs():
            print(f"{b.get('priority', '-'):>3}  {b.get('status', '?'):<10} {b.get('id')}  —  {b.get('target_keyword', '')}")


if __name__ == '__main__':
    main()
