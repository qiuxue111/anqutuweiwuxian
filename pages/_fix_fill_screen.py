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
    
    # Fix init: remove the min() limit and just use width-based scale, no upper bound
    old_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.min(sx, sy);\r\n      if (scaleM > 2) scaleM = 2;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    # Use the larger of sx,sy to fill the screen (no empty space)
    new_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 5) scaleM = 5;\r\n      if (scaleM < 0.5) scaleM = 0.5;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
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
    s = Math.min(sx, sy);
    if (s > 2) s = 2;
    if (s < 0.3) s = 0.3;
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
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
    var sx = w / iw;
    var sy = h / ih;
    s = Math.max(sx, sy);
    if (s > 5) s = 5;
    if (s < 0.5) s = 0.5;
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
  }} else {{
    scaleM = 1; panX = 0; panY = 0;
  }}'''
    
    if old_reset in t:
        t = t.replace(old_reset, new_reset)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: min -> max')
