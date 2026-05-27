import re
c = open('F:/暗区突围网站/index.html', 'r', encoding='utf8').read()
for i,m in enumerate(re.finditer("Bearer '+token", c)):
    print(f'{i}: ...{c[max(0,m.start()-80):m.end()+80]}...')

print()
c2 = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
for i,m in enumerate(re.finditer("Bearer '+token", c2)):
    print(f'{i}: gear {c2[max(0,m.start()-80):m.end()+80]}...')
