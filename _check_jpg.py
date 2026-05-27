files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    bad = re.findall(r"slice\(2,8\)\+'\.jpg[^')\w]", c)
    if bad:
        print(f"{fp.split('/')[-1]}: BROKEN patterns: {bad}")
    else:
        # Check: each .jpg should have a ' after it
        good = re.findall(r"slice\(2,8\)\+'\.jpg'", c)
        print(f"{fp.split('/')[-1]}: {len(good)} correct patterns")
