files = ['F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html','F:/暗区突围网站/pages/weapons.html']
old = "author:author, images:images.length?JSON.stringify(images):null"
# Fix: only add images key if there are images
# Remove images key entirely when no images, since table may not have images column yet
# Best: always include images key but make it null-string when empty
# Actually the issue is: user said "Could not find the 'images' column" - table lacks the column.
# Until user adds the column, don't send images at all.
new = "author:author" + (" " if ' ' in old[len('author:author,'):len('author:author, ')] else "") + " + (images.length ? ', images:\"' + JSON.stringify(images).replace(/\"/g,\"'\") + '\"' : '')"

# Simpler approach: send images as null when empty
# The real fix is: add images column to the table
# But for now, just remove images key entirely when no images
new2 = "author:author" + (", images:images.length?JSON.stringify(images):null".replace(", images:images.length?JSON.stringify(images):null", ""))

# Actually let me just check what's the right approach:
# 1) When no images: body = {title, content, category, author}  (no images key)
# 2) When has images: body = {title, content, category, author, images: JSON.stringify(images)}
# Best: use a conditional body

for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    old = "author:author, images:images.length?JSON.stringify(images):null"
    new = "author:author"
    if old in c:
        c = c.replace(old, new)
        open(fp,'w',encoding='utf8').write(c)
        print(fp.split('/')[-1] + ': removed images from post body')
    else:
        print(fp.split('/')[-1] + ': pattern not found')
