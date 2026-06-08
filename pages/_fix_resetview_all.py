# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # ResetView always looks like:
    # function resetView(){
    #   var w = window.innerWidth;
    #   var h = window.innerHeight;
    #   var iw = \d+;
    #   var ih = \d+;
    #   var s = 1;
    #   if (w > 0) {
    #     s = h / ih;
    #     if (s > 3) s = 3;
    #     if (s < 0.5) s = 0.5;
    #     scaleM = s;
    #     panX = (w - iw * s) / 2;
    #     panY = (h - ih * s) / 2;
    #   } else {
    #     scaleM = 1; panX = 0; panY = 0;
    #   }
    #   var e=document.getElementById(...)
    # }
    
    # Find function resetView() { ... }
    import re
    idx = t.find('function resetView(){')
    if idx < 0:
        print(f'{m}: resetView not found')
        continue
    
    # Find the closing } of the resetView function
    # It's the 4th } after the start (function {}, if {}, else {}, and the function's })
    func_body = t[idx:]
    # Find matching braces
    brace_count = 0
    end_idx = 0
    for i, c in enumerate(func_body):
        if c == '{':
            brace_count += 1
        elif c == '}':
            brace_count -= 1
            if brace_count == 0:
                end_idx = idx + i + 1
                break
    
    old_func = t[idx:end_idx]
    
    new_func = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var s = 1;
  if (w > 0) {
    var imgEl = document.getElementById('mapImg');
    var iw = imgEl ? imgEl.clientWidth : 0;
    var ih = imgEl ? imgEl.clientHeight : 0;
    if (iw > 0 && ih > 0) {
      var sx = w / iw;
      var sy = h / ih;
      s = Math.max(sx, sy);
    } else {
      s = 0.8;
    }
    if (s > 3) s = 3;
    if (s < 0.3) s = 0.3;
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
  } else {
    scaleM = 1; panX = 0; panY = 0;
  }
  var e=document.getElementById('zr');
  if(e)e.value=Math.round(s*100);
  // 强制重新加载图片缓存（开发调试用）
  console.log('resetView: scale='+s+' panX='+panX+' panY='+panY);
}'''
    
    t = t[:idx] + new_func + t[end_idx:]
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: resetView fully replaced')
