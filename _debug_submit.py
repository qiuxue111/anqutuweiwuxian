c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Find submitPostModal
idx = c.index("async function submitPostModal")
# Show until the end of the function
rest = c[idx:]
# Find function end - look for next function declaration
next_fn = rest.find("\nfunction ", 100)
next_async = rest.find("\nasync function ", 100)
end_marker = min([pos for pos in [next_fn, next_async] if pos > 0])
print(rest[:end_marker])
