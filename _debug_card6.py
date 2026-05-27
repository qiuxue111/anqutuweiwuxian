c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
st = c.index("loadPosts")
# Find the template part
idx = st + 1000  # skip ahead to where the template likely is
sub = c[idx:idx+400]
print(repr(sub))
