with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

old = 'mapPage=mapFiles[mapPage]||mapFiles[mapName]||"map-farm"'
new = 'if(mapPage.indexOf("map-")!==0){mapPage=mapFiles[mapPage]||"map-farm"}'

if old in c:
    c = c.replace(old, new)
    with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
        f.write(c)
    print("Replaced OK")
else:
    print("Pattern not found")
    # Show what's actually there
    idx = c.find("mapFiles[mapPage]")
    print(c[idx-20:idx+60])
