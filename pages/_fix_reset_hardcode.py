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
    // 缩放使地图内容刚好填满屏幕宽度的80%，居中显示
    var scaleX = (w * 0.8) / iw;
    var scaleY = (h * 0.8) / ih;
    var s = Math.min(scaleX, scaleY, 2);
    scaleM = s;
    panX = w / (2 * s) - iw / 2;
    panY = h / (2 * s) - ih / 2;
  } else {
    scaleM = 1; panX = 1; panY = 1;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
}'''
    
    new_ = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  scaleM = 1.58;
  panX = -418;
  panY = -44;
  var s = scaleM;
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+s+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(s*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(s*100)+'%';
}'''
    
    if old in t:
        t = t.replace(old, new_)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: hardcoded farm values')
    else:
        print(f'{m}: pattern mismatch, searching...')
        idx = t.find('function resetView')
        if idx >= 0:
            print(f'  Found at {idx}: {t[idx:idx+100]}')
