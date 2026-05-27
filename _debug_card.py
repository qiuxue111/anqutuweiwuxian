c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
st = c.index("post-card")
print(c[st:st+300])
