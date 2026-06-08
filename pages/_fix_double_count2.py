# -*- coding: utf-8 -*-
import re
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace ALL occurrences of the allPins counting pattern with simplified version
    # Pattern: var allPins=...concat...;var countByName={};allPins.forEach(function(p){if(p...floor...)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});
    old_pattern = r"var allPins=pins\.concat\(cloudPins\|\|\[\]\);var countByName={};allPins\.forEach\(function\(p\)\{if\(p\.name&&p\.floor!==undefined&&p\.floor!==null&&p\.floor!==currentFloor\)return;if\(p\.name&&p\.name!==''\)countByName\[p\.name\]=(countByName\[p\.name\]\|\|0)\+1;\}\);"
    new_pattern = "var countByName={};pins.forEach(function(p){if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});"
    
    t = re.sub(old_pattern, new_pattern, t)
    
    # Also fix the variant without floor check
    old_pattern2 = r"var allPins=pins\.concat\(cloudPins\|\|\[\]\);var countByName={};allPins\.forEach\(function\(p\)\{if\(p\.name&&p\.name!==''\)countByName\[p\.name\]=(countByName\[p\.name\]\|\|0)\+1;\}\);"
    t = re.sub(old_pattern2, new_pattern, t)
    
    # Fix the orders.forEach variant too
    old_pattern3 = r"var countByName={};(pins\|\|\[\])\.concat\(cloudPins\|\|\[\]\)\.forEach\(function\(p\)\{if\(p\.floor!==undefined&&p\.floor!==null&&p\.floor!==currentFloor\)return;if\(p\.name&&p\.name!==''\)countByName\[p\.name\]=(countByName\[p\.name\]\|\|0)\+1;\}\);"
    t = re.sub(old_pattern3, "var countByName={};pins.forEach(function(p){if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});", t)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    
    # Count remaining allPins
    remaining = t.count('allPins=')
    print(f'{m}: replaced, {remaining} remaining allPins=')
