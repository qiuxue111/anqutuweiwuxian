files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    # Remove the broken _v= strings
    c = c.replace('?_v=20260528-02>', '>')
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    bs = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(bs) if bs else ''
    ob,cb = s.count('{'),s.count('}')
    print(f"  {ob}={cb} {'OK' if ob==cb else 'FAIL'} | broken={c.count('?_v=')}")
