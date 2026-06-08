maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # The JS at the end creates a dynamic closeBtn with className 'ad-close-btn'
    # We already have it in HTML, so skip the dynamic creation
    old_js = '''  var closeBtn = document.createElement('span');
  closeBtn.className = 'ad-close-btn';
  closeBtn.textContent = '\u00d7';
  closeBtn.style.cssText = 'position:absolute;top:2px;right:4px;font-size:11px;color:#888;cursor:pointer;z-index:99999;line-height:1;padding:0 3px;font-family:sans-serif';
  closeBtn.onclick = function(e) {
    e.stopPropagation(); e.preventDefault();
    adCard.style.display = 'none';
  };
  card.appendChild(closeBtn);'''
    
    new_js = '''  // close button already in HTML, skip dynamic creation'''
    
    if old_js in t:
        t = t.replace(old_js, new_js)
        print(f'{m}: removed dynamic closeBtn creation')
    else:
        # Try without escaped
        old_js2 = '''  var closeBtn = document.createElement('span');
  closeBtn.className = 'ad-close-btn';
  closeBtn.textContent = '×';
  closeBtn.style.cssText = 'position:absolute;top:2px;right:4px;font-size:11px;color:#888;cursor:pointer;z-index:99999;line-height:1;padding:0 3px;font-family:sans-serif';
  closeBtn.onclick = function(e) {
    e.stopPropagation(); e.preventDefault();
    adCard.style.display = 'none';
  };
  card.appendChild(closeBtn);'''
        if old_js2 in t:
            t = t.replace(old_js2, new_js)
            print(f'{m}: removed dynamic closeBtn (unescaped)')
        else:
            print(f'{m}: dynamic closeBtn not found, checking...')
            import re
            for m2 in re.finditer('closeBtn.*ad-close-btn', t):
                print(f'  found at {m2.start()}: {t[m2.start():m2.start()+80]}')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)

