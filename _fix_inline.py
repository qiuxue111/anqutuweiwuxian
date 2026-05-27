with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The inline onclick ends with encodeURIComponent(p.ic||"").replace(/'/g,"\\u0027")+'")
# We need to add map_name before the last '")
# Find the ending pattern and add map_name

# Pattern 1 (line 10877): after .replace(/'/g,"\\u0027")+'") 
# but there might be more after that. Let me find the exact ending
# Looking at the output, it continues after .replace
# The full param sequence is: p.x, p.y, p.name, p.type, p.ic
# After p.ic it closes with )' 
# But .replace is applied to p.ic

# Simpler: replace the closing directly
# Find: +encodeURIComponent(p.ic||"").replace(/'/g,"\\u0027")+'")
# Replace with: +encodeURIComponent(p.ic||"").replace(/'/g,"\\u0027")+'",\\""+(p.map_name||"")+"'+'

old = """.replace(/'/g,"\\u0027")+\\)"""
# But this is inside onclick, the actual closing is: +'")
# After p.ic's encoding it returns to +'") which closes the function call

# Let me find the full line and replace
# The pattern after p.ic is: .replace(/'/g,"\\u0027")+'")
# We need to add: ,\\""+(p.map_name||"")+"' before the )

old1 = """.replace(/'/g,"\\u0027")+\\')"""
new1 = """.replace(/'/g,"\\u0027")+\\',\\""+(p.map_name||"")+"'+"')"""
if old1 in c:
    c = c.replace(old1, new1)
    print("Pattern 1 replaced")
else:
    # Try without the ending '
    old1b = """.replace(/'/g,"\\u0027")+'"""
    print(f"Pattern 1b found: {old1b in c}")

# Actually let me just show what's right after the closing )
idx = c.find("""+encodeURIComponent(p.ic||"").replace(/'/g,"\\u0027")+'""")
if idx >= 0:
    print(f"Found at {idx}")
    print(repr(c[idx:idx+80]))

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)
