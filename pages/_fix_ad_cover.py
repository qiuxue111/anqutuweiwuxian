maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Current ad-card CSS (from previous _fix_ad_wide.py attempt - some may have gap:6px still)
    # Replace all .ad-card{...} desktop CSS to the correct one
    
    # Find the desktop ad-card CSS block (not the .touch-mobile one)
    import re
    old = re.search(r'\.ad-card\{position:fixed;left:12px;bottom:12px;z-index:99990;width:240px;height:auto;background:rgba\(10,10,15,0\.72\);backdrop-filter:blur\(8px\);[^}]+?touch-action:none\}', t)
    if old:
        old_str = old.group()
        new_str = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:240px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:stretch;gap:0;padding:0;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}.ad-card a{display:flex;width:100%;height:100%}.ad-card img{width:100%;height:100%;object-fit:cover;border-radius:10px;pointer-events:none;display:block}'
        t = t.replace(old_str, new_str)
        print(f'{m}: desktop CSS replaced')
    else:
        print(f'{m}: no match')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
