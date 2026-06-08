# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # 1. Remove old ad card HTML + script from body tail
    old_block = '<!-- 广告卡片 --><div class="ad-card" id="adCard">'
    idx = t.find(old_block)
    if idx < 0:
        idx = t.find('<!-- 广告卡片 -->')
    
    if idx >= 0:
        # Find the end of the associated script
        end = t.find('})();', idx) + 6
        # Go to the next </script> if any
        end2 = t.find('</script>', end)
        if end2 > 0 and end2 - end < 10:
            end = end2 + 9
        
        # Remove old ad section
        t = t[:idx] + t[end:]
    
    # 2. Insert ad HTML right after hamburger
    ad_html = '''<!-- 广告卡片 -->
<div class="ad-card" id="adCard">
  <img src="" alt="" id="adImg" style="display:none">
  <div class="ad-text">
    <div class="ad-title" id="adTitle">广告位招租</div>
    <div class="ad-desc" id="adDesc">联系站长投放广告</div>
  </div>
</div>'''
    
    # Find hamburger div
    hb_idx = t.find('class="hamburger" id="hamburger"')
    hb_end = t.find('</div>', hb_idx) + 6
    t = t[:hb_end] + '\n' + ad_html + t[hb_end:]
    
    # 3. Remove old ad script (if still there) and inject at right place
    # The old ad script might still be in the file - remove any duplicate
    import re
    old_scripts = list(re.finditer(r'<script>\(function\(\)\{\s*var card = document\.getElementById\(\'adCard\'\)', t))
    # Keep only the one that should be there (the first one after our HTML)
    for match in old_scripts[1:]:
        # Remove this duplicate script
        si = match.start() - 8  # < need to match <script>
        if t[si:si+8] == '<script>':
            ei = t.find('</script>', match.end()) + 9
            t = t[:si] + t[ei:]
    
    # Also find the ad script that's in a different location and remove it
    # Actually, just find all card.addEventListener patterns for ad card and deduplicate
    
    # 4. Add ad script right before </body>
    ad_script = '''<script>(function(){
  var card = document.getElementById('adCard');
  if (!card) return;
  var isDragging = false, tMoved = false;
  var tStartX = 0, tStartY = 0, tLeft = 0, tBottom = 0;
  var mm = null, mu = null;
  var AD_LINK = 'https://example.com';
  /* ad card always visible */
  var adImg = document.getElementById('adImg');
  if (adImg) {
    adImg.onerror = function() { this.style.display = 'none'; };
    if (adImg.getAttribute('src') && adImg.getAttribute('src') !== '') {
      adImg.style.display = 'block';
    }
  }
  function startDrag(e) {
    if (e.target.closest('.ad-close-btn')) return;
    isDragging = false; tMoved = false;
    tStartX = e.clientX || (e.touches && e.touches[0].clientX);
    tStartY = e.clientY || (e.touches && e.touches[0].clientY);
    tLeft = parseInt(card.style.left) || parseInt(card.getAttribute('data-left')) || 12;
    tBottom = parseInt(card.style.bottom) || parseInt(card.getAttribute('data-bottom')) || 12;
    mm = function(ev) {
      var cx = ev.clientX || (ev.touches && ev.touches[0].clientX);
      var cy = ev.clientY || (ev.touches && ev.touches[0].clientY);
      if (!cx && cx !== 0) return;
      var dx = cx - tStartX, dy = cy - tStartY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) { isDragging = true; tMoved = true; }
      if (isDragging) {
        card.style.left = (tLeft + dx) + 'px';
        card.style.bottom = (tBottom - dy) + 'px';
        card.style.right = 'auto';
        card.style.top = 'auto';
      }
    };
    mu = function() {
      document.removeEventListener('mousemove', mm);
      document.removeEventListener('mouseup', mu);
      card.removeEventListener('touchmove', mm);
      card.removeEventListener('touchend', mu);
      if (isDragging) {
        card.setAttribute('data-left', parseInt(card.style.left) || tLeft);
        card.setAttribute('data-bottom', parseInt(card.style.bottom) || tBottom);
      }
      if (!tMoved) {
        window.open(AD_LINK, '_blank');
        tMoved = true;
      }
      isDragging = false;
    };
    if (e.type === 'mousedown' && e.button === 0) {
      document.addEventListener('mousemove', mm);
      document.addEventListener('mouseup', mu);
    } else if (e.type === 'touchstart') {
      card.addEventListener('touchmove', mm, {passive:false});
      card.addEventListener('touchend', mu, {passive:true});
    }
    e.preventDefault();
  }
  card.addEventListener('mousedown', startDrag);
  card.addEventListener('touchstart', startDrag, {passive:false});
  card.addEventListener('click', function(e){ if (tMoved) { e.stopPropagation(); } });
  var closeBtn = document.createElement('span');
  closeBtn.className = 'ad-close-btn';
  closeBtn.textContent = '\\u00d7';
  closeBtn.style.cssText = 'position:absolute;top:2px;right:4px;font-size:11px;color:#666;cursor:pointer;z-index:1;line-height:1;padding:0 3px;font-family:sans-serif';
  closeBtn.onclick = function(e) {
    e.stopPropagation(); e.preventDefault();
    card.style.display = 'none';
  };
  card.appendChild(closeBtn);
})();</script>'''
    
    body_end = t.rfind('</body>')
    t = t[:body_end] + ad_script + '\n' + t[body_end:]
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    
    scripts = t.count('<script>') == t.count('</script>')
    braces = t.count('{') == t.count('}')
    print(f'{m}: scripts={scripts} braces={braces}')
