# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Update ad-card CSS: wider, taller, image-friendly
    old_css = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:200px;height:80px;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 12px;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}'
    new_css = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:140px;height:auto;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;padding:8px;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}'
    t = t.replace(old_css, new_css)
    
    # ad-card:hover - keep similar
    # ad-text centered
    t = t.replace('.ad-text{text-align:center;flex:1}', '.ad-text{text-align:center}')
    
    # ad-img sizing: fill card width, maintain aspect ratio
    old_img_css = '.ad-card img{width:auto;height:auto;max-width:100%;max-height:100%;object-fit:contain;border-radius:6px;pointer-events:none}'
    new_img_css = '.ad-card img{width:100%;height:auto;object-fit:contain;border-radius:6px;pointer-events:none;display:block}'
    t = t.replace(old_img_css, new_img_css)
    
    # Also update the display:block on adImg (removed display:none above)
    # Ensure ad-text (title+desc) are visible
    # Remove the display:none from inline style if any leftover
    # (already replaced in the HTML block above)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: ad CSS updated')
