c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
st = c.index('async function deletePostFromModal')
en = c.index('function closePostFormModal', st)
chunk = c[st:en]
idx = chunk.rfind("db('DELETE'")
print(chunk[idx:idx+200])
