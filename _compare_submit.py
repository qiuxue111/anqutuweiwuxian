with open("F:/暗区突围网站/pages/map-tvstation.html", "r", encoding="utf8") as f:
    tv = f.read()
with open("F:/暗区突围网站/pages/map-beishan.html", "r", encoding="utf8") as f:
    bs = f.read()

# Find the submit function in tv
tv_idx = tv.find("pending_pins")
bs_idx = bs.find("pending_pins")

# Compare the code around pending_pins
tv_code = tv[max(0,tv_idx-200):tv_idx+300]
bs_code = bs[max(0,bs_idx-200):bs_idx+300]

print("=== TV ===")
print(tv_code)
print("\n=== 北山 ===")
print(bs_code)
