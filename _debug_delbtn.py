c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
idx = c.index("delBtn")
print(c[idx-10:idx+250])
