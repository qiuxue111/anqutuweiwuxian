import os, re

base = 'F:\\暗区突围网站\\pages\\'
files = ['gear.html','help.html','map-editor.html','map-farm.html','maps.html','review.html','strategy.html','weapons.html']

for fn in files:
    fp = base + fn
    c = open(fp, 'r', encoding='utf-8').read()
    
    # Fix all broken </title> patterns
    # The issue is "�?/title>" or "??/title>" etc.
    # Replace anything that looks like a broken end tag for title
    c = re.sub(r'<title>(.+?)([^/]*?)/(title>)', r'<title>\1</title>', c)
    
    # Also fix index.html
    if fn == 'index.html':
        c = re.sub(r'<title>(.+?)([^/]*?)/(title>)', r'<title>\1</title>', c)
    
    # Verify
    m = re.search(r'<title>(.*?)</title>', c)
    if m:
        print(f'{fn}: OK - "{m.group(1)[:30]}"')
    else:
        m2 = re.search(r'<title>(.*?)$', c)
        if m2:
            print(f'{fn}: STILL BROKEN: "{m2.group(1)[:40]}"')
        else:
            print(f'{fn}: no title found')
    
    open(fp, 'w', encoding='utf-8').write(c)
