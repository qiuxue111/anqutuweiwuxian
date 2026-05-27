c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
idx = c.index('function closePostModal')
print(c[idx:idx+500])
