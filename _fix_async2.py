files = [
    'F:/暗区突围网站/pages/weapons.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    c = c.replace("function loadPosts(){", "async function loadPosts(){")
    open(fp, 'w', encoding='utf8').write(c)
    print(fp.split('/')[-1] + ': fixed')

print('DONE')
