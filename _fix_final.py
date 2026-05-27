with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# Fix: remove all data-map-name HTML attributes from the html+= strings (they break JS syntax)
# Then add JS post-processing to set dataset.mapName from stored data

# Step 1: Remove data-map-name from renderList's html+= string
# Pattern: ... data-ic=...+\' data-map-name=...+ \' style=\'cursor...
# We need to find: data-map-name=\'\\"+(p.map_name||\\"\\")+\\"\'
# And remove it (including the leading space and the trailing ')

import re

# Use regex to find the exact attribute
# The pattern is:  data-map-name=\'\\"+(p.map_name||\\"\\")+\\"\'
# (with literal backslash-quote sequences)
pattern1 = r" data-map-name=\\'\\\"\+\(p\.map_name\|\|\\\"\\\"\)\+\\\"\\'"
pattern2 = r" data-map-name=\\'\\\\\"\+\(p\.map_name\|\|\\\\\"\\\\\"\)\+\\\\\"\\'"

for pat in [pattern1, pattern2]:
    cnt = len(re.findall(pat, c))
    if cnt > 0:
        c = re.sub(pat, "", c)
        print(f"Removed {cnt} data-map-name attrs via pattern: {pat[:30]}...")

# Step 2: Store review data when loadData completes
old_promise = "Promise.all([p,d,pin]).then(function(res){"
new_promise = "Promise.all([p,d,pin]).then(function(res){window.__reviewPending=res[0];window.__reviewDels=res[1];"
if old_promise in c:
    c = c.replace(old_promise, new_promise)
    print("Added data storage")

# Step 3: Add post-processing after renderList's innerHTML assignment
old_inner = 'document.getElementById("list").innerHTML=html;'
new_inner = """document.getElementById("list").innerHTML=html;
  setTimeout(function(){
    var __cards=document.querySelectorAll('.view-on-map-btn');
    var __data=window.__reviewPending||window.__reviewDels||[];
    __cards.forEach(function(btn,i){
      if(__data[i])btn.dataset.mapName=__data[i].map_name||'';
    });
  },0);"""

# Replace first occurrence (renderList) and second (renderDels)
# Both have the same innerHTML assignment, so we need different patterns
# renderList has close-card div before it, renderDels has actions div

# Actually they're identical - just replace both
# the post-processing queries ALL view-on-map-btn, so it works for both
# But we need both innerHTML assignments to trigger it

# Simpler: keep one replacement that handles both
c = c.replace(old_inner, new_inner, 1)  # Replace first occurrence only
# The second occurrence is in renderDels - need a slightly different approach
# Use a different post-processing that also works
old_inner2 = 'document.getElementById("list").innerHTML=html;'
# This will replace the second one since the first was already changed
new_inner2 = """document.getElementById("list").innerHTML=html;
  setTimeout(function(){
    var __cards=document.querySelectorAll('.view-on-map-btn');
    var __data=window.__reviewDels||window.__reviewPending||[];
    __cards.forEach(function(btn,i){
      if(__data[i])btn.dataset.mapName=__data[i].map_name||'';
    });
  },0);"""

# Check if we still have the old pattern
if old_inner2 in c:
    c = c.replace(old_inner2, new_inner2)
    print("Added renderDels post-processing")
else:
    print("First replacement already consumed both - using single handler")
    # The setTimeout post-processing already handles all buttons

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c2.count("data-map-name")
print(f"\ndata-map-name attrs: {cnt}")
open_b = c2.count('{')
close_b = c2.count('}')
open_p = c2.count('(')
close_p = c2.count(')')
print(f"Braces: {{ {open_b} }} {close_b} (diff={open_b-close_b})")
print(f"Parens: ( {open_p} ) {close_p} (diff={open_p-close_p})")

# Check for syntax error risk: unescaped " in double-quoted strings
# Look for the specific pattern we fixed
if "data-map-name" in c2:
    print(f"WARNING: data-map-name still present, may cause syntax error")
