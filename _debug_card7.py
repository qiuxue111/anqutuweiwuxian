c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
idx = c.index("return '<div class=\"post-card\"")
print(c[idx:idx+200])
