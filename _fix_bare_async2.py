files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    # Remove bare 'async' on its own line before another 'async function'
    c = re.sub(r'\nasync\s*\n\s*async function', '\nasync function', c)
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed bare async")

print('DONE')
