# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Fix init block: replace hardcoded iw/ih with clientWidth/clientHeight
    # Pattern: var iw = \d+;\n      var ih = \d+;\n      var sx = w / iw;\n      var sy = h / ih;\n      scaleM = Math.max(sx, sy);
    import re
    
    # Find and replace the hardcoded init block
    old_init = re.search(r'var iw = \d+;\r\n      var ih = \d+;\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math\.max\(sx, sy\);', t)
    if old_init:
        new_init = 'var imgEl = document.getElementById(\'mapImg\');\r\n      var iw = imgEl ? imgEl.clientWidth : 0;\r\n      var ih = imgEl ? imgEl.clientHeight : 0;\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);'
        t = t[:old_init.start()] + new_init + t[old_init.end():]
        print(f'{m}: init block fixed')
    
    # Fix resetView: replace hardcoded iw/ih   
    # Find function resetView, then the iw/ih inside it
    # Pattern:   var iw = \d+;\n  var ih = \d+;\n  var s = 1;
    old_reset = re.search(r'(function resetView\(\)\{[^}]*?  var iw = )\d+(;\n  var ih = )\d+(;\n  var s = 1;)', t, re.DOTALL)
    if old_reset:
        new_reset = old_reset.group(1) + '0' + old_reset.group(2) + '0' + old_reset.group(3)
        t = t[:old_reset.start()] + new_reset + t[old_reset.end():]
        # Now replace the resetView logic to use img.clientWidth
        # Find:   var sx = w / iw;\n    var sy = h / ih;\n    s = Math.max(sx, sy);
        # Prepend with img element get
        old_logic = '    var sx = w / iw;\n    var sy = h / ih;\n    s = Math.max(sx, sy);'
        new_logic = '    var imgEl = document.getElementById(\'mapImg\');\n    var iw = imgEl ? imgEl.clientWidth : 0;\n    var ih = imgEl ? imgEl.clientHeight : 0;\n    var sx = w / iw;\n    var sy = h / ih;\n    s = Math.max(sx, sy);'
        if old_logic in t:
            t = t.replace(old_logic, new_logic)
        
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: resetView fixed')
    else:
        print(f'{m}: old reset pattern not found')
        # Print what we see around resetView
        idx = t.find('function resetView')
        if idx >= 0:
            print(f'  resetView starts: {t[idx:idx+200]}')
