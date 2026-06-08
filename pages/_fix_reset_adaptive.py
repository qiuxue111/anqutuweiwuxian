# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace resetView with adaptive version: fit map to screen, centered
    old = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  var s = 1;
  if (img && img.complete && img.naturalWidth) {
    var iw = img.naturalWidth;
    s = Math.min(w / iw, 2.5);
    if (s < 0.8) s = 0.8;
    scaleM = s;
    panX = 0;
    panY = 0;
    if (iw * s < w) panX = (w - iw * s) / 2;
  } else {
    scaleM = 1; panX = 0; panY = 0;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+s+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(s*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(s*100)+'%';
}'''
    
    new_ = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  var s = 1;
  if (img && img.complete && img.naturalWidth) {
    var iw = img.naturalWidth;
    var ih = img.naturalHeight || iw;
    // 缩放：让地图撑满屏幕宽高（取较紧的边），不超过实际尺寸的2倍
    var sx = w / iw;
    var sy = h / ih;
    s = Math.min(sx, sy);
    if (s > 2) s = 2;
    if (s < 0.3) s = 0.3;
    scaleM = s;
    // 始终居中
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
  } else {
    scaleM = 1; panX = 0; panY = 0;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+s+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(s*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(s*100)+'%';
}'''
    
    if old in t:
        t = t.replace(old, new_)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: fixed adaptive resetView')
    else:
        print(f'{m}: old not found')
