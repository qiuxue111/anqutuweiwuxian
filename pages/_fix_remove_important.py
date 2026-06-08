# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Remove the !important overrides that override mat-item
    t = t.replace('.mat-item{width:36px!important;min-width:36px!important;max-width:36px!important;height:42px!important}', '')
    t = t.replace('.mat-item{width:46px!important;min-width:46px!important;max-width:46px!important;height:54px!important}', '')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: removed !important overrides')
