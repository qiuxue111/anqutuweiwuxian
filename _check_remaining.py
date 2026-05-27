with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

idx = c.find("data-map-name")
print(f"Remaining at {idx}")
print(repr(c[idx-10:idx+50]))
