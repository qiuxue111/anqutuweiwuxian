# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # JS is setting display:none via sessionStorage - let's also check if startDrag blocks both mousedown and click
    # Actually, the issue: startDrag has e.preventDefault() which PREVENTS click from propagating
    # And card.addEventListener('click', function(e){ if (tMoved) { e.stopPropagation(); } })
    # That means if tMoved is false (no dragging), the click event isn't stopped, so window.open fires
    
    # The real problem might be: z-index:99999 is same as hamburger! Let me change to 99997
    # But why can't we see it at all?
    
    # Try: add direct inline style to HTML
    # Find: class="ad-card" id="adCard"
    old_html = '<div class="ad-card" id="adCard">'
    new_html = '<div class="ad-card" id="adCard" style="display:flex!important;top:12px;left:12px!important;z-index:99999!important;background:red!important;border:3px solid yellow!important">'
    
    count = t.count(old_html)
    if count:
        t = t.replace(old_html, new_html)
        # Also check if there's a conflicting rule
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
    
    print(f'{m}: {count} HTML replacements')
