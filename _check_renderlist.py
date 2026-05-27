with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

idx = c.find("function renderList")
next_fn = c.find("function ", idx + 20)
sub = c[idx:next_fn]
open_b = sub.count("{")
close_b = sub.count("}")
print(f"renderList: {{ {open_b} }} {close_b}  diff={open_b-close_b}")
print(f"Last 150: {repr(sub[-150:])}")
