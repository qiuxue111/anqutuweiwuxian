c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
for term in ["\\u5730\\u56fe", "map_name", "map-"]:
    idx = c.find(term)
    while idx >= 0:
        print(f'"{term}" at {idx}: {c[max(0,idx-30):idx+60]}')
        idx = c.find(term, idx+1)
