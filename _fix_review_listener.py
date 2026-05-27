with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# Update the click handler for view-on-map-btn
# Find: document.querySelectorAll('.view-on-map-btn').forEach(function(el){
# And add mapName extraction
if "view-on-map-btn\\" in c:
    # Use backtick style
    c = c.replace(
        "view-on-map-btn`).forEach(function(el){",
        "view-on-map-btn`).forEach(function(el){var mapName=el.dataset.mapName||'';"
    )
    print("Fixed backtick listener")
elif ".view-on-map-btn').forEach" in c or '.view-on-map-btn").forEach' in c:
    for q in ["'", "\""]:
        pat = f".view-on-map-btn{q}).forEach(function(el)"
        if pat in c:
            c = c.replace(
                pat,
                f".view-on-map-btn{q}).forEach(function(el){{var mapName=el.dataset.mapName||'';"
            )
            print(f"Fixed listener with {q}")

# Also add data-map-name for the deletion request items
# Check if they use a.ic pattern
if "a.ic" in c:
    # Find deletion render function
    idx = c.find("function renderDels")
    if idx >= 0:
        sub = c[idx:idx+3000]
        if "data-ic" in sub and "data-map-name" not in sub:
            print("renderDels needs data-map-name too")
            # Find the button in renderDels
            for m in ["data-ic='\"+(a.ic||\"\")", "data-ic='\"+(a.ic||\"\")"]:
                pass

# Now update the viewOnMap calls to pass mapName
old = "viewOnMap(x,y,name,type,ic);"
new = "viewOnMap(x,y,name,type,ic,mapName);"
if old in c:
    c = c.replace(old, new)
    print("Updated viewOnMap calls")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

print("Done")
