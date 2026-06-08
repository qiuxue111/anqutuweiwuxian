import shutil
shutil.copy('G:/QQ/杂物/1780913986789.png', 'F:/暗区突围网站/assets/ads/ad-3x3.png')
print('Image copied')

maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Find the exact ad card HTML (first closing div after adCard)
    import re
    # Match from <div class="ad-card" ... </div>
    pattern = '<div class="ad-card" id="adCard">.*?</div>'
    # But need to capture 3 nested divs, use a different approach
    
    old = '''<div class="ad-card" id="adCard">
  <img src="" alt="" id="adImg" style="display:none">
  <div class="ad-text">
    <div class="ad-title" id="adTitle">广告位招租</div>
    <div class="ad-desc" id="adDesc">联系站长投放广告</div>
  </div>
</div>'''
    
    new = '''<div class="ad-card" id="adCard">
  <a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">
    <img src="../assets/ads/ad-3x3.png" alt="3x3代肝喵" id="adImg">
  </a>
  <div class="ad-text">
    <div class="ad-title" id="adTitle">3x3代肝喵</div>
    <div class="ad-desc" id="adDesc">点击这里喵</div>
  </div>
</div>'''
    
    count = t.count(old)
    if count > 0:
        t = t.replace(old, new)
        print(f'{m}: replaced {count} occurrence(s)')
    else:
        print(f'{m}: OLD not found, checking 3x3 variant...')
        # 3x3 might have id="adText" instead
        old3 = old.replace('id="adCard"', 'id="adCard"').replace('ad-text">', 'ad-text" id="adText">')
        # Actually old looks the same except ad-text with id
        old3 = '''<div class="ad-card" id="adCard">
  <img src="" alt="" id="adImg" style="display:none">
  <div class="ad-text" id="adText">
    <div class="ad-title" id="adTitle">广告位招租</div>
    <div class="ad-desc" id="adDesc">联系站长投放广告</div>
  </div>
</div>'''
        count3 = t.count(old3)
        if count3 > 0:
            new3 = old3.replace('广告位招租', '3x3代肝喵').replace('联系站长投放广告', '点击这里喵').replace('id="adImg" style="display:none"', 'id="adImg"').replace('src=""', 'src="../assets/ads/ad-3x3.png"').replace('<div class="ad-card"', '<div class="ad-card" id="adCard">\n  <a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">')
            # Actually simpler: just insert <a> tag and update fields
            new3 = '''<div class="ad-card" id="adCard">
  <a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">
    <img src="../assets/ads/ad-3x3.png" alt="3x3代肝喵" id="adImg">
  </a>
  <div class="ad-text" id="adText">
    <div class="ad-title" id="adTitle">3x3代肝喵</div>
    <div class="ad-desc" id="adDesc">点击这里喵</div>
  </div>
</div>'''
            t = t.replace(old3, new3)
            print(f'{m}: replaced 3x3 variant')
        else:
            # Show what's there
            idx = t.find('ad-card')
            start = t.rfind('<div', 0, idx)
            end = t.find('</div>', idx)
            for _ in range(3):
                end = t.find('</div>', end) + 6
            print(f'{m}: actual content:')
            print(repr(t[start:end]))
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
