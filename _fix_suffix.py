with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The suffix is: +\\') 
# Which is literally +\" )  (backslash, single-quote, parenthesis)
# Let me write this as a Python raw string for precision
suffix = '+\\")'
new_suffix = '+\\",\\"+(p.map_name||"")+\\")'

print(f"Suffix found: {suffix in c}")
if suffix in c:
    c = c.replace(suffix, new_suffix)
    with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
        f.write(c)
    
    # Verify
    c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
    cnt = c2.count("map_name")
    print(f"map_name count: {cnt}")
    print(f"New suffix in file: {suffix in c2}")
