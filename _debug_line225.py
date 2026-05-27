c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()
lines = c.split('\n')
print(f'Total lines: {len(lines)}')
for i in range(224, 228):
    if i < len(lines):
        line = lines[i]
        print(f'{i+1} col 0-140: |{line[0:140]}|')
        if len(line) > 120:
            print(f'  char 120-130: |{line[120:130]}|')
