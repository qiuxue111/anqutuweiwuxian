with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# Fix the data-map-name rendering in both renderList and renderDels
# Current (in file): data-map-name=\'\\"+(p.map_name||\\"\\")+\\"\'
# The \\" is literal \" which in JS is " (quoting problem)
# Need: data-map-name=\'+(p.map_name||"")+\'\'

# Find and fix in renderList
old1 = "data-map-name=\'\\\\\"+(p.map_name||\\\\\"\\\\\")+\\\\\"\'"
new1 = "data-map-name=\'+(p.map_name||\"\")+\'\'"

if old1 in c:
    c = c.replace(old1, new1)
    print("renderList fixed")
else:
    print("renderList old pattern not found, trying alternative...")
    # Let's look at what's actually there
    idx = c.find("data-map-name")
    if idx >= 0:
        print(f"  actual: {repr(c[idx:idx+50])}")

# Same for renderDels - it uses the same pattern
old2 = old1
if old2 in c:
    c = c.replace(old2, new2)
    print("renderDels fixed")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
idx = c2.find("data-map-name")
if idx >= 0:
    print(f"After fix: {repr(c2[idx:idx+40])}")
