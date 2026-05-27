import re
c = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()

# Fix inline onclick calls (2 places)
# Pattern: onclick='viewOnMap("+p.x+","+p.y+",\""+encodeURIComponent(p.name||"")+"\",\""+... 
# Need to add p.map_name

# Find the exact pattern
for m in re.finditer(r"onclick='viewOnMap\(", c):
    start = m.start()
    end = c.find(",", start)
    end = c.find(")", end+1)
    snippet = c[start:end+1]
    print(f"Found: {snippet[:100]}...")
    
    # Check if it already has mapName
    if 'map_name' not in snippet:
        # Need to add it
        # The pattern ends with ) - insert map_name before )
        if snippet.endswith(")") and c[end] == ")":
            # Add ,\""+(p.map_name||"")+"\" before the closing )
            new_end = end + len(",\""+(p.map_name||"")+"\"")
            old_close = c[end:end+1]
            # But we need to be careful - the onclick is a string
            # It's: onclick='viewOnMap("+p.x+","+p.y+","...
            # After the ic parameter there's a closing )
            # Let me find what comes before the )
            before = c[max(0,start-20):end+1]
            print(f"  context: {before}")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)
