# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Just use the simplest possible reset: scale=1, centered
    old_init_end = 'panY = (h - ih * scaleM) / 2;\r\n      ut();'
    # Just leave it as max+center - should be correct
    
    # Actually let me check - maybe the issue is that mapImg has width:100%
    # and the mv container is NOT the full image size
    # The mv has position:relative but no width/height set
    # img width:100% means 100% of mv, which is 100% of viewport? No, mv needs a width
    
    # TRY: just set scaleM = 1 and panX=panY=0 for testing
    old_init = 'var iw = 6942;\r\n      var ih = 2872;\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    new_init = 'var iw = 6942;\r\n      var ih = 2872;\r\n      scaleM = 0.5;\r\n      panX = (w - iw * 0.5) / 2;\r\n      panY = (h - ih * 0.5) / 2;\r\n      ut();'
    t = t.replace(old_init, new_init)
    
    # resetView
    old_reset = '    var sx = w / iw;\n    var sy = h / ih;\n    s = Math.max(sx, sy);\n    if (s > 3) s = 3;\n    if (s < 0.3) s = 0.3;\n    scaleM = s;\n    panX = (w - iw * s) / 2;\n    panY = (h - ih * s) / 2;'
    new_reset = '    s = 0.5;\n    scaleM = s;\n    panX = (w - iw * s) / 2;\n    panY = (h - ih * s) / 2;'
    t = t.replace(old_reset, new_reset)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: scale=0.5 centered')
