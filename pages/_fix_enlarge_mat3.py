# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # .mat-item width/height 60 -> 70
    t = t.replace('.mat-item{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin:4px;background:rgba(255,255,255,0.04);border-radius:8px;cursor:pointer;transition:.15s;width:60px;height:60px;overflow:hidden;flex-direction:column;text-align:center;position:relative;vertical-align:top}',
        '.mat-item{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin:4px;background:rgba(255,255,255,0.04);border-radius:8px;cursor:pointer;transition:.15s;width:70px;height:70px;overflow:hidden;flex-direction:column;text-align:center;position:relative;vertical-align:top}')
    
    # icon 36 -> 42
    t = t.replace('.mat-item img{width:36px;height:36px;object-fit:contain;pointer-events:none;flex-shrink:0}',
        '.mat-item img{width:42px;height:42px;object-fit:contain;pointer-events:none;flex-shrink:0}')
    
    # mi-name max-width 56 -> 66
    t = t.replace('.mi-name{font-size:10px;line-height:1.2;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:56px;pointer-events:none;flex-shrink:0}',
        '.mi-name{font-size:10px;line-height:1.2;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:66px;pointer-events:none;flex-shrink:0}')
    
    # max-width 450 -> 300
    t = t.replace('.mat-content{display:none;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 8px 8px;padding:8px;max-height:60vh;max-width:450px;width:90vw;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,0.4)}',
        '.mat-content{display:none;background:rgba(0,0,0,0.65);backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-top:none;border-radius:0 0 8px 8px;padding:8px;max-height:60vh;max-width:300px;width:90vw;overflow-y:auto;box-shadow:0 4px 16px rgba(0,0,0,0.4)}')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: 70px boxes, 300px width')
