c = open('F:/暗区突围网站/pages/gear.html', 'r', encoding='utf8').read()
# Fix: p.images could be null/undefined
# Change: var imgs = p.images ? JSON.parse(p.images) : [];
# To: var imgs = p.images ? (typeof p.images === 'string' ? JSON.parse(p.images) : []) : [];
old = "var imgs = p.images ? JSON.parse(p.images) : [];"
new = "var imgs = p.images && typeof p.images === 'string' ? JSON.parse(p.images) : [];"

if old in c and new not in c:
    c = c.replace(old, new)
    open('F:/暗区突围网站/pages/gear.html', 'w', encoding='utf8').write(c)
    print('gear fixed')
else:
    print('gear not changed: old='+str(old in c)+' new='+str(new in c))

# Also fix: don't send images key at all if no images
old2 = "author:author, images:images.length?JSON.stringify(images):null"
new2 = "author:author" + ("\n        " if "'\n        '" in c else "'\n      '")
# Simpler: remove images from body if empty
# Actually, the images column doesn't exist yet - need to fix that first
# But also add logic to not send images key at all if empty
