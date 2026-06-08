# -*- coding: utf-8 -*-
with open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf-8') as f:
    t = f.read()

# Try both quote styles
old_single = "var allPins=pins.concat(cloudPins||[]);var countByName={};allPins.forEach(function(p){if(p.name&&p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});"
old_double = 'var allPins=pins.concat(cloudPins||[]);var countByName={};allPins.forEach(function(p){if(p.name&&p.floor!==undefined&&p.floor!==null&&p.floor!==currentFloor)return;if(p.name&&p.name!="")countByName[p.name]=(countByName[p.name]||0)+1;});'

new = "var countByName={};pins.forEach(function(p){if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});"

c1 = t.count(old_single)
c2 = t.count(old_double)
print(f'Single-quote matches: {c1}')
print(f'Double-quote matches: {c2}')

if c1 > 0:
    t = t.replace(old_single, new)
    print(f'Replaced {c1} single-quote versions')
if c2 > 0:
    t = t.replace(old_double, new)
    print(f'Replaced {c2} double-quote versions')

print(f'Remaining allPins=: {t.count("allPins=")}')

with open('F:/暗区突围网站/pages/map-farm.html', 'w', encoding='utf-8') as f:
    f.write(t)
