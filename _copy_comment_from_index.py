"""
Copy working comment functions from index.html to subpages (gear/strategy/weapons)
Replace these functions entirely: 
- loadComments
- openPostModal
- addCommentFromModal

Source: index.html (known working)
"""

src = open('F:/暗区突围网站/index.html', 'r', encoding='utf8').read()
targets = ['F:/暗区突围网站/pages/gear.html', 'F:/暗区突围网站/pages/strategy.html', 'F:/暗区突围网站/pages/weapons.html']

# Extract functions from index.html
def extract_fn(code, fn_name):
    start = code.find('async function ' + fn_name + '(')
    if start < 0:
        start = code.find('function ' + fn_name + '(')
    if start < 0:
        return None
    
    depth = 0
    i = start
    while i < len(code):
        if code[i] == '{': depth += 1
        elif code[i] == '}':
            depth -= 1
            if depth == 0:
                return code[start:i+1]
        i += 1
    return None

# Extract functions
fn_names = ['loadComments', 'openPostModal', 'addCommentFromModal']
fns = {}
for name in fn_names:
    f = extract_fn(src, name)
    if f:
        fns[name] = f
        print(f'{name}: extracted ({len(f)} chars)')
    else:
        print(f'{name}: NOT FOUND in index.html')

for fp in targets:
    c = open(fp, 'r', encoding='utf8').read()
    
    for name, new_fn in fns.items():
        # Find old function
        start = c.find('function ' + name + '(')
        if start < 0:
            start = c.find('async function ' + name + '(')
        if start < 0:
            print(f'{fp.split("/")[-1]}: {name} NOT FOUND')
            continue
        
        depth = 0
        i = start
        while i < len(c):
            if c[i] == '{': depth += 1
            elif c[i] == '}':
                depth -= 1
                if depth == 0:
                    old_len = i - start + 1
                    c = c[:start] + new_fn + c[i+1:]
                    print(f'{fp.split("/")[-1]}: replaced {name} ({old_len} chars)')
                    break
            i += 1
    
    open(fp, 'w', encoding='utf8').write(c)

# Verify
import re
for fp in [src.name for src in targets if hasattr(src, 'name')]:
    pass

target_files = targets
for fp in target_files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp}")
