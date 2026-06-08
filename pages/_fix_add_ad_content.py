# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Replace ad-img
    old_img = '<img src="" alt="" id="adImg" style="display:none">'
    new_img = '<img src="../assets/ads/ad-3x3.png" alt="3x3代肝" id="adImg">'
    
    old_card = '''<div class="ad-card" id="adCard">

  <img src="" alt="" id="adImg" style="display:none">
  <div class="ad-text">
    <div class="ad-title" id="adTitle">广告位招租</div>
    <div class="ad-desc" id="adDesc">联系站长投放广告</div>
  </div>
</div>'''
    
    new_card = '''<div class="ad-card" id="adCard">

  <a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">
    <img src="../assets/ads/ad-3x3.png" alt="3x3代肝" id="adImg">
  </a>
  <div class="ad-text">
    <div class="ad-title" id="adTitle">3x3代肝喵</div>
    <div class="ad-desc" id="adDesc">点击这里喵</div>
  </div>
</div>'''
    
    t = t.replace(old_card, new_card)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: ad updated')
