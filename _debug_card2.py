c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
# Find the JS template string with post-card
st = c.index("post-card", c.index(">'+esc(p.title||")
print(c[st-10:st+200])
