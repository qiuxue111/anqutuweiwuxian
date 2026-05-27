with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

idx = c.find("data-map-name")
# Go back ~200 chars to find statement start
start = idx - 200
# Make sure we have a valid statement start
starts = [c.rfind(x, start, idx) for x in ["html+=", "+="]]
valid = [s for s in starts if s >= 0]
start = max(valid) if valid else idx - 50

# Go forward enough
end = c.find("style=", idx) + 80
print(repr(c[start:end]))
