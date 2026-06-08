# -*- coding: utf-8 -*-
# Get actual image dimensions
import subprocess, json
maps = ['farm','valley','beishan','tvstation','armory','airport']
dims = {}
for m in maps:
    r = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height', '-of', 'json', f'F:/暗区突围网站/assets/maps/{m}_bg.jpg'], capture_output=True, text=True)
    d = json.loads(r.stdout)
    w = d['streams'][0]['width']
    h = d['streams'][0]['height']
    dims[f'map-{m}'] = [w, h]
    print(f'{m}: {w}x{h}')

# Now fix all 6 maps with correct dimensions
for m, (iw, ih) in dims.items():
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Fix init block
    old_init = f'var iw = {2000 if m != "map-beishan" else 3000};\r\n      var ih = {2000 if m != "map-beishan" else 1000};\r\n      scaleM = w / iw;\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = 0;\r\n      panY = 0;\r\n      ut();'
    new_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    t = t.replace(old_init, new_init)
    
    # Fix resetView
    old_reset = f'''function resetView(){{
  var w = window.innerWidth;
  var h = window.innerHeight;
  var iw = {2000 if m != "map-beishan" else 3000};
  var ih = {2000 if m != "map-beishan" else 1000};'''
    
    new_reset = f'''function resetView(){{
  var w = window.innerWidth;
  var h = window.innerHeight;
  var iw = {iw};
  var ih = {ih};'''
    t = t.replace(old_reset, new_reset)
    
    # Fix the scale calculation inside resetView
    t = t.replace('s = w / iw;\n    if (s > 3) s = 3;\n    if (s < 0.3) s = 0.3;\n    scaleM = s;\n    panX = 0;\n    panY = 0;', 'var sx = w / iw;\n    var sy = h / ih;\n    s = Math.max(sx, sy);\n    if (s > 3) s = 3;\n    if (s < 0.3) s = 0.3;\n    scaleM = s;\n    panX = (w - iw * s) / 2;\n    panY = (h - ih * s) / 2;')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: corrected dims to {iw}x{ih}')
