c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()
# Find the supabase function and see the URL/key definitions
idx = c.index("function supabase")
# Show context before it
st = max(0, idx-200)
print(c[st:idx+100])
