with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# We need to fix the broken JS string in renderList
# The data-map-name line currently has: ...+"\' data-map-name=\'\\+(p.map_name||"")+\\\' style=...
# The unescaped " in " (p.map_name||"") inside a JS double-quoted string -> syntax error
#
# SIMPLEST FIX: remove the entire data-map-name HTML attribute
# It's added via JS post-processing anyway

# Find and replace the broken data-map-name in renderList
broken1 = "data-map-name=\\\'\\\\+(p.map_name||\\\"\\\")+\\\\\\\' "
safe1 = ""

# Actually, let me use the exact text. In the file the string is:
# +"\' data-map-name=\'\\+(p.map_name||"")+\\\' style=\'cursor
# The " after || is the problem in a double-quoted JS string

# Let me find it differently - strip out the entire data-map-name attr
import re

# Match the exact pattern
# data-map-name=\'\\+(p.map_name||"")+\\\' style=
# Where " in (p.map_name||"") breaks the JS

# Simple fix: replace the whole broken data-map-name with nothing
broken = r"data-map-name=\\'\\\\\+\(p\.map_name\|\|""\)\+\\\\\\' "
# Python regex can't handle the unescaped " properly in patterns

# OK, let me just use exact string replace.
# The char sequence in the file around data-map-name:
print("Checking for broken pattern...")

# Find the exact broken string by position
idx = c.find("data-map-name")
if idx >= 0:
    # Go backward to find the +" that starts the segment
    seg_start = c.rfind("+\"", idx-50, idx)
    if seg_start < 0:
        seg_start = idx - 20
    seg_end = c.find(" style=", idx) + 7
    broken_str = c[seg_start:seg_end]
    print(f"Broken segment: {repr(broken_str)}")
    
    # Remove data-map-name from this segment entirely
    # Keep everything before and after
    idx_before = idx - 1  # the ' before data-map-name
    idx_after = c.find(" style='", idx)
    attr_start = c.rfind(" ", 0, idx)  # find start of attribute
    if attr_start >= 0:
        # Remove the whole data-map-name attribute + its value
        before = c[idx_before]  # should be '
        clean = c[:attr_start+1] + c[idx_after:]
        print(f"Removed data-map-name from line")
        c = clean
    else:
        # Just remove the attr+value
        before_attr = c[idx-2:idx-1]  # space before data-map-name
        clean = c[:idx-1] + c[idx_after:]
        print(f"Removed data-map-name (alt method)")
        c = clean

# Now fix the same for renderDels
idx2 = c.find("data-map-name")
if idx2 >= 0:
    idx_after2 = c.find(" style='", idx2)
    clean2 = c[:idx2-1] + c[idx_after2:]
    c = clean2
    print("Removed second data-map-name")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Verify no more data-map-name in html strings
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
cnt = c2.count("data-map-name")
print(f"Remaining data-map-name: {cnt}")

# Verify braces
print(f"Braces: {{ {c2.count('{')} }} {c2.count('}')}")
print(f"Parens: ( {c2.count('(')} ) {c2.count(')')}")
