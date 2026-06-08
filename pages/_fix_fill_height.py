# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
map_dims = {
    'map-farm': [2000, 2000],
    'map-valley': [2000, 2000],
    'map-beishan': [3000, 1000],
    'map-tvstation': [2000, 2000],
    'map-armory': [2000, 2000],
    'map-airport': [2000, 2000],
}
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    iw, ih = map_dims[m]
    
    # Change init block: scale to fill screen height, not min/max of both
    old_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 5) scaleM = 5;\r\n      if (scaleM < 0.5) scaleM = 0.5;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) * 0.5;\r\n      ut();'
    
    # Use only height to determine scale - fill the whole screen vertically
    new_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      scaleM = h / ih;\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.5) scaleM = 0.5;\r\n      panX = (w - iw * scaleM) * 0.3;\r\n      panY = 0;\r\n      ut();'
    
    if old_init in t:
        t = t.replace(old_init, new_init)
    
    # Fix resetView same way
    old_reset = f'''function resetView(){{
  var w = window.innerWidth;
  var h = window.innerHeight;
  var iw = {iw};
  var ih = {ih};
  var s = 1;
  if (w > 0) {{
    var sx = w / iw;
    var sy = h / ih;
    s = Math.max(sx, sy);
    if (s > 5) s = 5;
    if (s < 0.5) s = 0.5;
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) * 0.5;
  }} else {{
    scaleM = 1; panX = 0; panY = 0;
  }}'''
    
    new_reset = f'''function resetView(){{
  var w = window.innerWidth;
  var h = window.innerHeight;
  var iw = {iw};
  var ih = {ih};
  var s = 1;
  if (w > 0) {{
    s = h / ih;
    if (s > 3) s = 3;
    if (s < 0.5) s = 0.5;
    scaleM = s;
    panX = (w - iw * s) * 0.3;
    panY = 0;
  }} else {{
    scaleM = 1; panX = 0; panY = 0;
  }}'''
    
    if old_reset in t:
        t = t.replace(old_reset, new_reset)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: height-fill mode')
