with open('F:/暗区突围网站/pages/3x3.html', 'r', encoding='utf-8') as f:
    t = f.read()

# Replace the 3 old CSS blocks with the new overlay style
# 1. .ad-card a rule
old_a = '.ad-card a{display:block;width:100%;height:calc(100% - 48px);overflow:hidden;position:relative}'
new_a = '.ad-card a{display:block;width:100%;height:100%;overflow:hidden;position:relative}'
t = t.replace(old_a, new_a)

# 2. .ad-card .ad-text rule (below image -> overlay on image)
old_text = '.ad-card .ad-text{position:absolute;bottom:0;left:0;width:100%;height:48px;background:rgba(0,0,0,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px;box-sizing:border-box}'
new_text = '.ad-card .ad-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:2;width:90%}'
t = t.replace(old_text, new_text)

# Add .ad-title and .ad-desc rules if missing
if '.ad-card .ad-title' not in t:
    # Insert after .ad-card .ad-text rule
    insert_after = '.ad-card .ad-text{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;z-index:2;width:90%}'
    new_styles = '''
.ad-card .ad-title{color:#fff;font-weight:700;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}
.ad-card .ad-desc{color:#fff;font-weight:600;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}
.ad-close-btn{position:absolute;top:6px;right:6px;width:24px;height:24px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0}
.ad-card:hover .ad-close-btn{opacity:1}
.ad-close-btn:hover{transform:scale(1.15);background:rgba(255,30,30,1)}'''
    t = t.replace(insert_after, insert_after + '\n' + new_styles)
else:
    # Already have them, just update values
    old_title = '.ad-card .ad-title{color:#eee;font-size:12px;font-weight:600;line-height:1.3;margin-bottom:2px}'
    new_title = '.ad-card .ad-title{color:#fff;font-weight:700;font-size:14px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    t = t.replace(old_title, new_title)
    old_desc = '.ad-card .ad-desc{color:#888;font-size:10px;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}'
    new_desc = '.ad-card .ad-desc{color:#fff;font-weight:600;font-size:12px;margin-top:4px;text-shadow:0 0 4px #000,0 0 8px #000,1px 1px 2px #000;-webkit-text-stroke:1px #000;text-stroke:1px #000}'
    t = t.replace(old_title, new_title)
    t = t.replace(old_desc, new_desc)
    print('Updated existing title/desc rules')

with open('F:/暗区突围网站/pages/3x3.html', 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3 overlay CSS applied')
