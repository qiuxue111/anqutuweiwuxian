files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
    'F:/暗区突围网站/pages/maps.html',
    'F:/暗区突围网站/index.html'
]
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    has_post_form = 'postForm' in c
    has_submit = 'submitPost' in c
    has_list = 'postList' in c
    has_db_func = 'function db(' in c
    has_load = 'loadPosts' in c
    print(fp.split('/')[-1] + ':')
    print('  postForm='+str(has_post_form)+' submitPost='+str(has_submit)+' postList='+str(has_list))
    print('  db()='+str(has_db_func)+' loadPosts='+str(has_load))
