c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
# Show lines around 94 (the error location)
lines = c.split('\n')
for i in range(88, 100):
    if i < len(lines):
        print(f"Line {i+1}: {lines[i][:150]}")
