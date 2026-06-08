maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Add X close button in the ad-card HTML, and close logic
    # Find ad-card HTML end
    old_card_end = '''  </div>
</div>'''
    # But need to be specific - find the ad-card closing

    # Insert close button and script after the ad-text section
    old_ad_text_end = '    <div class="ad-desc" id="adDesc">点击这里喵</div>\n  </div>\n</div>'
    new_ad_text_end = '    <div class="ad-desc" id="adDesc">点击这里喵</div>\n  </div>\n  <div class="ad-close-btn" id="adCloseBtn" onclick="this.parentElement.style.display=\'none\'">&#x2716;</div>\n</div>'
    
    t = t.replace(old_ad_text_end, new_ad_text_end)
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)
    print(f'{m}: X button added')
