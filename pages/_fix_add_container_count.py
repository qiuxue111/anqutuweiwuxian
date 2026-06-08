# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Add count computation before the items loop in toggleMat
    old_loop = "(window.orders||[]).forEach(function(layer){"
    new_loop = "var allPins=pins.concat(cloudPins||[]);var countByName={};allPins.forEach(function(p){if(p.name&&p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});" + old_loop
    
    if old_loop in t:
        t = t.replace(old_loop, new_loop)
        print(f'{m}: added countByName')
    else:
        print(f'{m}: old_loop not found')
    
    # Add count display after mi-name text
    old_nm = "nm.textContent=it;"
    new_nm = "nm.textContent=it;var cnt=countByName[it]||0;if(cnt>0)nm.textContent=it+' ('+cnt+')';"
    
    if old_nm in t:
        t = t.replace(old_nm, new_nm)
        print(f'{m}: added count display')
    else:
        print(f'{m}: old_nm not found')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
