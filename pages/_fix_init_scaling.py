# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Fix the initial load scaling to use same adaptive logic
    # Find the init block that does scaleM = Math.min(ratio, 2.5)
    old_init = '''      var iw = img.naturalWidth || img.clientWidth;
      var ratio = w / iw;
      scaleM = Math.min(ratio, 2.5);
      if (scaleM < 0.8) scaleM = 0.8;
      // 如果地图较窄，水平居中
      var mvEl = document.getElementById('mv');
      if (mvEl && iw * scaleM < w) {
        panX = (w - iw * scaleM) / 2;
      }
      ut();'''
    
    new_init = '''      var iw = img.naturalWidth || img.clientWidth || 2000;
      var ih = img.naturalHeight || iw;
      var sx = w / iw;
      var sy = h / ih;
      scaleM = Math.min(sx, sy);
      if (scaleM > 2) scaleM = 2;
      if (scaleM < 0.3) scaleM = 0.3;
      // 居中
      panX = (w - iw * scaleM) / 2;
      panY = (h - ih * scaleM) / 2;
      ut();'''
    
    if old_init in t:
        t = t.replace(old_init, new_init)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: fixed initial load scaling')
    else:
        print(f'{m}: old_init not found')
        # debug: show current init block
        idx = t.find('scaleM = Math.min')
        if idx > 0:
            print(t[idx:idx+300])
