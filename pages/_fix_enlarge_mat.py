# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace all 520 max-height limits for mat-content
    # 1. closing animation: Math.min(mc.scrollHeight,520)
    t = t.replace('Math.min(mc.scrollHeight,520)', 'Math.min(mc.scrollHeight, window.innerHeight * 0.8)')
    # 2. opening animation: Math.min(mc.scrollHeight,520)
    # (same string, already replaced)
    # 3. final max-height: '520px'
    t = t.replace("mc.style.maxHeight='520px'", "mc.style.maxHeight=Math.min(mc.scrollHeight, window.innerHeight * 0.8)+'px'")
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: enlarged mat-panel')
