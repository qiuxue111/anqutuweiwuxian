c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Find image rendering code in loadPosts
idx = c.index("imgHTML=")
print(c[idx:idx+350])
