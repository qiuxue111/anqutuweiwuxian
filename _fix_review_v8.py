with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# Exact string from the file
old1 = """data-ic='""+(p.ic||"").replace(/'/g,"&#39;")+"' style"""
new1 = """data-ic='""+(p.ic||"").replace(/'/g,"&#39;")+"' data-map-name='""+(p.map_name||"")+"' style"""

old2 = """data-ic='""+(a.ic||"").replace(/'/g,"&#39;")+"' style"""
new2 = """data-ic='""+(a.ic||"").replace(/'/g,"&#39;")+"' data-map-name='""+(a.map_name||"")+"' style"""

print("looking for old1:", repr(old1[:40]))
found1 = old1 in c
found2 = old2 in c
print(f"renderList {old1 in c}, renderDels {old2 in c}")

if found1:
    c = c.replace(old1, new1)
if found2:
    c = c.replace(old2, new2)

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c2.count("data-map-name")
print(f"data-map-name: {cnt}")
