#!/usr/bin/env python3
"""Email a published article to the studio (used by .github/workflows/article-published.yml).

  RESEND_API_KEY=... python3 content-engine/email_article.py <slug> [<slug> ...]

Reads the built page insights/<slug>/index.html and sends the full article (hero image, text,
captions, links) with a link to the live page. Standard library only.
"""
import html, json, os, re, sys, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ORIGIN = 'https://www.indevastudio.com'
TO = os.environ.get('ARTICLE_EMAIL_TO', 'ceo@indevastudio.com')
FROM = os.environ.get('NOTIFY_FROM') or 'hello@indevastudio.com'


def meta(page, prop):
    m = re.search(r'<meta (?:property|name)="' + re.escape(prop) + r'" content="([^"]*)"', page)
    return html.unescape(m.group(1)) if m else ''


def build_email(slug):
    page = open(os.path.join(ROOT, 'insights', slug, 'index.html'), encoding='utf-8').read()
    url = f'{ORIGIN}/insights/{slug}'
    title = html.unescape(re.search(r'<h1 class="article-title">(.*?)</h1>', page, re.S).group(1))
    desc = meta(page, 'description')
    hero = meta(page, 'og:image')
    body = re.search(r'<main class="article-body">([\s\S]*?)</main>', page).group(1)
    body = re.sub(r'<div class="project-link">[\s\S]*?</div>', '', body)
    # absolute links and images, no srcset, inline styles that survive email clients
    body = re.sub(r'\s(?:srcset|sizes|loading|decoding|fetchpriority)="[^"]*"', '', body)
    body = re.sub(r'(src|href)="/', rf'\1="{ORIGIN}/', body)
    body = re.sub(r'<img ', '<img style="width:100%;height:auto;display:block;border:0;" ', body)
    body = body.replace('<figure class="tall">', '<figure>')
    body = body.replace('<figure>', '<figure style="margin:24px 0;">')
    body = body.replace('<figcaption>', '<figcaption style="font-size:12px;color:#777;margin-top:8px;line-height:1.5;">')
    body = body.replace('<h2>', '<h2 style="font-size:20px;font-weight:400;margin:32px 0 8px;color:#111;">')
    body = body.replace('<p>', '<p style="margin:0 0 14px;">')
    body = body.replace('<a href=', '<a style="color:#8b5e34;" href=')
    words = len(re.sub(r'<[^>]+>', ' ', body).split())
    doc = f"""<!DOCTYPE html><html><body style="margin:0;background:#f4f1ec;">
<div style="max-width:640px;margin:0 auto;padding:28px 22px;background:#faf8f4;font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#222;">
  <p style="font-size:11px;letter-spacing:.15em;text-transform:uppercase;color:#8b5e34;margin:0 0 6px;">new article published · indevastudio.com</p>
  <h1 style="font-size:28px;font-weight:300;line-height:1.25;margin:0 0 10px;color:#111;">{html.escape(title)}</h1>
  <p style="color:#555;margin:0 0 18px;">{html.escape(desc)}</p>
  <p style="margin:0 0 22px;"><a href="{url}" style="display:inline-block;background:#8b5e34;color:#fff;padding:10px 18px;text-decoration:none;font-size:13px;letter-spacing:.08em;">open the live article ↗</a></p>
  <img src="{hero}" alt="" style="width:100%;height:auto;display:block;border:0;margin:0 0 24px;">
  {body}
  <hr style="border:0;border-top:1px solid #ddd;margin:32px 0 16px;">
  <p style="font-size:12px;color:#777;margin:0;">{words} words · live at <a href="{url}" style="color:#8b5e34;">{url}</a><br>
  to change or remove it, ask Claude in chat or edit <code>content-engine/posts/{slug}.md</code> on GitHub.<br>
  next step: request indexing for this URL in Google Search Console.</p>
</div></body></html>"""
    return title, doc


def send(subject, doc):
    key = os.environ.get('RESEND_API_KEY')
    if not key:
        sys.exit('RESEND_API_KEY is not set')
    payload = json.dumps({'from': f'indéva studio <{FROM}>', 'to': [TO], 'subject': subject, 'html': doc}).encode()
    req = urllib.request.Request('https://api.resend.com/emails', data=payload, method='POST',
                                 headers={'Authorization': f'Bearer {key}', 'Content-Type': 'application/json',
                                          'User-Agent': 'indeva-content-engine'})
    with urllib.request.urlopen(req, timeout=30) as r:
        print(r.status, r.read().decode()[:200])


def main():
    slugs = [s for s in sys.argv[1:] if s]
    if not slugs:
        sys.exit(__doc__)
    for slug in slugs:
        title, doc = build_email(slug)
        if os.environ.get('DRY_RUN'):
            out = f'/tmp/email-{slug}.html'
            open(out, 'w', encoding='utf-8').write(doc)
            print('dry run →', out)
        else:
            send(f'new article live: {title}', doc)
            print(f'emailed {slug} to {TO}')


if __name__ == '__main__':
    main()
