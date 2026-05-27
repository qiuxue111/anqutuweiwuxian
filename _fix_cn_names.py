with open("F:/暗区突围网站/pages/map-valley.html", "r", encoding="utf8") as f:
    c = f.read()
c = c.replace("mapNameCN='河谷'", "mapNameCN='山谷'")
with open("F:/暗区突围网站/pages/map-valley.html", "w", encoding="utf8") as f:
    f.write(c)
print("valley fixed")

with open("F:/暗区突围网站/pages/map-armory.html", "r", encoding="utf8") as f:
    c = f.read()
c = c.replace("mapNameCN='军港'", "mapNameCN='军械库'")
with open("F:/暗区突围网站/pages/map-armory.html", "w", encoding="utf8") as f:
    f.write(c)
print("armory fixed")
