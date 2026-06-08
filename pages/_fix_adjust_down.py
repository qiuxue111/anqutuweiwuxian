# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
map_dims = {
    'map-farm': [2000, 2000],
    'map-valley': [2000, 2000],
    'map-beishan': [3000, 1000],
    'map-tvstation': [2000, 2000],
    'map-armory': [2000, 2000],
    'map-airport': [2000, 2000],
}
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    iw, ih = map_dims[m]
    
    # Change panY from center to 60% down (slightly below center)
    old_pat = f'panY = (h - ih * scaleM) / 2;'
    new_pat = f'panY = (h - ih * scaleM) * 0.4;'  # 40% from top, so map starts a bit below center
    
    # Fix both occurrences (init and resetView)
    count = t.count(old_pat)
    t = t.replace(old_pat, new_pat)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: {count} replacements (panY center -> 0.4)')
