# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Use the img clientWidth/clientHeight which reflects actual rendering (accounting for width:100%)
    old_init = 'scaleM = 0.5;\r\n      panX = (w - iw * 0.5) / 2;\r\n      panY = (h - ih * 0.5) / 2;\r\n      ut();'
    new_init = 'var imgEl = document.getElementById(\'mapImg\');\r\n      var iw2 = imgEl ? imgEl.clientWidth : 0;\r\n      if (iw2 > 0) { scaleM = w / iw2; } else { scaleM = 0.8; }\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw2 * scaleM) / 2;\r\n      panY = 0;\r\n      ut();'
    t = t.replace(old_init, new_init)
    
    # resetView
    old_reset = 's = 0.5;\n    scaleM = s;\n    panX = (w - iw * s) / 2;\n    panY = (h - ih * s) / 2;'
    new_reset = 'var imgEl = document.getElementById(\'mapImg\');\n    var iw2 = imgEl ? imgEl.clientWidth : 0;\n    if (iw2 > 0) { s = w / iw2; } else { s = 0.8; }\n    if (s > 3) s = 3;\n    if (s < 0.3) s = 0.3;\n    scaleM = s;\n    panX = (w - iw2 * s) / 2;\n    panY = 0;'
    t = t.replace(old_reset, new_reset)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: use clientWidth for fill')
