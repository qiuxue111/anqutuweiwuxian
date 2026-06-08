# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
real_dims = {
    'map-farm': [6942, 2872],
    'map-valley': [7510, 4454],
    'map-beishan': [7566, 4588],
    'map-tvstation': [4000, 4000],
    'map-armory': [4000, 4000],
    'map-airport': [5000, 5000],
}
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    iw, ih = real_dims[m]
    old_iw = {'map-farm': 2000, 'map-valley': 2000, 'map-beishan': 3000, 'map-tvstation': 2000, 'map-armory': 2000, 'map-airport': 2000}
    old_ih = {'map-farm': 2000, 'map-valley': 2000, 'map-beishan': 1000, 'map-tvstation': 2000, 'map-armory': 2000, 'map-airport': 2000}
    
    oiw, oih = old_iw[m], old_ih[m]
    
    # Strategy: replace all panY lines with the same logic
    # Current state (from f49ea89): scaleM = h/ih, panX = (w-iw*s)/2, panY = 0
    # We need: scaleM = max(w/iw, h/ih), panX = (w-iw*s)/2, panY = (h-ih*s)/2
    
    # Fix init block: replace numbers and the scale formula
    # Old init: var iw = 2000; var ih = 2000; scaleM = h / ih; if (scaleM > 3) scaleM = 3; if (scaleM < 0.5) scaleM = 0.5; panX = (w - iw * scaleM) / 2; panY = 0; ut();
    old_init = f'var iw = {oiw};\r\n      var ih = {oih};\r\n      scaleM = h / ih;\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.5) scaleM = 0.5;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = 0;\r\n      ut();'
    
    new_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    t = t.replace(old_init, new_init)
    
    # Fix resetView: replace iw/ih values and the scale logic
    old_reset_iw = f'  var iw = {oiw};\n  var ih = {oih};'
    new_reset_iw = f'  var iw = {iw};\n  var ih = {ih};'
    t = t.replace(old_reset_iw, new_reset_iw)
    
    # Fix the scale = h/ih to Math.max
    t = t.replace('    s = h / ih;\n    if (s > 3) s = 3;\n    if (s < 0.5) s = 0.5;\n    scaleM = s;\n    panX = (w - iw * s) / 2;\n    panY = 0;', '    var sx = w / iw;\n    var sy = h / ih;\n    s = Math.max(sx, sy);\n    if (s > 3) s = 3;\n    if (s < 0.3) s = 0.3;\n    scaleM = s;\n    panX = (w - iw * s) / 2;\n    panY = (h - ih * s) / 2;')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: dims={iw}x{ih}, fill-screen max+center')
