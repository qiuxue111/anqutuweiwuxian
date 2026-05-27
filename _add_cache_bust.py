files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Add unique version query param to script
    c = c.replace('</script>', '?_v=20260528-02</script>')
    # But don't break the script closing tag
    c = c.replace('</script', '></script')
    # Undo.. not good approach
    
    # Better: add meta cache-control
    meta = '<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n<meta http-equiv="Pragma" content="no-cache">\n<meta http-equiv="Expires" content="0">'
    c = c.replace('<meta charset="UTF-8">', '<meta charset="UTF-8">\n' + meta)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: added cache meta")
