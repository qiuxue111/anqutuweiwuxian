files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
import re

needs_async = [
    'loadPosts',
    'loadComments',
    'addComment',
    'deleteComment',
    'deletePost',
    'openPostModal',
    'addCommentFromModal',
    'deletePostFromModal',
    'deletePost',
    'submitPost',
    'fabOpenPostForm',
    'loadComments'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    for fn in needs_async:
        # Only add if function has await inside and doesn't already have async
        pattern = 'function ' + fn + '('
        async_pattern = 'async function ' + fn + '('
        if pattern in c and async_pattern not in c:
            # Check if this function actually has await
            st = c.index(pattern)
            chunk = c[st:st+300]
            if 'await' in chunk:
                c = c.replace(pattern, 'async function ' + fn + '(', 1)
                print(f"  {fp.split('/')[-1]}: fixed {fn}")
    
    open(fp, 'w', encoding='utf8').write(c)

print('ALL DONE')
