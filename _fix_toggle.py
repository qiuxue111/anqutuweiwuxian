import re
files = [
    'F:/暗区突围网站/pages/maps.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
    'F:/暗区突围网站/search.html'
]
for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    old = "getElementById('sideMenu')"
    new = "getElementById('bubbleMenu')"
    if old in c:
        c = c.replace(old, new)
        with open(fp, 'w', encoding='utf8') as f:
            f.write(c)
        print(fp.split('/')[-1] + ': fixed toggleMenu')
    else:
        print(fp.split('/')[-1] + ': already done')
    
    # Also verify bubbleMenu CSS is present
    if '#bubbleMenu{display:none' not in c:
        print('  WARNING: missing bubbleMenu CSS!')
    # Verify menuBtn CSS
    if '#menuBtn{position:fixed' not in c:
        print('  WARNING: missing menuBtn CSS!')
    # Check bracket balance in script
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    if ms and ms[0]:
        s = ms[0]
        ob = s.count('{')
        cb = s.count('}')
        op = s.count('(')
        cp = s.count(')')
        if ob != cb or op != cp:
            print(f'  BRACE FAIL: {{={ob} }}={cb} (={op})={cp}')
        else:
            print(f'  BRACES OK')
