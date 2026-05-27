with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

import re

# REMOVE all broken data-map-name attributes from html strings
# Pattern:  spaces + data-map-name=\'\\"+(p.map_name||\\"\\")+\\"\'
# After the removal from _fix_review_v9, it became:
# Pattern:  data-map-name=\'\\+(p.map_name||"")+\\\'

# Find ALL positions where this broken attr exists
positions = []
for m in list(re.finditer("data-map-name", c)):
    start = m.start()
    # make sure it's in an html string context (inside +="...)
    context_before = c[max(0,start-20):start]
    if "(" in c[start:start+30]:  # has the broken pattern
        # Find the attribute start (space before data-map-name)
        attr_start = c.rfind(" ", start-5, start)
        if attr_start < 0:
            attr_start = start
        # Find where the attribute value ends: look for ' style= or just ' then space
        style_idx = c.find(" style", start)
        if style_idx > 0:
            positions.append((attr_start, style_idx))

print(f"Found {len(positions)} broken attrs to remove")

# Remove from back to front
for attr_start, style_idx in sorted(positions, reverse=True):
    attr_text = c[attr_start:style_idx]
    print(f"  Remove: {repr(attr_text[:80])}...")
    c = c[:attr_start] + c[style_idx:]

# Now add data storage
old_promise = "Promise.all([p,d,pin]).then(function(res){"
new_promise = "Promise.all([p,d,pin]).then(function(res){window.__reviewPending=res[0];window.__reviewDels=res[1];"
c = c.replace(old_promise, new_promise)

# Add post-processing after innerHTML assignments
old_inner = 'document.getElementById("list").innerHTML=html;'
new_inner = """document.getElementById("list").innerHTML=html;
  setTimeout(function(){
    var __cards=document.querySelectorAll('.view-on-map-btn');
    var __data=window.__reviewPending||window.__reviewDels||[];
    __cards.forEach(function(btn,i){
      if(__data[i])btn.dataset.mapName=__data[i].map_name||'';
    });
  },0);"""

c = c.replace(old_inner, new_inner)

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt_broken = c2.count('(p.map_name||')
cnt_dmn = c2.count('data-map-name')
open_b = c2.count("{")
close_b = c2.count("}")
print(f"\nBroken attrs: {cnt_broken}")
print(f"data-map-name: {cnt_dmn}")
print(f"Braces: {open_b} {{ {close_b} }} (diff={open_b-close_b})")
print(f"Parens: {c2.count('(')} ( {c2.count(')')} )")
print(f"__reviewPending: {c2.count('__reviewPending')}")
print(f"dataset.mapName: {c2.count('dataset.mapName')}")
