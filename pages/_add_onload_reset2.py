# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Find the init block ending and add 10ms resetView
    marker = '// 如果屏幕宽度<768，给 body 加 mobile 类'
    
    if marker in t:
        idx = t.find(marker)
        # Find the })(); after it
        end = t.find('})();', idx) + 5
        # Insert before the })();
        insert = '  // 加载完成后复位居中\n  setTimeout(function(){ resetView(); }, 10);\n'
        t = t[:end-5] + insert + t[end-5:]
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        
        if 'setTimeout(function(){ resetView(); }, 10)' in t:
            print(f'{m}: added 10ms resetView')
        else:
            print(f'{m}: insertion failed')
    else:
        print(f'{m}: marker not found')
