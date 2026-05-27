with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The current bug: data-map-name=\'\\"+(p.map_name||\\"\\")+\\"'
# The \\" inside `\\"+(p.map_name||\\"\\")+\\"` becomes `'"+(p.map_name||"")+"'` literally
# We need it to be JS-evaluated: `'` + map_name + `'`
# 
# In a single-quoted JS string (innerHTML), we can use:
#   data-map-name=\'+(p.map_name||"")+\'
# No escaped double quotes needed, just single-quote wrapped JS variables

old_path = r"data-map-name=\'\"+(p.map_name||\"\")+\"\'"
new_path = "data-map-name=\\'+(p.map_name||\"\")+\\'"

print(f"Old present: {old_path in c}")
if old_path in c:
    c = c.replace(old_path, new_path)
    with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
        f.write(c)
    print("Fixed")
else:
    # More direct approach - let me just find and replace the exact bytes
    # In the file the pattern is literally: data-map-name=\'"+(p.map_name||"")+"\'
    import re
    # Match data-map-name='\"+(p.map_name||\"\")+\"'
    pattern = r"data-map-name=\\'\"\+\(p\.map_name\|\|\"\"\)\+\"'"
    matches = list(re.finditer(pattern, c))
    print(f"Regex found {len(matches)} matches")
    if matches:
        c = re.sub(pattern, "data-map-name=\\'+(p.map_name||\"\")+\\'", c)
        with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
            f.write(c)
        print("Fixed via regex")

# Verify
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
idx = c2.find("data-map-name")
if idx >= 0:
    print(f"After: {repr(c2[idx:idx+50])}")
