files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix: in renderMapComments, the delete button onclick needs proper quoting
    # Current bad: deleteMapComment(c.id,'mcList')
    # Problem: 'mcList' terminates the outer JS string
    # Fix: use escaped double quotes inside the HTML attribute
    c = c.replace(
        "deleteMapComment(c.id,'mcList')",
        "deleteMapComment(c.id,'mcList')".replace("'mcList'", "&quot;mcList&quot;")
    )
    
    # For the pin comment delete button, also check
    c = c.replace(
        "deletePinComment(c.id,curPinIdx)",
        "deletePinComment(c.id,curPinIdx)"
    )  # already ok, no string param
    
    open(fp, 'w', encoding='utf8').write(c)
    
# Check the actual rendered code
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    for s in ['deleteMapComment', 'deletePinComment']:
        idx = c.find(s)
        if idx >= 0:
            print(f'{fp.split("/")[-1]} {s}: {c[idx-5:c[idx:idx+100].find(";")+idx+5] if c[idx:idx+100].find(";")>0 else c[idx:idx+100]}')
