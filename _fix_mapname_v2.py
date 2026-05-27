with open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8") as f:
    c = f.read()

# The file contains: data-map-name=\'"+(p.map_name||"")+"\'
# In Python repr: 'data-map-name=\\'\\"+(p.map_name||\\"\\")+\\"\\''
# 
# We want: data-map-name=\'+(p.map_name||"")+\'
# In Python repr: 'data-map-name=\\'+(p.map_name||"")+\\''
#
# Let me use the exact repr to find and construct

# Find data-map-name occurrences
import re
for m in re.finditer("data-map-name", c):
    start = m.start()
    end = start + 60
    s = c[start:end]
    print(f"Found: {repr(s)}")
    
    # If the pattern has the bug (extra \")
    if chr(92)+'"' in s and "+(p.map_name||\"\")" not in s:
        # Fix: remove the extra \" 
        old_pat = chr(92)+'"+(p.map_name||'+chr(92)+chr(34)+chr(92)+chr(34)+')+'+chr(92)+'"'
        new_pat = chr(92)+"+(p.map_name||\"\")+"+chr(92)
        
        print(f"  Old: {repr(old_pat)}")
        print(f"  New: {repr(new_pat)}")
        print(f"  Found old: {old_pat in c}")
        
        if old_pat in c:
            c = c.replace(old_pat, new_pat)
            print("  Replaced!")
        else:
            # Fallback: use the exact character from file
            field = s[s.index("+"):s.rindex("+")+1]
            print(f"  Field to replace: {repr(field)}")
            if field in c:
                repl = "'+(p.map_name||\"\")+"
                c = c.replace(field, rept)
                print("  Replaced!")
            else:
                print("  Field not found in c")

with open("F:/暗区突围网站/pages/review.html", "w", encoding="utf8") as f:
    f.write(c)

# Final check
c2 = open("F:/暗区突围网站/pages/review.html", "r", encoding="utf8").read()
for m in re.finditer("data-map-name", c2):
    s = c2[m.start():m.start()+60]
    print(f"After fix: {repr(s)}")
