files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix: use timestamp+random instead of original filename
    # In submitPostModal
    old_fn = "+'_'+f.name"
    new_fn = "+'_'+Math.random().toString(36).slice(2,8)+'.jpg"
    c = c.replace(old_fn, new_fn)
    
    # Same fix in addCommentFromModal
    c = c.replace(old_fn, new_fn)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed filename")

# Check
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    count = c.count("+'_'+f.name")
    print(f"  {fp.split('/')[-1]}: remaining _'+f.name refs = {count}")

print('DONE')
