# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Revert max-height back to 520
    t = t.replace('Math.min(mc.scrollHeight, window.innerHeight * 0.8)', 'Math.min(mc.scrollHeight, 520)')
    t = t.replace("mc.style.maxHeight=Math.min(mc.scrollHeight, window.innerHeight * 0.8)+'px'", "mc.style.maxHeight='520px'")
    
    # Widen mat-content by 1.5x
    # Currently: .mat-content{... max-height:60vh ...
    # Add max-width
    t = t.replace('.mat-content{display:none;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 8px 8px;padding:5px;max-height:60vh;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,0.4)}',
        '.mat-content{display:none;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 8px 8px;padding:8px;max-height:60vh;max-width:450px;width:90vw;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,0.4)}')
    
    # Enlarge container box in the icon display (46px -> 60px)
    t = t.replace('.mat-item{display:inline-flex;align-items:center;gap:6px;padding:4px 10px;margin:3px;background:rgba(255,255,255,0.04);border-radius:6px;cursor:pointer;transition:.15s;width:46px;height:46px;overflow:hidden;flex-direction:column;text-align:center;position:relative;vertical-align:top}',
        '.mat-item{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin:4px;background:rgba(255,255,255,0.04);border-radius:8px;cursor:pointer;transition:.15s;width:60px;height:60px;overflow:hidden;flex-direction:column;text-align:center;position:relative;vertical-align:top}')
    
    # Enlarge icon images inside
    t = t.replace('.mat-item img{width:28px;height:28px;object-fit:contain;pointer-events:none;flex-shrink:0}',
        '.mat-item img{width:36px;height:36px;object-fit:contain;pointer-events:none;flex-shrink:0}')
    
    # Enlarge name text
    t = t.replace('.mi-name{font-size:9px;line-height:1.1;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:44px;pointer-events:none;flex-shrink:0}',
        '.mi-name{font-size:10px;line-height:1.2;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:56px;pointer-events:none;flex-shrink:0}')
    
    # Enlarge mat-btn
    t = t.replace('.mat-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#ccc;padding:6px 14px;font-size:13px;border-radius:6px;cursor:pointer;transition:.2s;white-space:nowrap}',
        '.mat-btn{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);color:#ccc;padding:8px 18px;font-size:14px;border-radius:8px;cursor:pointer;transition:.2s;white-space:nowrap}')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: enlarged')
