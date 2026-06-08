# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
real_dims = {
    'map-farm': [6942, 2872],
    'map-valley': [7510, 4454],
    'map-beishan': [7566, 4588],
    'map-tvstation': [4000, 4000],
    'map-armory': [4000, 4000],
    'map-airport': [5000, 5000],
}
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    iw, ih = real_dims[m]
    
    # Use min(sx, sy) so full map is visible, centered
    old_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    
    new_init = f'var iw = {iw};\r\n      var ih = {ih};\r\n      var sx = w / iw;\r\n      var sy = h / ih;\r\n      scaleM = Math.max(sx, sy);\r\n      if (scaleM > 3) scaleM = 3;\r\n      if (scaleM < 0.3) scaleM = 0.3;\r\n      panX = (w - iw * scaleM) / 2;\r\n      panY = (h - ih * scaleM) / 2;\r\n      ut();'
    # Keep max, it was right
    
    t = t.replace(old_init, new_init)
    
    # Fix init: just keep current but ensure panY is correct
    # Actually the issue is: with max(sx,sy), on 2K farm: sx=0.369, sy=0.501, selects 0.501
    # Map: 6942*0.501=3478 wide, 2872*0.501=1440 tall. Height fills, width overflows 918px.
    # panY = (1440-1440)/2 = 0. Map top is at screen top.
    # Wait, this is WRONG. On 2K 2560x1440: 
    # sx = 2560/6942 = 0.369
    # sy = 1440/2872 = 0.501
    # Math.max = 0.501
    # iw*s = 6942*0.501 = 3478
    # ih*s = 2872*0.501 = 1440
    # panX = (2560-3478)/2 = -459 (shifted 459px left)
    # panY = (1440-1440)/2 = 0
    # So map left 459px off-screen, right 3478-2560-459 = 459px off-screen
    # TOP is at 0, bottom at 1440. Map fills vertically perfectly.
    # There should be NO凹字型
    
    # Unless... the img tag has width:100% CSS which changes things
    # In the browser, img width=100% means naturalWidth/CSS dimensions are different
    # But we're using hardcoded pixel dims, not img.width
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: no change (already max+center)')
