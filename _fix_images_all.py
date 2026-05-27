files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
old = "var imgs = p.images ? JSON.parse(p.images) : [];"
new = "var imgs = p.images && typeof p.images === 'string' ? JSON.parse(p.images) : [];"
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    c = c.replace(old, new)
    open(fp,'w',encoding='utf8').write(c)
    print(fp.split('/')[-1] + ': done')
print('ALL')
