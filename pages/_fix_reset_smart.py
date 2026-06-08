# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Each map has different ideal values based on its dimensions
    # For farm: translate(-418px, -44px) scale(1.58026)
    # Let's just use the formula that gives the same result
    # -418 = w/2s - iw/2, s=1.58026
    # For w=1920: iw = 2*(1920/3.16052 + 418) = 2*(607.5+418) = 2051
    # So the old formula gives these values when naturalWidth=2051
    # We can't magic-number because screen size varies
    
    # Actually the simplest: save the manual adjustment as "defaultPositions"
    # But let me first check what values actually work on farm
    
    old = '''function resetView(){
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
    
    new_ = '''function resetView(){
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
    
    if old in t:
        t = t.replace(old, new_)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: auto-calc scale')
    else:
        print(f'{m}: pattern not found')
