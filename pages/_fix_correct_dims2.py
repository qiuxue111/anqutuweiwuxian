# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
# Known real dims from ffprobe
real_dims = {
    'map-farm': [6942, 2872],
    'map-valley': [7510, 4454],
    'map-beishan': [7566, 4588],
    'map-tvstation': [4000, 4000],  # estimated
    'map-armory': [4000, 4000],     # estimated
    'map-airport': [5000, 5000],    # estimated
}
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    iw, ih = real_dims[m]
    
    # Reset to a clean version: scale to fill screen (max of both axes), centered
    init_new = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    reset_new = f'''function resetView(){{
  var w = window.innerWidth;
  var h = window.innerHeight;
  var iw = {iw};
  var ih = {ih};
  var s = 1;
  if (w > 0) {{
    var sx = w / iw;
    var sy = h / ih;
    s = Math.max(sx, sy);
    if (s > 3) s = 3;
    if (s < 0.3) s = 0.3;
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
  }} else {{
    scaleM = 1; panX = 0; panY = 0;
  }}'''
    
    # Find and replace the init block - it starts with 'var iw = ' and ends with 'ut();'
    # Find the exact init block
    import re
    match_init = re.search(r'var iw = \d+;[\s\S]*?ut\(\);', t)
    if match_init:
        t = t[:match_init.start()] + init_new + t[match_init.end():]
    
    # Find and replace resetView
    idx_reset = t.find('function resetView(){')
    if idx_reset >= 0:
        # Find the end of resetView - it's the next function or similar
        end_reset = t.find('\n}', idx_reset)
        end_reset = t.find('}', end_reset + 1)  # closing of if
        end_reset = t.find('\n}', end_reset + 1)  # closing of function
        # Just replace the whole function
        old_func = t[idx_reset:end_reset+1]
        t = t[:idx_reset] + reset_new + t[end_reset+1:]
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: dims={iw}x{ih}')
