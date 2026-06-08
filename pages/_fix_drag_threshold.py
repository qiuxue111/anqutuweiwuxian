maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    old = 'if(adDist>5)e.preventDefault();'
    new = 'if(adDist>10)e.preventDefault();'
    t = t.replace(old, new)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: threshold 10px')
