maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # The <a> tag wrapping img is inline, need to make it block so img fills
    t = t.replace('.ad-card img{width:100%;height:auto;object-fit:contain;border-radius:10px;pointer-events:none;display:block}',
                  '.ad-card img{width:100%;height:100%;object-fit:cover;border-radius:10px;pointer-events:none;display:block}')
    
    # Make the <a> tag fill the card (it wraps the img)
    # Add CSS for .ad-card a
    # Find the closing brace of .ad-card block and add a-tag style before it
    import re
    # Insert a-tag flex style right after ad-card block
    # Better: add a general rule
    search = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:240px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0;padding:0;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}'
    new_search = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:240px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:0;padding:0;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}.ad-card a{display:flex;width:100%;height:100%}'
    
    t = t.replace(search, new_search)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: a-tag fill')
