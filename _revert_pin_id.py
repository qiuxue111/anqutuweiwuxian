files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

old = ",pin_id:pins[curPinIdx].id"
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    c = c.replace(old, "")
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: reverted pin_id")
