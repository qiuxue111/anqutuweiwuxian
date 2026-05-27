c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()

# Find the loadPosts function and print the template string part
st = c.index("'<div class=\"post-comments\"")
# Get context
print(c[st-200:st+300])
