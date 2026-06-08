# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Find the ad-card CSS: .ad-card{ ... }
    import re
    match = re.search(r'\.ad-card\{[^}]*\}', t)
    if match:
        old = match.group(0)
        new = '.ad-card{position:fixed;top:12px!important;left:12px!important;z-index:99999!important;width:200px!important;height:80px!important;background:red!important;border:3px solid yellow!important;border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;color:white!important;font-size:16px!important}'
        t = t[:match.start()] + new + t[match.end():]
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: replaced ad CSS')
    else:
        print(f'{m}: NO ad CSS found!')
