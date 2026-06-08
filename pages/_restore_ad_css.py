# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Remove inline style from HTML
    old_html = '<div class="ad-card" id="adCard" style="display:flex!important;top:12px;left:12px!important;z-index:99999!important;background:red!important;border:3px solid yellow!important">'
    new_html = '<div class="ad-card" id="adCard">'
    t = t.replace(old_html, new_html)
    
    # Find ad CSS and make it look nice again
    import re
    match = re.search(r'\.ad-card\{[^}]*\}', t)
    if match:
        new_css = '.ad-card{position:fixed;top:12px;left:12px;z-index:99999;width:200px;height:80px;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 12px;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}'
        t = t[:match.start()] + new_css + t[match.end():]
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: restored nice CSS')
