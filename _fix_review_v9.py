with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    content = f.read()

# Based on repr output, the exact sequence at data-ic is:
# data-ic='"+(p.ic||"").replace(/'/g,"&#39;")+"\x27 style=\x27cursor
# Let me find the exact positions
idx = content.find("data-ic=")
segment = content[idx:idx+200]

# The pattern ends with +"\' style=\'cursor
# We want to insert before \' style
idx_of_style = segment.find(" style=") + idx
# But we need to find the actual closing pattern. Let's find the string around that area
# The JS code is: data-ic=\'"+(p.ic||"").replace(/\'/g,"&#39;")+"\' style=\'cursor...
# So after +"\' is the style

# Let me find ALL occurrences of this pattern and replace
import re
# The literal pattern in the file after data-ic= is:
# '"+(p.ic||"").replace(/'/g,"&#39;")+"' style='cursor...
# We need to add: data-map-name='"+(p.map_name||"")+"' 

# Find all matches
pattern = re.compile(r"(data-ic='\"\+\(p\.ic\|\|\"\"\)\.replace\(/'/g,\"&#39;\"\)\+\"' )style='cursor")

matches = list(pattern.finditer(content))
print(f"Found {len(matches)} renderList matches")

content = pattern.sub(r"\1data-map-name='\"+(p.map_name||\"\")+\"' style='cursor", content)

# Same for a.ic
pattern2 = re.compile(r"(data-ic='\"\+\(a\.ic\|\|\"\"\)\.replace\(/'/g,\"&#39;\"\)\+\"' )style='cursor")
matches2 = list(pattern2.finditer(content))
print(f"Found {len(matches2)} renderDels matches")

content = pattern2.sub(r"\1data-map-name='\"+(a.map_name||\"\")+\"' style='cursor", content)

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(content)

cnt = content.count("data-map-name")
print(f"data-map-name: {cnt}")
