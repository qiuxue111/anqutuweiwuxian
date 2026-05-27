import re
files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms)
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_modal = 'function openPostModal' in c
    no_cache = "window._cachedPosts=posts" not in c
    has_real_fetch = "id=eq." in c[c.index("function openPostModal"):c.index("function openPostModal")+200] if "function openPostModal" in c else False
    print(fp.split('/')[-1] + ': {'+str(ob)+'}={'+str(cb)+'} ('+str(op)+')='+str(cp)+' ' + ok)
    print('  modal:', has_modal, '| uses API fetch:', has_real_fetch)
