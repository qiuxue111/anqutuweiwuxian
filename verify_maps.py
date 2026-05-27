import re, os

d = 'F:\\暗区突围网站\\pages'
for f in sorted(os.listdir(d)):
    if f.startswith('map-') and f.endswith('.html'):
        c = open(os.path.join(d,f), 'r', encoding='utf-8').read()
        m = re.search(r'<title>([^<]+)</title>', c)
        m2 = re.search(r'<img[^>]+src="([^"]+)"', c)
        m3 = re.search(r'localStorage\.setItem\("([^"]+)"', c)
        title = m.group(1) if m else '?'
        img = m2.group(1) if m2 else '?'
        key = m3.group(1) if m3 else '?'
        print(f'{f:25s} | {title:30s} | {os.path.basename(img):20s} | {key:20s}')
