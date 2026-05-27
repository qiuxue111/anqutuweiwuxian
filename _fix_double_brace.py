files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix the double }}
    old = "function fabOpenPostForm(){openPostFormModal();}}"
    new = "function fabOpenPostForm(){openPostFormModal();}"
    if old in c:
        c = c.replace(old, new)
        print(f"{fp.split('/')[-1]}: fixed double brace")
    else:
        print(f"{fp.split('/')[-1]}: pattern not found")
    
    open(fp, 'w', encoding='utf8').write(c)

print('DONE')
