import re

c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

# Find the full onclick pattern
# Each should have p.x, p.y, p.name, p.type, p.ic params
for m in re.finditer(r"onclick='viewOnMap\([^)]{50,200}\)", c):
    print(f"Length {m.end()-m.start()}:")
    print(m.group()[:250])
    print()
