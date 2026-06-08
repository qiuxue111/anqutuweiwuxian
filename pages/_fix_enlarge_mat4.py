# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    t = t.replace('.mat-item{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin:4px;background:rgba(255,255,255,0.04);border-radius:8px;cursor:pointer;transition:.15s;width:70px;height:70px;overflow:hidden;flex-direction:column;text-align:center;position:relative;vertical-align:top}',
        '.mat-item{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;margin:4px;background:rgba(255,255,255,0.04);border-radius:8px;cursor:pointer;transition:.15s;width:90px;height:90px;overflow:hidden;flex-direction:column;text-align:center;position:relative;vertical-align:top}')
    t = t.replace('.mat-item img{width:42px;height:42px;object-fit:contain;pointer-events:none;flex-shrink:0}',
        '.mat-item img{width:50px;height:50px;object-fit:contain;pointer-events:none;flex-shrink:0}')
    t = t.replace('.mi-name{font-size:10px;line-height:1.2;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:66px;pointer-events:none;flex-shrink:0}',
        '.mi-name{font-size:11px;line-height:1.2;color:#999;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:80px;pointer-events:none;flex-shrink:0}')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: 90px boxes')
