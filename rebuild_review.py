import re

fp = 'F:\\暗区突围网站\\pages\\review.html'
with open(fp, 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Favicon
c = c.replace('<head>', '<head>\n  <link rel="icon" href="../favicon.ico" type="image/jpeg">')

# 2. Fix auth header
c = c.replace(
    '"Authorization":"Bearer "+SUPABASE_ANON_KEY,',
    '"Authorization":"Bearer "+token,'
)

# 3. Fix supabase() HTTP check
c = c.replace(
    'return r.json().catch(function(){return [];});',
    'if(!r.ok){throw new Error("HTTP "+r.status+" for "+t);}\n  return r.json().catch(function(){return [];});'
)

# 4. Fix loginGit redirect
c = c.replace(
    'window.location.href=SUPABASE_URL+"/auth/v1/authorize?provider=github&redirect_to="+window.location.href',
    'window.location.href=SUPABASE_URL+"/auth/v1/authorize?provider=github&redirect_to="+encodeURIComponent(window.location.origin+window.location.pathname)'
)

# 5. Replace viewOnMap: keep the function, also add dataset-based click listener 
# (the inline onclick only passes x,y, not name/type/ic - fix that)
# First add a wrapper so the coord onclick also passes full data
old_coord_onclick = "onclick='viewOnMap(\"+p.x+\",\"+p.y+\")'"
new_coord_onclick = "onclick='viewOnMap(\"+p.x+\",\"+p.y+\",\\\"\"+encodeURIComponent(p.name||\"\").replace(/'/g,\"\\\\u0027\")+\"\\\",\\\"\"+(p.type||\"\")+\"\\\",\\\"\"+encodeURIComponent(p.ic||\"\").replace(/'/g,\"\\\\u0027\")+\"\\\")'"
c = c.replace(old_coord_onclick, new_coord_onclick)

# Also replace the second occurrence (different whitespace context)
# Actually there are 2 inline onclicks, the second one has same pattern

# Add "在地图上查看位置" button after coord span
# Find the coord span and add button after it
old_coord_span = "class='meta'>坐标: <span class='coord'"
# Actually just add a vmBtn in the render function
# Let me find where vmBtn would be added - check if there's already a renderPending that creates cards
m = re.search(r'function renderPending\(\)', c)
if m:
    print('renderPending found at', m.start())
    # Add a "view on map" button in the card
    # Find where meta div ends and add button
    old_card_end = "card.appendChild(delBtn);\n\n    list.appendChild(card)"
    new_card_end = "card.appendChild(delBtn);\n\n    var vmBtn=document.createElement(\"button\");\n    vmBtn.className=\"vm-btn\";\n    vmBtn.textContent=\"\\uD83D\\uDCCD \\u5728\\u5730\\u56FE\\u4E0A\\u67E5\\u770B\\u4F4D\\u7F6E\";\n    vmBtn.onclick=function(idx2){return function(){viewOnMap(pinsCopy[idx2].x,pinsCopy[idx2].y,pinsCopy[idx2].name,pinsCopy[idx2].type,pinsCopy[idx2].ic);};}(idx);\n    card.appendChild(vmBtn);\n\n    list.appendChild(card)"
    if old_card_end in c:
        c = c.replace(old_card_end, new_card_end)
        print('Added vmBtn to renderPending')
    else:
        print('old_card_end not found')
else:
    print('renderPending not found')

# Check for renderPublic/renderAll similarly
for func_name in ['renderPublic', 'renderAll', 'renderVoted']:
    m = re.search(r'function ' + func_name + r'\(\)', c)
    if m:
        print(f'{func_name} found')
        # Add vmBtn pattern before list.appendChild(card)
        old_end = "list.appendChild(card)"
        new_end = "    var vmBtn=document.createElement(\"button\");\n    vmBtn.className=\"vm-btn\";\n    vmBtn.textContent=\"\\uD83D\\uDCCD \\u5728\\u5730\\u56FE\\u4E0A\\u67E5\\u770B\\u4F4D\\u7F6E\";\n    vmBtn.setAttribute(\"data-view-map\",\"\");\n    vmBtn.setAttribute(\"data-x\",p.x);\n    vmBtn.setAttribute(\"data-y\",p.y);\n    vmBtn.setAttribute(\"data-name\",(p.name||\"\").replace(/'/g,\"\\\\u0027\").replace(/\"/g,\"\\\\u0022\"));\n    vmBtn.setAttribute(\"data-type\",p.type||\"\");\n    vmBtn.setAttribute(\"data-ic\",(p.ic||\"\").replace(/'/g,\"\\\\u0027\").replace(/\"/g,\"\\\\u0022\"));\n    card.appendChild(vmBtn);\n\n    list.appendChild(card)"
        c = c.replace(old_end, new_end)
        print(f'Added data-view-map to {func_name}')

# Verify
m = re.search(r'<script>([\s\S]*?)</script>', c)
if m:
    s = m.group(1)
    print(f'Script braces: open={s.count("{")} close={s.count("}")}')
    print(f'Script parens: open={s.count("(")} close={s.count(")")}')

# Write with LF line endings
with open(fp, 'w', encoding='utf-8', newline='\n') as f:
    f.write(c)
print('Written OK')
print('Favicon:', '<link rel="icon"' in c)
print('Token:', '"Authorization":"Bearer "+token,' in c)
print('HTTP check:', 'if(!r.ok)' in c)
print('loginGit:', 'encodeURIComponent' in c)
print('viewOnMap in onclick:', c.count("onclick='viewOnMap("))
print('data-view-map:', c.count('data-view-map'))
print('vmBtn:', c.count('vmBtn'))
