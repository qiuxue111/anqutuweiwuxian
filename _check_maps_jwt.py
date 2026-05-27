import os, re
basedir = 'F:/暗区突围网站/pages'
for fn in sorted(os.listdir(basedir)):
    if not fn.startswith('map-') or not fn.endswith('.html'): continue
    fp = os.path.join(basedir, fn)
    c = open(fp, 'r', encoding='utf8').read()
    if "Bearer '+localStorage.getItem('abi_token')" in c:
        print(f"{fn}: HAS JWT token in supabase()")
    else:
        print(f"{fn}: no JWT token")
