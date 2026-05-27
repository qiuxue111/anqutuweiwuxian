c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
st = c.index("'<div class=\"post-comments\"")
# Find the end of the card template
end = c.index(";", st)
# Extend to include the </script> injection
# Actually find the closing
print(c[st:st+500])
print("=== FOUND ===")
# Check if there's a stray <script> tag in the template
if '<script>' in c[st:st+500]:
    print("!! INLINE SCRIPT TAG FOUND !!")

# Show the exact line
lines = c[:st].count('\n') + 1
print(f"Line {lines}")
