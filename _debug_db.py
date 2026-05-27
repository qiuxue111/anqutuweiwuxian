c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
idx = c.index("function db(")
print(c[idx:idx+1000])
