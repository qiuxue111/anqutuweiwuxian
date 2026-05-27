files = [
    'F:/暗区突围网站/pages/weapons.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. Fix fabOpenPostForm - add 'async' keyword
    old_fab = "function fabOpenPostForm(){"
    new_fab = "async function fabOpenPostForm(){"
    c = c.replace(old_fab, new_fab)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': fixed')

print('DONE')
