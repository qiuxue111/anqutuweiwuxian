files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    old = "'block':'none'"
    new = "'inline-flex':'none'"
    if old in c:
        c = c.replace(old, new)
        with open(fp, 'w', encoding='utf8') as f:
            f.write(c)
        print(fp.split('/')[-1] + ': fixed')
    else:
        print(fp.split('/')[-1] + ': not found')

print('done')
