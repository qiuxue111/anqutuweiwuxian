# -*- coding: utf-8 -*-
maps = ['map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Fix all occurrences of the variant pattern
    old = "var countByName={};(pins||[]).concat(cloudPins||[]).forEach(function(p){if(p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});"
    new = "var countByName={};pins.forEach(function(p){if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});"
    
    c = t.count(old)
    print(f'{m}: {c} occurrences')
    if c > 0:
        t = t.replace(old, new)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(t)
        print(f'  -> fixed')
    else:
        print(f'  -> no match, checking...')
        # Show what's there
        idx = t.find('countByName')
        if idx >= 0:
            print(f'  actual: ...{t[idx:idx+150]}')
