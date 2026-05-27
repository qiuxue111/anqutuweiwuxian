files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix ALL broken variants of the jpg pattern
    import re
    # Replace any variant of .slice(2,8)+'.something' with the correct version
    c = re.sub(
        r"\.slice\(2,8\)\+'[\"']?\.j'?p'?g'?",
        ".slice(2,8)+'.jpg'",
        c
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Verify
print('\n--- Verify ---')
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    # Check all occurrences
    for m in __import__('re').finditer(r"slice\(2,8\)\+'.*?\)", c):
        st = max(0, m.start()-10)
        en = min(len(c), m.end()+10)
        snippet = c[st:en]
        if '.jpg' not in snippet:
            print(f"  WARNING: {fp.split('/')[-1]}: weird pattern: ...{snippet}...")
    
    ms = __import__('re').findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    print(f"{fp.split('/')[-1]}: {'{'}{ob}{'}'}={cb} ({op})={cp} {'OK' if ob==cb and op==cp else 'FAIL'}")

print('DONE')
