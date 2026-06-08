maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Replace entire ad-card CSS with fixed 3:4 ratio layout
    # Desktop CSS (one-line format for maps)
    # Match the .ad-card{...}.ad-card a{...}.ad-card img{...} chain
    old_desktop = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:240px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:stretch;gap:0;padding:0;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}.ad-card a{display:flex;width:100%;height:100%}.ad-card img{width:100%;height:100%;object-fit:cover;border-radius:10px;pointer-events:none;display:block}'
    new_desktop = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:180px;height:240px;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;overflow:hidden;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}.ad-card a{display:block;width:100%;height:calc(100% - 48px);overflow:hidden;position:relative}.ad-card img{width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}.ad-card .ad-text{position:absolute;bottom:0;left:0;width:100%;height:48px;background:rgba(0,0,0,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px;box-sizing:border-box}'
    
    t = t.replace(old_desktop, new_desktop)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: 3:4 card with bottom text')
