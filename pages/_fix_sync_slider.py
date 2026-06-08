# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Add slider sync: after resetView sets scaleM, update the slider value
    old_reset_close = 'scaleM = s;\n    panX = (w - iw2 * s) / 2;\n    panY = (h - ih2 * s) / 2;'
    new_reset_close = 'scaleM = s;\n    panX = (w - iw2 * s) / 2;\n    panY = (h - ih2 * s) / 2;\n    var zr = document.getElementById(\'zr\');\n    if (zr) zr.value = Math.round(s * 100);'
    t = t.replace(old_reset_close, new_reset_close)
    
    # Also update init block - after ut(), sync slider
    old_init_close = 'panY = (h - ih2 * 1.8) / 2;\r\n      ut();'
    new_init_close = 'panY = (h - ih2 * 1.8) / 2;\r\n      ut();\r\n      var zr = document.getElementById(\'zr\');\r\n      if (zr) zr.value = 180;'
    t = t.replace(old_init_close, new_init_close)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: synced slider')
