# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    old = "if (sessionStorage.getItem('adCardClosed_v2')) { card.style.display = 'none'; return; }"
    new = "/* ad card always shows on refresh */"
    count = t.count(old)
    if count:
        t = t.replace(old, new)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
    print(f'{m}: replaced {count}')
