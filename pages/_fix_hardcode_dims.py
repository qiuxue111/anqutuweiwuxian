# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
# Map dimensions (approximate)
map_dims = {
    'map-farm': [2000, 2000],
    'map-valley': [2000, 2000],
    'map-beishan': [3000, 1000],  # 3-floor map
    'map-tvstation': [2000, 2000],
    'map-armory': [2000, 2000],
    'map-airport': [2000, 2000],
}
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    iw, ih = map_dims[m]
    
    # Replace the init scaling block
    old_init = 'var iw = img.naturalWidth || img.clientWidth || 2000;\r\n      var ih = img.naturalHeight || iw;\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.min(sx, sy);\r\n      if (scaleM > 2) scaleM = 2;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    new_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.min(sx, sy);\r\n      if (scaleM > 2) scaleM = 2;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    if old_init in t:
        t = t.replace(old_init, new_init)
    
    # Also fix resetView to use same hardcoded dims
    old_reset = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  var s = 1;
  if (img && img.complete && img.naturalWidth) {
    var iw = img.naturalWidth;
    var ih = img.naturalHeight || iw;
    // 缩放：让地图撑满屏幕宽高（取较紧的边），不超过实际尺寸的2倍
    var sx = w / iw;
    var sy = h / ih;
    s = Math.min(sx, sy);
    if (s > 2) s = 2;
    if (s < 0.3) s = 0.3;
    scaleM = s;
    // 始终居中
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
  } else {
    scaleM = 1; panX = 0; panY = 0;
  }'''
    
    new_reset = f'''function resetView(){{
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
    
    if old_reset in t:
        t = t.replace(old_reset, new_reset)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    
    # Verify
    has_init = f'var iw = {iw};' in t
    has_reset = f'var iw = {iw};' in t[t.find('function resetView'):]
    print(f'{m}: init={has_init} reset={has_reset}')
