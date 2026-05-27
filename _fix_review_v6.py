import re

with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The actual pattern in the file: data-ic=\'"+(p.ic||"")+"\' style=\'cursor
# We need to insert data-map-name between \' and style= 
# Use regex: (data-ic=...)\\' style
pattern = r"(data-ic='\"\+\(p\.ic\|\|[\"\"][\"\"]\)\+[\"\'])\\' style"
replacement = r"\1 data-map-name='\"+(p.map_name||\"\")+\"'\\' style"
c = re.sub(pattern, replacement, c)

# Also for deletion requests (a.ic)
pattern2 = r"(data-ic='\"\+\(a\.ic\|\|[\"\"][\"\"]\)\+[\"\'])\\' style"
replacement2 = r"\1 data-map-name='\"+(a.map_name||\"\")+\"'\\' style"
c = re.sub(pattern2, replacement2, c)

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

cnt = c.count("data-map-name")
print(f"data-map-name occurrences: {cnt}")
