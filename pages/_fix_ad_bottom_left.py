# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    import re
    
    # 1. Fix CSS: position to bottom-left
    css_match = re.search(r'\.ad-card\{[^}]*\}', t)
    if css_match:
        new_css = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:200px;height:80px;background:rgba(10,10,15,0.72);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border:1px solid rgba(255,255,255,0.08);border-radius:10px;cursor:pointer;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 12px;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none}'
        t = t[:css_match.start()] + new_css + t[css_match.end():]
    
    # 2. Fix JS: use left/bottom consistently for drag (no top/right)
    # The drag sets right='auto' and top='auto' when dragging - keep that
    # But the default tLeft/tBottom should use 12
    # Fix the drag handler: change right/top to left/bottom
    old_js = "card.style.right = 'auto';\n        card.style.top = 'auto';"
    new_js = "card.style.right = 'auto';\n        card.style.top = 'auto';"
    # Already correct, just verify the tLeft/tBottom defaults
    old_default = "tLeft = parseInt(card.style.left) || parseInt(card.getAttribute('data-left')) || 12;\n    tBottom = parseInt(card.style.bottom) || parseInt(card.getAttribute('data-bottom')) || 12;"
    new_default = "tLeft = parseInt(card.style.left) || parseInt(card.getAttribute('data-left')) || 12;\n    tBottom = parseInt(card.style.bottom) || parseInt(card.getAttribute('data-bottom')) || 12;"
    # Already correct
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    print(f'{m}: CSS fixed')
