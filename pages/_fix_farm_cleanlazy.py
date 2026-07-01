"""彻底清除所有 loading='lazy' 属性"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 替换属性字符串
c = c.replace('loading="lazy"', '')
c = c.replace("loading='lazy'", '')
c = c.replace('.loading = lazy', '')  # JS中
c = c.replace("bg.loading = 'lazy'", '')
c = c.replace("hd.loading = 'lazy'", '')

# 清理多余的空格
import re
c = re.sub(r'\s{2,}', ' ', c)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
print('loading lazy:', c.count('loading'))
print('loading = lazy:', c.count("loading = 'lazy'"))
