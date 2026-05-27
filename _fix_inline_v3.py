with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The actual ending is: +\\")
# In the file it's literally: +\\' 
# Where \\' is a backslash-escaped single quote for the onclick attribute

# Looking at the repr: '+\\'
# Actual chars: + \ '
# That means JS code: +\\'+ which becomes +\\' in the rendered HTML

# We want to change: +\\')  
# To: +\\',\\\\"+(p.map_name||\"\")+\")'

# But let's be simple - the onclick ends with +\\')
# We replace the \\' with \\',\\\\"+(p.map_name||\"\")+\\\\')

# Match: +\\')
old = "+\\\\\')"
# Replace: +\\\\\',\\\\\\"+(p.map_name||\"\")+\\\\\')"
new = "+\\\\\',\\\\\"+(p.map_name||\\"\\")+\\\\\')"

# This is getting nowhere with quoting. Let me use hex or raw approach
# The literal in file is: +\\') - 5 characters
# Check if present
target = "+\\')"
replacement = "+\\',\\\"+(p.map_name||\"\")+\\')"

if target in c:
    c = c.replace(target, replacement)
    print("Replaced via literal")
else:
    print(f"Not found: {repr(target)} in file")
    # Try the exact bytes
    idx = c.find("+\\'")
    if idx >= 0:
        print(f"Found +\\' at {idx}: {c[idx:idx+10]}")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)
