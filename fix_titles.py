import os, re

for fn in ['gear.html','help.html','map-editor.html','map-farm.html','maps.html','review.html','strategy.html','weapons.html']:
    c = open(f'F:\\暗区突围网站\\pages\\{fn}', 'r', encoding='utf-8').read()
    # Fix broken </title>
    c = c.replace('??/title>', '</title>')
    # Verify title is properly closed
    m = re.search(r'<title>(.*?)</title>', c)
    if m:
        print(f'{fn}: OK - <title>{m.group(1)[:20]}...</title>')
    else:
        print(f'{fn}: BROKEN title, trying to fix...')
        # Find what's there
        m2 = re.search(r'<title>(.*?)(<|$)', c)
        if m2:
            old_title = m2.group(1)
            c = c[:m2.start()] + f'<title>{old_title}</title>' + c[m2.end():]
            print(f'  repaired to: <title>{old_title}</title>')
        else:
            print(f'  could not find title!')
    open(f'F:\\暗区突围网站\\pages\\{fn}', 'w', encoding='utf-8').write(c)
