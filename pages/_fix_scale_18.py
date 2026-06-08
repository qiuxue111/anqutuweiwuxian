# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace Math.max with a fixed scale of 1.8
    old_init = 'var imgEl = document.getElementById(\'mapImg\');\r\n      var iw2 = imgEl ? imgEl.clientWidth : 0;\r\n      var ih2 = imgEl ? imgEl.clientHeight : 0;\r\n      if (iw2 > 0 && ih2 > 0) {\r\n        var sx = w / iw2;\r\n        var sy = h / ih2;\r\n        scaleM = Math.max(sx, sy);\r\n      } else {\r\n        scaleM = 0.8;\r\n      }\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw2 * scaleM) / 2;\r\n      panY = (h - ih2 * scaleM) / 2;\r\n      ut();'
    
    new_init = 'var imgEl = document.getElementById(\'mapImg\');\r\n      var iw2 = imgEl ? imgEl.clientWidth : 0;\r\n      var ih2 = imgEl ? imgEl.clientHeight : 0;\r\n      if (iw2 > 0 && ih2 > 0) {\r\n        scaleM = 1.8;\r\n      } else {\r\n        scaleM = 1.8;\r\n      }\r\n      panX = (w - iw2 * 1.8) / 2;\r\n      panY = (h - ih2 * 1.8) / 2;\r\n      ut();'
    
    t = t.replace(old_init, new_init)
    
    old_reset = 'var imgEl = document.getElementById(\'mapImg\');\n    var iw2 = imgEl ? imgEl.clientWidth : 0;\n    var ih2 = imgEl ? imgEl.clientHeight : 0;\n    if (iw2 > 0 && ih2 > 0) {\n      var sx = w / iw2;\n      var sy = h / ih2;\n      s = Math.max(sx, sy);\n    } else {\n      s = 0.8;\n    }\n    if (s > 3) s = 3;\n    if (s < 0.3) s = 0.3;\n    scaleM = s;\n    panX = (w - iw2 * s) / 2;\n    panY = (h - ih2 * s) / 2;'
    
    new_reset = 'var imgEl = document.getElementById(\'mapImg\');\n    var iw2 = imgEl ? imgEl.clientWidth : 0;\n    var ih2 = imgEl ? imgEl.clientHeight : 0;\n    if (iw2 > 0 && ih2 > 0) {\n      s = 1.8;\n    } else {\n      s = 1.8;\n    }\n    scaleM = s;\n    panX = (w - iw2 * s) / 2;\n    panY = (h - ih2 * s) / 2;'
    
    t = t.replace(old_reset, new_reset)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: fixed scale=1.8')
