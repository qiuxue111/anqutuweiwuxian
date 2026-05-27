c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
# Just show the loadPosts function
st = c.index("function loadPosts")
end = c.index("function esc(", st)
extract = c[st:end]
# Find "post-card" in loadPosts
idx = extract.index("post-card")
print(extract[idx-50:idx+200])
