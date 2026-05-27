with open("F:/暗区突围网站/pages/map-tvstation.html", "r", encoding="utf8") as f:
    tc = f.read()

# Find how map_name is set when submitting
idx = tc.find("pending_pins")
print(tc[max(0,idx-100):idx+300])
