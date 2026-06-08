# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Fix the resetView panY too
    t = t.replace('panY = (h - ih * s) / 2;', 'panY = (h - ih * s) * 0.4;')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: fixed resetView panY')
