c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Find loadPosts function
idx = c.index("function loadPosts")
print(c[idx:idx+800])
