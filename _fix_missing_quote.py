files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find all .slice(2,8) and check context
    import re
    for m in re.finditer(r"\.slice\(2,8\)\+'\.jpg", c):
        st = m.start()
        # Check if the next char after .jpg is a single quote
        end = m.end()
        next_chars = c[end:end+5]
        if not c[end:end+2].startswith("'"):
            print(f"{fp.split('/')[-1]}: missing quote at pos {end}, next='{next_chars}'")
            # Fix: add the missing quote
            # The pattern is '.jpg) or '.jpg, or '.jpg; 
            # We need '.jpg')
            c = c[:end] + "'" + c[end:]
    
    # Also find any remaining +'_'+f.name patterns
    remaining = c.count("+'_'+f.name")
    if remaining:
        print(f"  Warning: {remaining} remaining f.name refs")
    
    open(fp, 'w', encoding='utf8').write(c)

print('DONE')
