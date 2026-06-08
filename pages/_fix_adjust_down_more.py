# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Change panY from * 0.4 to * 1.0 (2.5x the current offset)
    t = t.replace('panY = (h - ih * scaleM) * 0.4;', 'panY = (h - ih * scaleM) * 1.0;')
    t = t.replace('panY = (h - ih * s) * 0.4;', 'panY = (h - ih * s) * 1.0;')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: panY 0.4 -> 1.0')
