c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
import re
# More careful script extraction - deal with script in script (injected <script> tags)
# Find all script tags including embedded ones
scripts = []
i = 0
while i < len(c):
    st = c.find('<script>', i)
    if st < 0: break
    en = c.find('</script>', st + 8)
    if en < 0: break
    content = c[st+8:en]
    scripts.append((st, en+9, content))
    i = en + 9

print("Found", len(scripts), "script blocks")
for idx, (st, en, content) in enumerate(scripts):
    lines = content.split('\n')
    first_real = ''
    for l in lines:
        if l.strip():
            first_real = l.strip()[:80]
            break
    print(f"  Block {idx}: len={len(content)} start_pos={st} first_line='{first_real}'")
    has_fab = "fabOpenPostForm" in content
    has_toggle = "function toggleMenu" in content
    has_await = "await" in content.replace("'await'", "").replace('"await"', "")
    print(f"    fabOpenPostForm={has_fab} toggleMenu={has_toggle} has_await={has_await}")
