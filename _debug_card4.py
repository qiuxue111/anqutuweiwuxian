c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
st = c.index("post-card", c.index("delBtn+"))
print(c[st-20:st+200])
