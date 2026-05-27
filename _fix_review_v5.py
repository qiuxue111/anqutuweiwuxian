import re

with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# Pattern: data-ic='"+(p.ic||"").replace(/\'/g,"&#39;")+"' style='cursor:pointer
# Insert data-map-name after the data-ic value
old = """+'\\' style='cursor:pointer"""
new = """+'\\' data-map-name='""+(p.map_name||"")+"'\\' style='cursor:pointer"""

# Only do both occurrences (renderList + renderDels) but distinguish p vs a
# First replace for p.ic (renderList)
old_p = """+(p.ic||"").replace(/\\'/g,"&#39;")+""" + old
new_p = """+(p.ic||"").replace(/\\'/g,"&#39;")+""" + new
c = c.replace(old_p, new_p)
print(f"renderList: {'OK' if old_p in c else 'Not found after replace'}")

# Actually need to check if it was already replaced
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
if c2 == c:
    # Wasn't found, try without replace
    old_p2 = """+(p.ic||"")+""" + old
    new_p2 = """+(p.ic||"")+""" + new
    if old_p2 in c:
        c = c.replace(old_p2, new_p2)
        print(f"renderList (no replace): OK")
    else:
        print(f"renderList: pattern not found")
        # Show what's actually there
        idx = c.find("data-ic='")
        print(f"   at {idx}: {repr(c[idx:idx+80])}")

# For a.ic (renderDels)
old_a = """+(a.ic||"").replace(/\\'/g,"&#39;")+""" + old
new_a = """+(a.ic||"").replace(/\\'/g,"&#39;")+""" + new
c = c.replace(old_a, new_a)

# Also fix the click handler to extract mapName
# Find the click listener
for term in ['view-on-map-btn`).forEach', "view-on-map-btn').forEach"]:
    if term in c:
        print(f"Click listener pattern found: {term}")
        break

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c3 = f.read()
cnt = c3.count("data-map-name")
print(f"\ndata-map-name occurrences: {cnt}")
