import re
c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
for m in re.finditer(r"onclick='viewOnMap\(.*?\)", c):
    print(m.group()[:200])
    print("---")
