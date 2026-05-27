files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    old = 'var delBtn=(token&&p.author===getUserName())?\'<button style="padding:2px 8px;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;" onclick="deletePost(\'+pId+\')">删除</button>\':\'\';'
    new = 'var delBtn=\'\';'
    
    if old in c:
        c = c.replace(old, new)
        print(f"{fp.split('/')[-1]}: replaced exact match")
    else:
        # Try finding the pattern and extracting
        idx = c.index("var delBtn")
        end_idx = c.index(";\n      \n      return", idx)
        actual = c[idx:end_idx+1]
        print(f"{fp.split('/')[-1]}: exact match not found, actual='{actual[:80]}...")
        c = c.replace(actual, 'var delBtn=\'\';')
        print(f"{fp.split('/')[-1]}: replaced via fuzzy match")
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)

print('DONE')
