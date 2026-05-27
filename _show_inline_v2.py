import re
c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
# The inline onclick in the meta/coord section - find those
for m in re.finditer(r"onclick='viewOnMap\(", c):
    start = m.start()
    # find the closing )
    i = m.end()
    depth = 1
    while depth > 0 and i < len(c):
        if c[i] == '(': depth += 1
        elif c[i] == ')': depth -= 1
        i += 1
    print(f"Position {start}, length {i-start}: {repr(c[start:i])}")
