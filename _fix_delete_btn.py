files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix pin comment delete button: escape and concatenation is wrong
    # Current: deletePinComment(''+c.id+'',''+curPinIdx+'')
    # Should: deletePinComment(c.id,curPinIdx)
    c = c.replace(
        "deletePinComment(''+c.id+'',''+curPinIdx+'')",
        "deletePinComment(c.id,curPinIdx)"
    )
    
    # Fix map comment delete button
    c = c.replace(
        "deleteMapComment('+c.id+','mcList')",
        "deleteMapComment(c.id,'mcList')"
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp}")
