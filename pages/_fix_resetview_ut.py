# -*- coding: utf-8 -*-
import re
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # In toggleMat, after each mat-item is created, add count badge to mi-name
    # Find the line: var nm=document.createElement('div'); nm.className='mi-name'; nm.textContent=it; el.appendChild(nm);
    old = "nm.textContent=it;"
    new = "nm.textContent=it; nm.rightText=' ('+countByName[it]+')';"
    
    # Need to add countByName computation before the items loop
    # Find: (window.orders||[]).forEach(function(layer){
    old_loop = "(window.orders||[]).forEach(function(layer){"
    new_loop = "var allPins=pins.concat(cloudPins||[]);var countByName={};allPins.forEach(function(p){if(p.name&&p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});" + old_loop
    
    t = t.replace(old_loop, new_loop)
    
    # Fix the mi-name textContent and add count
    old_nm = "nm.textContent=it;"
    new_nm = "nm.textContent=it;var cnt=countByName[it]||0;if(cnt>0)nm.textContent=it+' ('+cnt+')';"
    t = t.replace(old_nm, new_nm)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: added count badge')
