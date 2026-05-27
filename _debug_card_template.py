c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Find the post card template - the 'return' string building
idx = c.index("return '<div class=\"post-card\"")
# Show the full template up until the join
print(c[idx:idx+600])
