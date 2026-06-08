maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Update mobile CSS for ad-card (image now vertical)
    t = t.replace('body.touch-mobile .ad-card{width:160px;height:64px;left:6px;bottom:6px;padding:5px 8px}',
                  'body.touch-mobile .ad-card{width:110px;height:auto;left:6px;bottom:6px;padding:5px}')
    t = t.replace('body.touch-mobile .ad-card img{width:32px;height:32px}',
                  'body.touch-mobile .ad-card img{width:100%;height:auto}')
    t = t.replace('body.touch-mobile .ad-card .ad-text .ad-title{font-size:10px}',
                  'body.touch-mobile .ad-card .ad-text .ad-title{font-size:10px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}')
    t = t.replace('body.touch-mobile .ad-card .ad-text .ad-desc{font-size:8px}',
                  'body.touch-mobile .ad-card .ad-text .ad-desc{font-size:8px;max-width:90px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}')
    
    # Also update the hover close-btn positioning if it exists
    # Remove display:none from inline img style if present
    t = t.replace('style="display:none"', '')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: mobile CSS updated')
