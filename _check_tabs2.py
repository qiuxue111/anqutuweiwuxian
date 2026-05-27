with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

for tab in ["pending", "all", "voted"]:
    idx = c.find('"'+tab+'"')
    print(f"{tab}: at {idx}" if idx >= 0 else f"{tab}: not found")
