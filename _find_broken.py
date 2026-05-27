with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# renderList has 16 { and 17 } -> needs one more { or remove one }
# Let me check if the last function in it closes properly
# The issue is likely that removing data-map-name went too far

# Let me just find the exact issue by looking at where renderList's
# innerHTML assignment is and what came before/after

idx = c.find("document.getElementById(\"list\").innerHTML=html;")
print(f"At {idx}")
print(repr(c[idx-50:idx+200]))
