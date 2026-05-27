c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
import re
for m in re.finditer(r"\.jpg[^']", c[15000:30000]):
    st = max(0, m.start()+15000-30)
    en = min(len(c), m.start()+15000+30)
    print(f"Position {m.start()+15000}: c[{st}:{en}] = '{c[st:en]}'")
