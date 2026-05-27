files = ["map-farm", "map-airport", "map-armory", "map-beishan", "map-tvstation", "map-valley"]
for f in files:
    with open(f"F:/暗区突围网站/pages/{f}.html", "r", encoding="utf8") as fh:
        c = fh.read()
    has_cn = "mapNameCN" in c
    has_eng = "mapNameEng" in c
    has_pending = "pending_pins" in c
    print(f"{f}: CN={has_cn} ENG={has_eng} pending={has_pending}")
