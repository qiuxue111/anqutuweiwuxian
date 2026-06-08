# -*- coding: utf-8 -*-
maps = ['map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # These maps use 'orders.forEach(function(layer)' instead of '(window.orders||[]).forEach'
    old_loop = "orders.forEach(function(layer){"
    new_loop = "var countByName={};(pins||[]).concat(cloudPins||[]).forEach(function(p){if(p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});" + old_loop
    
    if old_loop in t:
        t = t.replace(old_loop, new_loop)
        print(f'{m}: added countByName')
    else:
        print(f'{m}: old_loop not found')
    
    # Add count after mi-name
    old_nm = "nm.textContent=it;"
    new_nm = "nm.textContent=it;var cnt=countByName[it]||0;if(cnt>0)nm.textContent=it+' ('+cnt+')';"
    
    if old_nm in t:
        t = t.replace(old_nm, new_nm)
        print(f'{m}: count display added')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
