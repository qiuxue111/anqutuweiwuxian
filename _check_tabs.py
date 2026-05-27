with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

idx = c.find('class="stats"')
print(c[idx-50:idx+500])
