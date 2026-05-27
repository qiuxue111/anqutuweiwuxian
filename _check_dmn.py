with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

import re
for m in re.finditer("data-map-name", c):
    start = m.start()
    print(f"Found at {start}: {repr(c[start-5:start+60])}")
