import re

c = open('F:\\暗区突围网站\\pages\\map-farm.html', 'r', encoding='utf-8').read()
print('Total length:', len(c))

# Title
m = re.search(r'<title>([^<]+)</title>', c)
print('Title:', m.group(1) if m else 'NOT FOUND')

# Map img
m = re.search(r'<img[^>]+src="([^"]+)"', c)
print('Map img:', m.group(1) if m else 'NOT FOUND')

# farm occurrences
print('farm occurrences:', c.count('farm'))
print('Farm occurrences:', c.count('Farm'))
print('farm.png:', c.count('farm.png'))
print('abi_farm:', c.count('abi_farm'))

# localStorage keys
for k in ['abi_farm', 'abi_token', 'abi_user']:
    print(f'  {k}: {c.count(k)}')

# Unique identifiers per map
print('\\npins storage key:')
m = re.search(r'savePins\(\)[^}]*localStorage[^;]+;', c)
if m: print(' ', m.group()[:100])
m = re.search(r'localStorage\.setItem\("([^"]+)"', c)
if m: print(' ', m.group())
