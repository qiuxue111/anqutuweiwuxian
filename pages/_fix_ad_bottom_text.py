maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Move text to bottom center, with black semi-transparent background bar
    # Title: font-weight: 700 (bold)
    # Desc: font-weight: 500 (medium)
    
    # Update .ad-card .ad-text: bottom center overlay
    old_text = '.ad-card .ad-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:2;width:90%}'
    new_text = '.ad-card .ad-text{position:absolute;bottom:0;left:0;width:100%;text-align:center;pointer-events:none;z-index:2;padding:8px 6px;box-sizing:border-box;background:linear-gradient(transparent,rgba(0,0,0,0.7))}'
    t = t.replace(old_text, new_text)
    
    # Update title
    old_title = '.ad-card .ad-title{color:#fff;font-weight:900!important;font-size:15px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    new_title = '.ad-card .ad-title{color:#fff;font-weight:700;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    t = t.replace(old_title, new_title)
    
    # Update desc
    old_desc = '.ad-card .ad-desc{color:#fff;font-weight:800!important;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    new_desc = '.ad-card .ad-desc{color:#fff;font-weight:500;font-size:11px;margin-top:2px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    t = t.replace(old_desc, new_desc)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: bottom centered text')
