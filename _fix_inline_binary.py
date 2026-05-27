import re

with open("F:/暗区突围网站/pages/review.html", "rb") as f:
    data = f.read()

# The pattern we want to find: +\\") at the end of onclick
# In bytes that's: 2b 5c 27 29
# + \\ ' )
target = b"+\\')"
replace = b"+\\',\\\"+(p.map_name||\\\"\\\")+\\')"

print(f"target present: {target in data}")
data = data.replace(target, replace)

with open("F:/暗区突围网站/pages/review.html", "wb") as f:
    f.write(data)

print(f"occurrences: {data.count(replace)}")

# Verify
c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c.count("map_name")
print(f"map_name in file: {cnt}")
