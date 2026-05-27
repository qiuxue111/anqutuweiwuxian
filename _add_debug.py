with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

old = 'viewOnMap(x,y,name,type,ic,mapName);'
new = "console.log('[viewOnMap] mapName:',mapName);\n    viewOnMap(x,y,name,type,ic,mapName);"
c = c.replace(old, new)

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

print("Done")
