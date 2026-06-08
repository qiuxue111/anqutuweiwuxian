# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # The problem: outer IIFE checks isTouchDevice and returns early on PC
    # Inner IIFE (init scaling) only runs on touch devices
    # We need to move the init outside the touch check
    
    # Find the start of the inner IIFE that does the init scaling
    # Pattern: (function(){\n    var w = window.innerWidth, h = window.innerHeight;\n    var img = document.getElementById('mapImg');
    import re
    
    inner_iife = re.search(r'\(function\(\)\{\r\n    var w = window\.innerWidth, h = window\.innerHeight;\r\n    var img = document\.getElementById\(\'mapImg\'\);', t)
    if not inner_iife:
        # Try LF version
        inner_iife = re.search(r'\(function\(\)\{\n    var w = window\.innerWidth, h = window\.innerHeight;\n    var img = document\.getElementById\(\'mapImg\'\);', t)
    
    if inner_iife:
        # Find the entire inner IIFE (find matching braces)
        start = inner_iife.start() - 1  # include the (
        # Count from start to find the matching })
        brace_count = 0
        i = start
        while i < len(t):
            if t[i] == '(':
                brace_count += 1
            elif t[i] == ')':
                brace_count -= 1
            elif t[i] == '{':
                pass
            elif t[i] == '}':
                pass
            i += 1
            if brace_count == 0 and t[i-1] == ')':
                # Found the end: )();
                end = i
                break
        
        # Actually simpler: find the last )(); after this block
        inner = t[start:]
        end = start + inner.find(')();') + 4
        
        inner_block = t[start:end]
        
        # Wrap it in a new IIFE that runs unconditionally 
        new_block = '''(function(){
  var w = window.innerWidth, h = window.innerHeight;
  var img = document.getElementById('mapImg');
  if (!img) { setTimeout(arguments.callee, 200); return; }
  if (img.complete && img.naturalWidth) {
    var imgEl = document.getElementById('mapImg');
    var iw = imgEl ? imgEl.clientWidth : 0;
    var ih = imgEl ? imgEl.clientHeight : 0;
    if (iw > 0 && ih > 0) {
      var sx = w / iw;
      var sy = h / ih;
      var scaleM2 = Math.max(sx, sy);
    } else {
      var scaleM2 = 0.8;
    }
    if (scaleM2 > 3) scaleM2 = 3;
    if (scaleM2 < 0.3) scaleM2 = 0.3;
    scaleM = scaleM2;
    panX = (w - iw * scaleM) / 2;
    panY = (h - ih * scaleM) / 2;
    ut();
    var zr = document.getElementById('zr');
    if (zr) zr.value = Math.round(scaleM * 100);
  } else {
    setTimeout(arguments.callee, 200);
  }
})();'''
        
        t = t[:start] + new_block + t[end:]
        print(f'{m}: replaced init block')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
