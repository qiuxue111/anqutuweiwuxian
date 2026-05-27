c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
idx = c.index("async function submitPostModal")
# Print 2000 chars
print(c[idx:idx+2000])
