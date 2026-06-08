maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Bolder text
    t = t.replace('.ad-card .ad-title{color:#fff;font-weight:700;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}',
                  '.ad-card .ad-title{color:#fff;font-weight:900;font-size:15px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}')
    t = t.replace('.ad-card .ad-desc{color:#fff;font-weight:600;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}',
                  '.ad-card .ad-desc{color:#fff;font-weight:800;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: bolder text')
