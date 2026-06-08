maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Update desktop ad-card CSS: image fills card, white text with black stroke on top, red X close btn
    # Remove .ad-text from absolute bottom, put it as overlay
    old_desktop = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:180px;height:240px;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;overflow:hidden;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}.ad-card a{display:block;width:100%;height:calc(100% - 48px);overflow:hidden;position:relative}.ad-card img{width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}.ad-card .ad-text{position:absolute;bottom:0;left:0;width:100%;height:48px;background:rgba(0,0,0,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px;box-sizing:border-box}'
    new_desktop = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:180px;height:240px;border-radius:10px;cursor:pointer;overflow:hidden;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none;border:1px solid rgba(255,255,255,0.08);position:relative}.ad-card a{display:block;width:100%;height:100%;overflow:hidden}.ad-card img{width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}.ad-card .ad-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:2;width:90%}.ad-card .ad-title{color:#fff;font-weight:700;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}.ad-card .ad-desc{color:#fff;font-weight:600;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}.ad-close-btn{position:absolute;top:6px;right:6px;width:24px;height:24px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0}.ad-card:hover .ad-close-btn{opacity:1}.ad-close-btn:hover{transform:scale(1.15);background:rgba(255,30,30,1)}'
    
    t = t.replace(old_desktop, new_desktop)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: text overlay + red X')
