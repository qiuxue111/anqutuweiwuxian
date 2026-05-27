import os, re

# Add favicon link to all HTML files that don't have it
files = ['F:\\暗区突围网站\\index.html']
files += [f'F:\\暗区突围网站\\pages\\{f}' for f in ['gear.html','help.html','map-editor.html','map-farm.html','maps.html','review.html','strategy.html','weapons.html']]

for fp in files:
    c = open(fp, 'r', encoding='utf-8').read()
    if 'favicon.ico' in c:
        print(f'{os.path.basename(fp)}: already has favicon')
        continue
    # Insert after <head>
    href = 'favicon.ico' if 'index.html' in fp else '../favicon.ico'
    c = c.replace('<head>', f'<head>\n  <link rel="icon" href="{href}" type="image/jpeg">')
    open(fp, 'w', encoding='utf-8').write(c)
    print(f'{os.path.basename(fp)}: added favicon (href={href})')
