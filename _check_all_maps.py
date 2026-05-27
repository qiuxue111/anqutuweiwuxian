import re
files = {
    "map-farm.html": "农场",
    "map-beishan.html": "北山",
    "map-valley.html": "山谷",
    "map-armory.html": "军械库",
    "map-tvstation.html": "电视台",
    "map-airport.html": "阿贾克斯港口"
}

# Check viewOnMap mapping in review.html
with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    review = f.read()

review_mapping = re.search(r"var mapFiles=\{([^}]+)\}", review)
print(f"viewOnMap映射表:\n{review_mapping.group(0)}\n")

# Check every map page's mapNameCN
all_ok = True
for fname, expected_name in files.items():
    with open(f"F:/暗区突围网站/pages/{fname}", "r", encoding="utf8") as f:
        c = f.read()
    m = re.search(r"mapNameCN='([^']+)'", c)
    m2 = re.search(r"mapNameEng='([^']+)'", c)
    if m and m2:
        actual_cn = m.group(1)
        actual_eng = m2.group(1)
        match = "✅" if actual_cn == expected_name else "❌"
        if not match == "✅":
            all_ok = False
        print(f"{fname}: {match} CN='{actual_cn}' (应={expected_name}) ENG='{actual_eng}'")
    else:
        print(f"{fname}: ❌ 找不到 mapNameCN/Eng")
        all_ok = False

print(f"\n所有地图名一致: {all_ok}")
