c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
lines = c.split('\n')
if len(lines) >= 289:
    line = lines[287]
    print(f"Line 288: {line[:200]}")
    if len(line) >= 130:
        print(f"Char 130: '{line[128:132]}'")
