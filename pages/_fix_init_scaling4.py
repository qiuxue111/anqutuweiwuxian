# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    old = 'var iw = img.naturalWidth || img.clientWidth;\r\n      var ratio = w / iw;\r\n      scaleM = Math.min(ratio, 2.5);\r\n      if (scaleM < 0.8) scaleM = 0.8;\r\n      // 如果地图较窄，水平居中\r\n      var mvEl = document.getElementById(\'mv\');\r\n      if (mvEl && iw * scaleM < w) {\r\n        panX = (w - iw * scaleM) / 2;\r\n      }\r\n      ut();'
    
    new = 'var iw = img.naturalWidth || img.clientWidth || 2000;\r\n      var ih = img.naturalHeight || iw;\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.min(sx, sy);\r\n      if (scaleM > 2) scaleM = 2;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    count = t.count(old)
    if count > 0:
        t = t.replace(old, new)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: replaced {count}x')
    else:
        print(f'{m}: not found')
