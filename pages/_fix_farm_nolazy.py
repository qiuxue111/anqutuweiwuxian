"""移除 loading='lazy' 解决浏览器干预问题"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

c = c.replace("bg.loading = 'lazy';", '')
c = c.replace("hd.loading = 'lazy';", '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
print('loading lazy 剩:', c.count("loading = 'lazy'"))
