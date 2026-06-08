# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # After the (function(){...})() block that does initial scale, add a 10ms resetView call
    # Find: });  // 如果屏幕宽度<768
    marker = '  // 如果屏幕宽度<768，给 body 加 mobile 类'
    
    if marker in t:
        # Add a 10ms delayed resetView
        after = '\n  // 加载完成后复位居中\n  setTimeout(function(){ resetView(); }, 10);\n'
        t = t.replace(marker + '\n    document.body.classList.add(\'touch-mobile\');\n  }\n})();', marker + '\n    document.body.classList.add(\'touch-mobile\');\n  }\n' + after + '})();')
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    
    # Verify
    if 'setTimeout(function(){ resetView(); }, 10)' in t:
        print(f'{m}: added 10ms resetView')
    else:
        print(f'{m}: something wrong')
