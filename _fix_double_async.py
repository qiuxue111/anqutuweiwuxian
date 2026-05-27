files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    c = c.replace('async async function', 'async function')
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")
