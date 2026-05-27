files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix the broken line - add missing quote and correct
    old_broken = ".slice(2,8)+'.jpg,{"
    new_fixed = ".slice(2,8)+'.jpg',{"
    if old_broken in c:
        c = c.replace(old_broken, new_fixed)
        print(f"{fp.split('/')[-1]}: fixed missing quote")
    
    # Also check for any other broken patterns
    import re
    # Search for .jpg without closing quote
    for m in re.finditer(r"\.slice\(2,8\)\+'\.jpg[^']", c):
        ctx = c[max(0,m.start()-20):min(len(c),m.end()+20)]
        print(f"Found broken: ...{ctx}...")
    
    open(fp, 'w', encoding='utf8').write(c)

print('DONE')
