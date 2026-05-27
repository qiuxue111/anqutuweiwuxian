c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
import re
for m in re.finditer(r'delBtn', c):
    st = max(0, m.start()-10)
    en = min(len(c), m.end()+80)
    ctx = c[st:en]
    print(f"Position {m.start()}: ...{ctx}...")
    print()
