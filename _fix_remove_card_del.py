files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Remove the delete button from the card template
    # Find: var delBtn=... and the line after
    old_line = "var delBtn=(token&&p.author===getUserName())?'<button style=\"padding:2px 8px;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;\" onclick=\"deletePost(\'+pId+\')\">删除</button>\":'';"
    new_line = "var delBtn='';"
    c = c.replace(old_line, new_line)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: removed card delete button")

# Also remove the deletePost function from the script (no longer needed on card)
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    # Find and remove deletePost function
    if "function deletePost(postId)" in c:
        st = c.index("function deletePost(postId)")
        # Find the next function or the end of this function
        # Look for the first function after it or the end
        rest = c[st+1:]
        next_fn = rest.find("\nfunction ")
        next_async = rest.find("\nasync function ")
        if next_async > 0 and (next_fn < 0 or next_async < next_fn):
            next_fn = next_async
        if next_fn > 0:
            en = st + 1 + next_fn
            old_fn = c[st:en]
            c = c.replace(old_fn, '')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: removed deletePost function")

print('DONE')
