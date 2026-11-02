#!/usr/bin/env python3
"""Minimal emulation of Vercel static routing for this repo.
Order: .vercelignore filter -> trailingSlash/cleanUrls normalisation -> redirects
-> filesystem (cleanUrls) -> rewrites (re-check filesystem) -> 404.
Usage: vroute.py REPO /path [/path ...]   (prints status, target)
"""
import json, os, re, sys, fnmatch

def load_ignore(repo):
    pats = []
    p = os.path.join(repo, '.vercelignore')
    if os.path.exists(p):
        for line in open(p):
            line = line.strip()
            if line and not line.startswith('#'):
                pats.append(line)
    return pats

def ignored(rel, pats):
    parts = rel.split('/')
    res = False
    for pat in pats:
        neg = pat.startswith('!')
        q = pat[1:] if neg else pat
        q = q.rstrip('/')
        hit = False
        if '/' in q:
            q2 = q.lstrip('/')
            hit = fnmatch.fnmatch(rel, q2) or rel.startswith(q2 + '/')
        else:
            hit = any(fnmatch.fnmatch(part, q) for part in parts)
        if hit:
            res = not neg
    return res

def src_to_re(src):
    # path-to-regexp subset: :name, :name*, (.*) groups
    out, i, names = '', 0, []
    while i < len(src):
        c = src[i]
        if c == ':':
            m = re.match(r':(\w+)(\*|\+|\?)?', src[i:])
            names.append(m.group(1))
            mod = m.group(2)
            out += '(.*)' if mod in ('*', '+') else '([^/]+)'
            i += len(m.group(0))
        elif c == '(':
            j = src.index(')', i)
            out += src[i:j+1]
            names.append(None)
            i = j + 1
        elif c in '.+?^$|[]{}\\':
            out += '\\' + c; i += 1
        else:
            out += c; i += 1
    return re.compile('^' + out + '$'), names

def subst(dest, m, names):
    for idx, n in enumerate(names):
        val = m.group(idx + 1) or ''
        if n:
            dest = re.sub(':' + n + r'\*?', val, dest)
        dest = dest.replace('$%d' % (idx + 1), val)
    return dest

class Router:
    def __init__(self, repo):
        self.repo = repo
        self.cfg = json.load(open(os.path.join(repo, 'vercel.json')))
        self.pats = load_ignore(repo)
        self.redirects = [(src_to_re(r['source']), r) for r in self.cfg.get('redirects', [])]
        self.rewrites = [(src_to_re(r['source']), r) for r in self.cfg.get('rewrites', [])]

    def fs(self, path):
        rel = path.lstrip('/')
        cands = []
        if rel == '':
            cands = ['index.html']
        else:
            cands = [rel + '.html', rel + '/index.html', rel] if self.cfg.get('cleanUrls') else [rel, rel + '/index.html']
        for c in cands:
            full = os.path.join(self.repo, c)
            if os.path.isfile(full) and not ignored(c, self.pats):
                return c
        return None

    def resolve(self, path, depth=0):
        if depth > 10:
            return ('LOOP', path)
        p = path.split('?')[0]
        if self.cfg.get('trailingSlash') is False and len(p) > 1 and p.endswith('/'):
            return ('308', p.rstrip('/'))
        if self.cfg.get('cleanUrls'):
            if p.endswith('.html'):
                np = p[:-5]
                if np.endswith('/index'): np = np[:-6] or '/'
                return ('308', np)
        for (rx, names), r in self.redirects:
            m = rx.match(p)
            if m:
                code = str(r.get('statusCode', 308 if r.get('permanent', True) else 307))
                return (code, subst(r['destination'], m, names))
        f = self.fs(p)
        if f:
            return ('200', f)
        for (rx, names), r in self.rewrites:
            m = rx.match(p)
            if m:
                d = subst(r['destination'], m, names)
                if d.startswith('http'):
                    return ('200-ext', d)
                f = self.fs(d.split('?')[0])
                return ('200', f) if f else ('404', 'rewrite->' + d)
        return ('404', None)

    def follow(self, path):
        chain = []
        cur = path
        for _ in range(10):
            st, tgt = self.resolve(cur)
            chain.append((cur, st, tgt))
            if st in ('301', '302', '307', '308') and tgt and tgt.startswith('/'):
                cur = tgt
                continue
            break
        return chain

if __name__ == '__main__':
    r = Router(sys.argv[1])
    for p in sys.argv[2:]:
        ch = r.follow(p)
        print(' -> '.join('%s[%s]' % (c[0], c[1]) for c in ch), '=>', ch[-1][2])
