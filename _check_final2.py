import re
files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms)
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_comments = 'loadComments' in c
    has_delete_post = 'deletePost' in c
    has_delete_comment = 'deleteComment' in c
    has_add_comment = 'addComment' in c
    print(fp.split('/')[-1] + ': {'+str(ob)+'}={'+str(cb)+'} ('+str(op)+')='+str(cp)+' ' + ok)
    print('  comments:', has_comments, 'delPost:', has_delete_post, 'delComment:', has_delete_comment, 'addComment:', has_add_comment)
