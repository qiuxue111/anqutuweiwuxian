c = open('F:/暗区突围网站/pages/strategy.html', 'r', encoding='utf8').read()

# Find the async-related error - look for bare async
import re
for m in re.finditer(r'async[^a-zA-Z]', c):
    before = c[max(0,m.start()-30):m.start()]
    after = c[m.end():m.end()+80]
    if not m.group().startswith('async function') and not m.group().startswith('async '):
        print(f'BARE async: ...{before}[{m.group()}]{after}...')
        print()

# Find toggleMenu
idx = c.find('function toggleMenu')
if idx >= 0:
    print('toggleMenu found at', idx)
    print(c[max(0,idx-5):idx+80])
else:
    print('toggleMenu NOT FOUND in file!')
    # Check if it was wrapped in IIFE
    iidx = c.find('toggleMenu')
    if iidx >= 0:
        print(f'toggleMenu referenced at {iidx}: ...{c[max(0,iidx-20):iidx+100]}...')
