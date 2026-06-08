# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace allPins with just pins (already filtered)
    t = t.replace('var allPins=pins.concat(cloudPins||[]);var countByName={};allPins.forEach(function(p){if(p.name&&p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});(window.orders||[]).forEach',
        'var countByName={};pins.forEach(function(p){if(p.name&&p.name!==\"\")countByName[p.name]=(countByName[p.name]||0)+1;});(window.orders||[]).forEach')
    
    # Also fix maps using orders.forEach
    t = t.replace('var countByName={};(pins||[]).concat(cloudPins||[]).forEach(function(p){if(p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!==\"\")countByName[p.name]=(countByName[p.name]||0)+1;});orders.forEach',
        'var countByName={};pins.forEach(function(p){if(p.name&&p.name!==\"\")countByName[p.name]=(countByName[p.name]||0)+1;});orders.forEach')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: fixed double counting')
