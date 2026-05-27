import re

with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The file contains: data-ic='"+...+"' style
# The actual chars: data-ic=\' style  
# Let's just find the exact literal string and replace
# First find both occurrences
old = """data-ic='""+(p.ic||"")+\"'\\' style"""
new = """data-ic='""+(p.ic||"")+\"' data-map-name='""+(p.map_name||"")+"'\\' style"""

if old in c:
    c = c.replace(old, new)
    print("renderList: replaced")
else:
    print("renderList: not found")

old2 = """data-ic='""+(a.ic||"")+\"'\\' style"""
new2 = """data-ic='""+(a.ic||"")+\"' data-map-name='""+(a.map_name||"")+"'\\' style"""

if old2 in c:
    c = c.replace(old2, new2)
    print("renderDels: replaced")
else:
    print("renderDels: not found")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Also update the click handler
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c2.count("data-map-name")
print(f"data-map-name occurrences: {cnt}")

# Check what's after data-ic now
idx = c2.find("data-ic=")
print(f"First data-ic now: {c2[idx:idx+120]}")
