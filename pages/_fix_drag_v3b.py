maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    old = 'adCard.addEventListener(\'click\',function(e){if(dragged){e.preventDefault();}});'
    new = 'setTimeout(function(){if(dragged){adCard.querySelector(\'a\').style.pointerEvents=\'none\';setTimeout(function(){adCard.querySelector(\'a\').style.pointerEvents=\'\';},300);}},0);'
    
    t = t.replace(old, new)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: updated')
