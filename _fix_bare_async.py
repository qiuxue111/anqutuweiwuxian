files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix: remove bare 'async' on its own line followed by 'function'
    import re
    c = re.sub(r'\nasync\s*\n\s*function ', '\nasync function ', c)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
