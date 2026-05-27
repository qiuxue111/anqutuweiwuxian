c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()
import re
for m in re.finditer(r'onclick="[^"]*comment[^"]*"', c, re.I):
    start = max(0, m.start()-30)
    end = min(len(c), m.end()+30)
    print(f'...{c[start:end]}...')
