import re
files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms)
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_inline_script = '<script>loadComments' in c and '<' + '/script>' in c
    has_post_render = 'posts.forEach' in c
    print(fp.split('/')[-1] + ': {'+str(ob)+'}={'+str(cb)+'} ('+str(op)+')='+str(cp)+' ' + ok)
    print('  inline script:', has_inline_script, '| post-render load:', has_post_render)
