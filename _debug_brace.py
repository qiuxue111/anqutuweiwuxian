c = open('F:/暗区突围网站/pages/weapons.html', 'r', encoding='utf8').read()
import re
ms = re.findall(r'<script>([\s\S]*?)</script>', c)
s = ';'.join(ms)

# Find which { has no matching }
# Show context around unbalanced braces
lines = s.split(';')
depth = 0
for i, line in enumerate(lines):
    for ch in line:
        if ch == '{': depth += 1
        elif ch == '}':
            depth -= 1
            if depth < 0:
                print(f"Extra } at approx script line {i}")

# It's 165 {'s and 166 }'s, meaning one extra }
# Let me show the last few hundred chars of the script
print("\n--- Last 500 chars of script ---")
print(s[-500:])
