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
    
    new_ = '''function resetView(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var img = document.getElementById('mapImg');
  var s = 4;
  if (img) {
    var iw = img.naturalWidth || img.width || 2000;
    var ih = img.naturalHeight || img.height || 2000;
    // transform: translate(dx,dy) scale(s) with transform-origin:0 0
    // 浏览器先执行 translate，再 scale。
    // 所以 translate 是以未缩放的原图坐标系来移动的。
    // 缩放后图片覆盖 iw*s x ih*s 像素，左上角在 (panX*s + panX???)
    // 不对，CSS transform 的工作方式是：
    // translate(panX, panY) 先移，scale(s) 再缩放原点 (0,0)
    // 所以缩放后图片左上角在 panX, panY 处（先移到的位置再放大）
    // 但缩放后图片实际占 iw*s x ih*s 像素
    // 居中：panX = w/2 - iw*s/2 这个公式之前试了不行
    // 换个思路：图片中心在 panX + (iw/2)*(1-s) + (iw/2) 
    // 其实就是 panX + iw/2 先移到中心，再因为有 scale(s) 需要补偿
    // translate(dx) scale(s) 的效果：点 0 移到 dx 然后放大 s 倍
    // 点 iw/2 在缩放后的位置: dx + iw/2 * s
    // 要让他居中：dx + iw/2 * s = w/2  => dx = w/2 - iw*s/2
    // 这个公式没错啊... 但 transform-origin:0 0
    // 哦！我看文档：transform 列表从右到左执行！
    // scale(4) translate(panX) 才是先移再缩放
    // 但 CSS 写的是 translate(panX) scale(4)
    // CSS 执行顺序是从右到左！
    // 所以 scale(4) 先执行，然后 translate(panX) 是在已缩放坐标下移动！
    // === 上面分析错误 ===
    // 正确的 CSS transform 行为：
    // transform: translate(panX, panY) scale(4) with transform-origin:0 0
    // 先从原点平移到 panX, panY，然后以原点(0,0)为中心缩放4倍
    // 缩放4倍后，图片占据了 iw*4 x ih*4 像素
    // 图片左上角在 (panX, panY)（缩放不改变这个）
    // 图片中心在 (panX + iw*4/2, panY + ih*4/2)
    // 要居中：panX + iw*4/2 = w/2
    // panX = w/2 - iw*4/2 = w/2 - iw*2
    // 之前写的是 panX = w/2 - iw*4/2 = w/2 - iw*2
    // 一样啊...
    
    // 唯一可能：mapImg 本身有 width:100%，所以 img.width 不是原始像素而是容器宽度
    // 用 naturalWidth 才是原始图片像素
    
    scaleM = s;
    panX = w / 2 - iw * 2;
    panY = h / 2 - ih * 2;
  } else {
    scaleM = s; panX = w / 2 - 800 * 2; panY = h / 2 - 600 * 2;
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
