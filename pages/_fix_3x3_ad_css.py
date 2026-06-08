# Fix 3x3 page ad-card CSS completely
path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Find current ad-card CSS block
import re
match = re.search(r'\.ad-card\{[^}]+touch-action:none\}', t)
if match:
    old_css = match.group()
    print('Found ad-card CSS:', old_css[:300])
    
    new_css = '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99998;width:180px;height:240px;border-radius:10px;cursor:pointer;overflow:hidden;transition:border-color .2s,box-shadow .2s;box-shadow:0 2px 12px rgba(0,0,0,0.4);user-select:none;-webkit-user-select:none;touch-action:none;border:1px solid rgba(255,255,255,0.08)}'
    t = t.replace(old_css, new_css)
    print('Replaced main CSS')

# Add the other rules (a, img, text, close-btn) - they might not exist
# Check if .ad-card a rule exists
if '.ad-card a{' not in t:
    # Find a good insertion point - after ad-card :active
    insert_after = '.ad-card:active{transform:scale(0.97)}'
    new_rules = ''' 
.ad-card:active{transform:scale(0.97)}
.ad-card a{display:block;width:100%;height:100%;overflow:hidden;position:relative}
.ad-card img{width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}
.ad-card .ad-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:2;width:90%}
.ad-card .ad-title{color:#fff;font-weight:700;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}
.ad-card .ad-desc{color:#fff;font-weight:600;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}
.ad-close-btn{position:absolute;top:6px;right:6px;width:24px;height:24px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0}
.ad-card:hover .ad-close-btn{opacity:1}
.ad-close-btn:hover{transform:scale(1.15);background:rgba(255,30,30,1)}'''
    t = t.replace(insert_after, new_rules)
    print('Added missing rules')
else:
    print('Rules already exist')

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3 done')
