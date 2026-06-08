maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Widen ad-card to 220px so image fills well
    t = t.replace('.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:140px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}',
                  '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:240px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}')
    
    # Remove padding so image is flush
    # Actually keep padding but make it 0
    t = t.replace('padding:8px;transition', 'padding:0;transition')
    
    # Make image fill card with no padding
    t = t.replace('.ad-card img{width:100%;height:auto;object-fit:contain;border-radius:6px;pointer-events:none;display:block}',
                  '.ad-card img{width:100%;height:auto;object-fit:contain;border-radius:10px;pointer-events:none;display:block}')
    
    # Remove gap between items
    t = t.replace('gap:6px;align-items', 'gap:0;align-items')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: widened ad-card to 240px')
