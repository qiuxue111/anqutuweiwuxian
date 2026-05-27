c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

# Find and add data-map-name to BOTH renderList and renderDels
# Pattern 1: renderList button
old1 = "data-ic='\"+(p.ic||\"\")+\"' style='cursor:pointer;"
new1 = "data-ic='\"+(p.ic||\"\")+\"' data-map-name='\"+(p.map_name||\"\")+\"' style='cursor:pointer;"
c = c.replace(old1, new1)

# Pattern 2: renderDels button (for deletion requests)
old2 = "data-ic='\"+(a.ic||\"\")+\"' style='cursor:pointer;"
new2 = "data-ic='\"+(a.ic||\"\")+\"' data-map-name='\"+(a.map_name||\"\")+\"' style='cursor:pointer;"
c = c.replace(old2, new2)

# Also check the click listener
old3 = "view-on-map-btn`).forEach(function(el){"
new3 = "view-on-map-btn`).forEach(function(el){var mapName=el.dataset.mapName||'';"
c = c.replace(old3, new3)

# And the individual click handler if it already uses forEach
old4 = "var mapName=el.dataset.mapName||\"\";"
old4_no = "var mapName=el.dataset.mapName||'';"
if old4 in c or old4_no in c:
    print("Click handler already has mapName extraction")
    
# Make sure the click handler uses this mapName
old5 = "viewOnMap(x,y,name,type,ic);"
new5 = "viewOnMap(x,y,name,type,ic,mapName);"
if c.count(old5) > 0:
    c = c.replace(old5, new5)
    print(f"Replaced {c.count(old5)} instances of viewOnMap call")

open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8").write(c)
print("Done")

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt_mapname = c2.count('data-map-name=')
cnt_view = c2.count('viewOnMap(')
print(f"data-map-name occurrences: {cnt_mapname}")
print(f"viewOnMap calls: {cnt_view}")
