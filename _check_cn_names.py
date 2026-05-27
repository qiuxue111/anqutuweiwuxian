import re

expected = {
    "map-farm": "农场",
    "map-beishan": "北山",
    "map-valley": "山谷",
    "map-armory": "军械库",
    "map-tvstation": "电视台",
    "map-airport": "阿贾克斯港口"
}

for f, expected_cn in expected.items():
    with open(f"F:/暗区突围网站/pages/{f}.html", "r", encoding="utf8") as fh:
        c = fh.read()
    
    m = re.search(r"mapNameCN='([^']+)'", c)
    if m:
        actual_cn = m.group(1)
        match = "✅" if actual_cn == expected_cn else "❌"
        print(f"{f}: {match} mapNameCN='{actual_cn}' (expected '{expected_cn}')")
