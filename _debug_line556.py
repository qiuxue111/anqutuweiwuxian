c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
lines = c.split('\n')
print(f"Line 556: {lines[555][:200]}" if len(lines) > 555 else "N/A")
# Show lines 554-558
for i in range(max(0, 553), min(len(lines), 559)):
    print(f"  Line {i+1}: {lines[i][:200]}")
