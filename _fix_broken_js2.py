with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The broken part is: data-map-name=\'\\+(p.map_name||"")+\\\'
# Need to completely remove this attribute from the html string in both places.
# The attribute starts with " data-map-name=" and ends just before " style="
# I need to remove:  data-map-name=\'\\+(p.map_name||"")+\\\'

# Use exact string matching. The file has specific bytes.
# Let me find the EXACT attribute text in the file

import re

# Find all occurrences of the broken attribute
# The attribute is: data-map-name=\'\\+(p.map_name||"")+\\\'
# In raw bytes around that area

count = 0
while True:
    idx = c.find('data-map-name')
    if idx < 0:
        break
    
    # Find the ' before this attribute (it's the HTML attribute delimiter)
    # But also find where it ends (the space before ' style= or just ' style=)
    end_idx = c.find(" style=", idx)
    if end_idx < 0:
        print(f"Can't find end for match at {idx}")
        break
    
    # The attribute starts with a space before data-map-name or a quote
    # Find the start: look for the ' that ends the previous attribute
    start_idx = c.rfind(" ", idx-5, idx)
    if start_idx < 0:
        start_idx = c.rfind("'", idx-5, idx)
        if start_idx < 0:
            start_idx = idx
    
    # The full attribute to remove: from start_idx to end_idx
    # start_idx is the space before data-map-name
    attr_text = c[start_idx:end_idx]
    print(f"Attribute to remove: {repr(attr_text)} at {start_idx}-{end_idx}")
    
    # Remove it
    c = c[:start_idx] + c[end_idx:]
    count += 1
    print(f"Removed match {count}")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c2.count("data-map-name")
print(f"\nRemaining data-map-name: {cnt}")
open_cnt = c2.count('{')
close_cnt = c2.count('}')
print(f"Braces: {{ {open_cnt} }} {close_cnt}")
print(f"Parens: ( {c2.count('(')} ) {c2.count(')')}")
