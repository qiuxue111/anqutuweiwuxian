# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # The initial load block is:
    # var iw = img.naturalWidth || img.clientWidth;
    # var ratio = w / iw;
    # scaleM = Math.min(ratio, 2.5);
    # if (scaleM < 0.8) scaleM = 0.8;
    # // 如果地图较窄，水平居中
    # var mvEl = document.getElementById('mv');
    # if (mvEl && iw * scaleM < w) {
    #   panX = (w - iw * scaleM) / 2;
    # }
    # ut();
    
    # Match as raw strings (with actual whitespace and line breaks)
    old = '''      var iw = img.naturalWidth || img.clientWidth;
      var ratio = w / iw;
      scaleM = Math.min(ratio, 2.5);
      if (scaleM < 0.8) scaleM = 0.8;
      // 如果地图较窄，水平居中
      var mvEl = document.getElementById('mv');
      if (mvEl && iw * scaleM < w) {
        panX = (w - iw * scaleM) / 2;
      }
      ut();'''
    
    new = '''      var iw = img.naturalWidth || img.clientWidth || 2000;
      var ih = img.naturalHeight || iw;
      var sx = w / iw;
      var sy = h / ih;
      scaleM = Math.min(sx, sy);
      if (scaleM > 2) scaleM = 2;
      if (scaleM < 0.3) scaleM = 0.3;
      panX = (w - iw * scaleM) / 2;
      panY = (h - ih * scaleM) / 2;
      ut();'''
    
    count = t.count(old)
    if count > 0:
        t = t.replace(old, new)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: replaced {count}x')
    else:
        print(f'{m}: old not found (trying different indent)')
        # Show actual text around the area
        idx = t.find('var iw = img.naturalWidth')
        if idx > 0:
            print(repr(t[idx:idx+350]))
