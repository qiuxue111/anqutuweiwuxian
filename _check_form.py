import re
files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms)
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(fp.split('/')[-1] + ': {'+str(ob)+'}={'+str(cb)+'} ('+str(op)+')='+str(cp)+' ' + ok)
    has_preview = 'previewFiles' in c
    has_comment_img = 'previewCommentFiles' in c
    has_comment_images = 'comment_images' in c or 'cimgs' in c
    has_file_btn = 'file-btn' in c
    print('  previewFiles:', has_preview, '| commentImg:', has_comment_img, '| cimgs:', has_comment_images, '| fileBtn:', has_file_btn)
