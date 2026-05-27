import re
files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_delete = "case 'DELETE'" in s or 'case "DELETE"' in s
    has_new_del = "await db('DELETE'" in s
    print(f"{fp.split('/')[-1]}: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok} | DELETEcase={has_delete} usesDB={has_new_del}")
