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
    
    # Fix: add async to function submitMapComment
    c = c.replace('function submitMapComment(){', 'async function submitMapComment(){')
    # Fix: add async to function submitPinComment
    c = c.replace('function submitPinComment(){', 'async function submitPinComment(){')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: added async")

# Verify
import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"{fp.split('/')[-1]}: {ob}={cb} ({op}={cp}) {ok}")
