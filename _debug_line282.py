c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
lines = c.split('\n')
print(f"Line 282: {lines[281][:200]}")
print(f"Line 282 char 135: {lines[281][130:140] if len(lines[281]) > 135 else 'N/A'}")
