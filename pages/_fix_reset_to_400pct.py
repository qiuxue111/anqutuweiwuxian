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
  if (img && img.naturalWidth) {
    // 手机端：缩放使地图宽度适应屏幕宽度
    var iw = img.naturalWidth || img.width || 2000;
    var s = Math.min(1, (w - 40) / iw);
    scaleM = s;
    panX = (w - iw * s) / 2;
    panY = (h - (img.naturalHeight || img.height || 2000) * s) / 2;
  } else {
    scaleM = 1; panX = 0; panY = 0;
  }
  var e=document.getElementById('mv');if(e)e.style.transform='translate('+panX+'px,'+panY+'px) scale('+scaleM+')';var zr=document.getElementById('zr');if(zr)zr.value=Math.round(scaleM*100);var zl=document.getElementById('zl');if(zl)zl.textContent=Math.round(scaleM*100)+'%';
}'''
    
    new_ = '''function resetView(){
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
    
    if old in t:
        t = t.replace(old, new_)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: fixed')
    else:
        print(f'{m}: old version not found, trying original simple version')
        # Maybe the resetView wasn't updated yet - try original
        old2 = 'function resetView(){scaleM=1;panX=0;panY=0;var e=document.getElementById(\'mv\');if(e)e.style.transform=\'translate(0px,0px) scale(1)\';var zr=document.getElementById(\'zr\');if(zr)zr.value=100;var zl=document.getElementById(\'zl\');if(zl)zl.textContent=\'100%\';}'
        if old2 in t:
            t = t.replace(old2, new_)
            with open(path, 'wb') as f:
                f.write(t.encode('utf-8'))
            print(f'{m}: fixed (original version)')
        else:
            # Show current version
            idx = t.find('function resetView')
            print(f'{m}: current at {idx}: {repr(t[idx:idx+400])}')
