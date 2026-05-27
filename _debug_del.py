c = open('F:/暗区突围网站/pages/weapons.html','r',encoding='utf8').read()
idx = c.index("async function deletePostFromModal")
# show next ~1500 chars
print(c[idx:idx+1500])
