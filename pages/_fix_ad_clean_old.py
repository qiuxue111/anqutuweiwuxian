import re

maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'r', encoding='utf-8') as f:
        t = f.read()
    
    # Delete old duplicate ad-card CSS blocks (anything after the main one)
    # The old ones look like: .ad-card img{width:40px;height:40px;...
    # And: .ad-card .ad-text{flex:1;...
    # These appear after the main .ad-card block
    
    # Remove old .ad-card img{width:40...} if present
    old_img = '.ad-card img{width:40px;height:40px;border-radius:6px;object-fit:cover;flex-shrink:0;pointer-events:none}'
    if old_img in t:
        t = t.replace(old_img, '')
        print(f'{m}: removed old 40px img rule')
    
    old_text = '.ad-card .ad-text{flex:1;min-width:0;pointer-events:none}'
    if old_text in t:
        t = t.replace(old_text, '')
        print(f'{m}: removed old flex:1 text rule')
    
    # Also remove old .ad-card .ad-title / .ad-desc rules that may override
    old_title = '.ad-card .ad-text .ad-title{color:#eee;font-size:12px;font-weight:600;line-height:1.3;margin-bottom:2px}'
    if old_title in t:
        t = t.replace(old_title, '')
        print(f'{m}: removed old title rule')
    
    old_desc = '.ad-card .ad-text .ad-desc{color:#888;font-size:10px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}'
    if old_desc in t:
        t = t.replace(old_desc, '')
        print(f'{m}: removed old desc rule')
    
    # Also check for 3x3 variant
    old_img3 = '.ad-card img{width:40px;height:40px;object-fit:contain;border-radius:6px;pointer-events:none;display:block}'
    if old_img3 in t:
        t = t.replace(old_img3, '')
        print(f'{m}: removed old 40px img rule (alt)')
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(t)

# Also fix 3x3 separately
path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# 3x3 may have different old CSS patterns
import re
# Remove old .ad-card img with 40px
t = re.sub(r'\.ad-card img\{width:40px;height:40px[^}]+\}', '', t)
t = re.sub(r'\.ad-card \.ad-text\{flex:1;[^}]+\}', '', t)
t = re.sub(r'\.ad-card \.ad-text \.ad-title\{[^}]+\}', '', t)
t = re.sub(r'\.ad-card \.ad-text \.ad-desc\{[^}]+\}', '', t)

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3: cleaned old ad CSS')
