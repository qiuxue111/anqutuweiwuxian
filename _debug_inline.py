import re
c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
for m in re.finditer(r"replace\(/'/g,\"&#39;\"\)", c):
    print(f"Found at {m.start()}: {repr(c[m.start():m.start()+80])}")
