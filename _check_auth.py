c = open('F:/暗区突围网站/index.html', 'r', encoding='utf8').read()
print("Bearer '+token: ", "Bearer '+token" in c)
print("'Bearer ': ", "'Bearer '" in c)

# Find all Authorization headers
import re
for m in re.finditer(r"Authorization[^}]{0,60}", c):
    print(m.group())
