c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Check if there's any category filter in loadPosts
import re
for m in re.finditer(r"map_posts[^']*order", c):
    st = max(0, m.start()-100)
    en = min(len(c), m.end()+100)
    print(f"Filter: {c[st:en]}")

# Also check postForm submit - does it set category?
if "postCategory" in c:
    idx = c.index("postCategory")
    print(f"\nCategory in form: {c[idx:idx+200]}")
