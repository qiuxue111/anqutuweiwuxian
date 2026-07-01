"""只删除 HTML 标签中的 loading="lazy"，不碰 JS 代码"""
path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    c = f.read()

# 只替换 HTML 标签中的 loading="lazy"（尖括号内）
import re
# 匹配 <tag ... loading="lazy" ...>
c = re.sub(r'(<[^>]+)\s+loading="lazy"([^>]*>)', r'\1\2', c)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)
print('Done')
print('loading="lazy" in HTML:', 'loading="lazy"' in c)
print("loading='lazy' in JS:", c.count("loading = 'lazy'"))
