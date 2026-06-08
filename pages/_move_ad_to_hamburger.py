# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace .ad-card positioning to match hamburger
    old = '.ad-card{\r\n  position:fixed;\r\n  left:12px;bottom:12px;'
    new = '.ad-card{\r\n  position:fixed;\r\n  top:12px;left:54px;'
    t = t.replace(old, new)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: position changed')
