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
    
    # Fix: +',{  should be +',  (newline) {
    # Currently:    URL+',{
    #                headers:{
    # Should be:    URL+',
    #               {
    #                headers:{
    c = c.replace(
        "encodeURIComponent(mapNameCN)+',{\n      headers:{",
        "encodeURIComponent(mapNameCN)+',\n    {\n      headers:{"
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Verify
print()
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    # Check for bad patterns
    bad = c2.count("+',{")
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {ok} | bad_pattern={bad}")
