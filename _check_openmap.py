c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

# Find the mapName to page mapping function
idx = c.find("openMapWithParams")
if idx < 0:
    idx = c.find("window.open(\"map-farm.html")
print(f"Found at {idx}: {c[idx:idx+200]}")
