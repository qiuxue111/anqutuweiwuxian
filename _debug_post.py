c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
st = c.index('id="postList"')
print(c[st-100:st+200])
