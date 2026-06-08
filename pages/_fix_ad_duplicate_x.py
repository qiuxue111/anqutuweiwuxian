maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']

for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    ### Problem 1: Map pages have 2 close buttons (HTML one + JS-generated one)
    # The JS finds closeBtn by looking for 'ad-close-btn', which conflicts with our new CSS class
    # Solution: remove old JS that creates closeBtn for the preview (it says 'Close' not '×')
    # Alternatively, rename our CSS class to avoid conflict
    
    # Actually the JS creates a button with text 'Close' for the container preview popup
    # That's unrelated to ad-card. The 'ad-close-btn' in JS is just a className search.
    # Need to find it and rename or remove that JS.
    
    # Find the JS that creates closeBtn and renames it
    old_js = '''  var closeBtn=document.createElement('button');
  closeBtn.textContent='Close';
  closeBtn.style.cssText='margin-top:8px;padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#ccc;cursor:pointer';
  closeBtn.onclick=function(){document.getElementById('pinPreview').style.display='none';};'''
    
    new_js = '''  var closeBtn2=document.createElement('button');
  closeBtn2.textContent='Close';
  closeBtn2.style.cssText='margin-top:8px;padding:6px 12px;background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:6px;color:#ccc;cursor:pointer';
  closeBtn2.onclick=function(){document.getElementById('pinPreview').style.display='none';};'''
    
    if old_js in t:
        t = t.replace(old_js, new_js)
        print(f'{m}: renamed preview closeBtn')
    
    # Also fix any appendChild that uses closeBtn
    old_append = 'lp.appendChild(closeBtn);'
    new_append = 'lp.appendChild(closeBtn2);'
    if old_append in t:
        t = t.replace(old_append, new_append)
        print(f'{m}: fixed append child')
    
    ### Problem 2: 3x3 has <a id="adLink"> without href
    # Fix: restore href on the a tag
    old_a = '<a id="adLink">'
    new_a = '<a href="https://qm.qq.com/q/YWswLAYuoU" target="_blank">'
    if old_a in t:
        t = t.replace(old_a, new_a)
        print(f'{m}: restored a href')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)

