maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Remove text-stroke, keep text-shadow for darkness, use font-weight:900
    old_title = '.ad-card .ad-title{color:#fff;font-weight:900;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    new_title = '.ad-card .ad-title{color:#fff;font-weight:900;font-size:14px;text-shadow:0 0 6px #000,0 0 12px #000,2px 2px 4px #000}'
    t = t.replace(old_title, new_title)
    
    old_desc = '.ad-card .ad-desc{color:#fff;font-weight:900;font-size:11px;margin-top:2px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    new_desc = '.ad-card .ad-desc{color:#fff;font-weight:900;font-size:11px;margin-top:2px;text-shadow:0 0 6px #000,0 0 12px #000,2px 2px 4px #000}'
    t = t.replace(old_desc, new_desc)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: removed text-stroke')
