import os
c = open('F:\\暗区突围网站\\index.html', 'r', encoding='utf-8').read()
if 'favicon.ico' not in c:
    c = c.replace('<head>', '<head>\n  <link rel="icon" href="favicon.ico" type="image/jpeg">')
    open('F:\\暗区突围网站\\index.html', 'w', encoding='utf-8').write(c)
    print('index.html: added')
else:
    print('index.html: already has')
