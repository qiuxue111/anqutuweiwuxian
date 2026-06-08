# -*- coding: utf-8 -*-
import re
path = 'F:/暗区突围网站/pages/map-farm.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

old = r"var allPins=pins\.concat\(cloudPins\|\|\[\]\);var countByName=\{\};allPins\.forEach\(function\(p\)\{if\(p\.name&&p\.floor!==undefined&&p\.floor!==null&&p\.floor!==currentFloor\)return;if\(p\.name&&p\.name!==''\)countByName\[p\.name\]=(countByName\[p\.name\]\|\|0)\+1;\}\);"
new = "var countByName={};pins.forEach(function(p){if(p.name&&p.name!=='')countByName[p.name]=(countByName[p.name]||0)+1;});"
t = re.sub(old, new, t)
print(f'remaining allPins=: {t.count("allPins=")}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
