with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# Find the exact broken attribute strings
# at 11671 and 15020
# Pattern: data-map-name=\'\\+(p.map_name||"")+\\\'
# The problem: " inside "" JS string -> syntax error
# We need to remove the whole attribute: leading space + attr + value until '

# Let me find each one precisely
import re
for m in list(re.finditer("data-map-name", c)):
    start = m.start()
    # Look at what's before it - should be space + single quote
    # Find the end: next style= or the closing > 
    style_idx = c.find(" style", start)
    if style_idx < 0:
        continue
    # The attribute value ends at the space before ' style=
    # The whole thing to remove: from the space before data-map-name to ' style (inclusive of the ')
    # Actually from: the space before data-map-name to style (exclusive)
    attr_start = c.rfind(" ", start-3, start)
    attr_text = c[attr_start:style_idx]
    
    # Check if this contains the broken pattern
    if "(p.map_name||" in attr_text:
        print(f"REMOVING at {attr_start}: {repr(attr_text)}")
        c = c[:attr_start] + c[style_idx:]

with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f2:
    c2 = f2.read()
# Wait I need to write first
with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c3 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c3.count("data-map-name")
open_b = c3.count("{")
close_b = c3.count("}")
print(f"\ndata-map-name attrs: {cnt}")
print(f"Braces: {open_b} {{ {close_b} }} (diff={open_b-close_b})")

# Check for syntax errors near the removed areas
if "(p.map_name||" in c3:
    print("WARNING: broken attr still present!")
else:
    print("OK: no broken attrs")
