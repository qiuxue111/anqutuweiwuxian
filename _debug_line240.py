c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
lines = c.split('\n')
for i in range(235, 250):
    if i < len(lines):
        print(f"Line {i+1}: {lines[i][:150]}")
