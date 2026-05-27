files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix: .jp'g' -> .jpg'
    c = c.replace(".jp'g'", ".jpg'")
    # Fix: '.jpg'') -> '.jpg')
    c = c.replace(".jpg'')", ".jpg')")
    # Fix: '.jpg'' -> '.jpg'
    c = c.replace(".jpg''", ".jpg'")
    # Fix: '.jpg'),{ -> '.jpg',{
    c = c.replace(".jpg'),{", ".jpg',{")
    
    # Now verify ALL .jpg patterns
    for m in re.finditer(r"2,8\)\+'\.jpg", c):
        end = m.end()
        ctx = c[end:end+6]
        if ctx[0] != "'":
            print(f"{fp.split('/')[-1]}: jpg missing quote at {end}: next='{ctx}'")
    
    open(fp, 'w', encoding='utf8').write(c)

# Final check
print('\n--- Final check ---')
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"{fp.split('/')[-1]}: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok}")
    
    # Check for any broken jpg patterns
    bad = re.findall(r"\.slice\(2,8\)\+'\.jpg[^')\w;,\s]", s)
    if bad:
        print(f"  WARNING: broken jpg patterns: {bad}")

print('DONE')
