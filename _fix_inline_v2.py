import re

with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The exact text in the file for the onclick ending:
# ... .replace(/\'/g,"\\\\u0027")+\\")
# The literal characters are: +\\") which is: + \" ) as JS string
# In Python repr it shows: +\\\\\\")
# Let me just use the exact repr substring

# The pattern ends with: ...encodeURIComponent(p.ic||"").replace(/'/g,"\\u0027")+\")
# We want: ...encodeURIComponent(p.ic||"").replace(/'/g,"\\u0027")+\",\\""+(p.map_name||"")+"')"

# In the file the last part is literally:
# +\\")
# Which Python shows as: +\\\\\\")
# In JS: +\" )

# Replace: +\\")  with  +\\",\\""+(p.map_name||"")+"')"
# But we need to match exactly what's in the file

old = """+\\")"""
new = """+\\",\\""+(p.map_name||"")+\\")"""

# Check
print(f"old present: {old in c}")
if old in c:
    c = c.replace(old, new)
    print("Replaced")
else:
    # Let's find the exact ending chars
    for m in re.finditer(r"encodeURIComponent\(p\.ic\|\|""\)", c):
        end = m.end()
        print(f"After ic encode at {end}: {repr(c[end:end+15])}")
        # Find the closing onclick
        close_idx = c.find("'", end)
        if close_idx > end:
            print(f"  closing quote at {close_idx}: {c[end:close_idx+1]}")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)
