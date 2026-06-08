maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Remove ALL old title/desc rules, then inject the bold ones
    import re
    
    # Remove any .ad-card .ad-title rule that's NOT the new one
    old_title = '.ad-card .ad-title{color:#eee;font-size:12px;font-weight:600;line-height:1.3;margin-bottom:2px}'
    t = t.replace(old_title, '')
    
    # Remove old .ad-card .ad-desc if not bold version
    old_desc = '.ad-card .ad-desc{color:#888;font-size:10px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}'
    t = t.replace(old_desc, '')
    
    # Now ensure the bold versions exist
    bold_title = '.ad-card .ad-title{color:#fff;font-weight:900;font-size:15px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    bold_desc = '.ad-card .ad-desc{color:#fff;font-weight:800;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    
    if bold_title not in t:
        # Insert before ad-close-btn rule
        t = t.replace('.ad-close-btn{position:absolute', bold_title + '\n' + bold_desc + '\n.ad-close-btn{position:absolute')
        print(f'{m}: inserted bold rules')
    else:
        print(f'{m}: bold rules already present')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
