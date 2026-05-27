import re
files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms)
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    is_card_click = 'onclick=\"openPostModal(' in c[c.index("post-card"):c.index("post-card")+100] if "post-card" in c else False
    has_h1 = 'cursor:pointer' in c[c.index("post-card"):c.index("||'无标题'")] if "post-card" in c else False
    print(fp.split('/')[-1] + ': {'+str(ob)+'}={'+str(cb)+'} ('+str(op)+')='+str(cp)+' ' + ok)
    print('  card clickable:', is_card_click)
