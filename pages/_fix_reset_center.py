# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    old = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  if (img) {
    var iw = img.naturalWidth || img.width || 2000;
    var ih = img.naturalHeight || img.height || 2000;
    var s = 4;
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - ih * s) / 2;
  } else {
    scaleM = 4; panX = 0; panY = 0;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
}'''
    
    new_ = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  var s = 4;
  if (img) {
    var iw = img.naturalWidth || img.width || 2000;
    var ih = img.naturalHeight || img.height || 2000;
    // transform-origin:0 0 + translate(dx,dy) scale(s)
    // 图片缩放后左上角在 (panX, panY)，图片占据了 iw*s x ih*s 像素
    // 让图片中心居中：(panX + iw*s/2 = w/2) => panX = w/2 - iw*s/2
    scaleM = s;
    panX = w / 2 - (iw * s) / 2;
    panY = h / 2 - (ih * s) / 2;
  } else {
    scaleM = s; panX = w / 2 - (800 * s) / 2; panY = h / 2 - (600 * s) / 2;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
}'''
    
    if old in t:
        t = t.replace(old, new_)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: fixed')
    else:
        print(f'{m}: pattern not found')
