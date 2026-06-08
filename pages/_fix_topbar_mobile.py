# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Fix touch-mobile top-bar: replace flex-wrap:wrap with overflow-x:auto
    old = 'body.touch-mobile .top-bar{min-width:auto!important;padding:2px 6px;top:4px!important;left:4px!important;right:4px!important;transform:none!important;border-radius:6px;flex-wrap:wrap;gap:3px;width:auto!important;max-width:calc(100vw - 8px)}'
    new = 'body.touch-mobile .top-bar{min-width:auto!important;padding:2px 6px;top:4px!important;left:4px!important;right:4px!important;transform:none!important;border-radius:6px;flex-wrap:nowrap;overflow-x:auto;gap:3px;width:auto!important;max-width:calc(100vw - 8px);-webkit-overflow-scrolling:touch}'
    
    if old in t:
        t = t.replace(old, new)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: fixed top-bar flex-wrap')
    else:
        print(f'{m}: pattern not found')
