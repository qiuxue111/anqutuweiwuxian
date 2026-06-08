# -*- coding: utf-8 -*-
"""把6地图页面的 .ad-card z-index 从 99998 改为 99990（在汉堡菜单 99999 和菜单 99998 之下）"""
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # z-index:99998 in ad-card block
    old = 'z-index:99998;'
    new = 'z-index:99990;'
    count = t.count(old)
    t = t.replace(old, new)
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: changed {count} z-index')
