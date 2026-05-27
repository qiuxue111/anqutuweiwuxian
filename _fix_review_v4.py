c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

# The actual JS uses \\' (escaped single quote)
old1 = """data-ic=\\'"+(p.ic||"")+\\" \\' style=\\'cursor:pointer"""
new1 = """data-ic=\\'"+(p.ic||"")+\\" data-map-name=\\'"+(p.map_name||"")+\\" \\' style=\\'cursor:pointer"""
c = c.replace(old1, new1)

old2 = """data-ic=\\'"+(a.ic||"")+\\" \\' style=\\'cursor:pointer"""
new2 = """data-ic=\\'"+(a.ic||"")+\\" data-map-name=\\'"+(a.map_name||"")+\\" \\' style=\\'cursor:pointer"""
c = c.replace(old2, new2)

open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8").write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c2.count('data-map-name')
print(f"data-map-name: {cnt}")
if cnt == 0:
    # Debug - show the actual pattern near the button
    idx = c2.find("cursor:pointer;display:inline-block")
    print(f"First button at {idx}")
    print(repr(c2[idx-80:idx+80]))
