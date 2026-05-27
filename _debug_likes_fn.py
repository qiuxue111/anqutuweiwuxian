c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
idx = c.index("async function toggleLike")
print(c[idx:idx+600])
