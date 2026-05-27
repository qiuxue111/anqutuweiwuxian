c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
# Find the JS template string with post-card
# Look for the return line
st = c.index('"<div class=\\"post-card\\""')
print(c[st:st+250])
