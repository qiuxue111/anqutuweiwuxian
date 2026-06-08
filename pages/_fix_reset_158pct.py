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
  var s = 2;
  if (img) {
    var iw = img.naturalWidth || img.width || 2000;
    var ih = img.naturalHeight || img.height || 2000;
    scaleM = s;
    panX = w / (2 * s) - iw / 2;
    panY = h / (2 * s) - ih / 2;
  } else {
    scaleM = s; panX = w / (2 * s) - 400; panY = h / (2 * s) - 300;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
}'''
    
    new_ = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  var s = 1.58;
  if (img) {
    var iw = img.naturalWidth || img.width || 2000;
    var ih = img.naturalHeight || img.height || 2000;
    scaleM = s;
    panX = w / (2 * s) - iw / 2;
    panY = h / (2 * s) - ih / 2;
  } else {
    scaleM = s; panX = w / (2 * s) - 400; panY = h / (2 * s) - 300;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
}'''
    
    if old in t:
        t = t.replace(old, new_)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: s=2 -> s=1.58')
    else:
        print(f'{m}: pattern not found')
