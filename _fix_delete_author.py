files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Add author filter to DELETE
    old_q = "db('DELETE','map_posts',null,'id=eq.'+currentModalPostId)"
    new_q = "db('DELETE','map_posts',null,'id=eq.'+currentModalPostId+'&author=eq.'+encodeURIComponent(getUserName()))"
    c = c.replace(old_q, new_q)
    
    # Also the old code that might have had no author filter
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
