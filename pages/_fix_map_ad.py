import sys

target = sys.argv[1]  # e.g. map-farm.html

pages = r'F:\暗区突围网站\pages'
path = pages + '\\' + target

with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

old_c = c

# 1. HTML: 改链接 + 文字
c = c.replace('href="https://qm.qq.com/q/YWswLAYuoU"', 'href="https://mp.weixin.qq.com/s/PiXAJpvE-ehcLHDNic75Zw"')
c = c.replace('alt="3x3代肝喵"', 'alt="护航代肝"')
c = c.replace('3x3代肝喵', '护航代肝')
c = c.replace('点击这里喵', '点这里喵')

# 2. CSS: 改尺寸 180x240 -> 90x120
old_css = 'width:180px;height:240px;'
new_css = 'width:90px;height:120px;'
assert c.count(old_css) == 1, 'ERROR: width:180px;height:240px; found %d times, expected 1' % c.count(old_css)
c = c.replace(old_css, new_css)

# 3. CSS: 改 padding
old_pad = 'padding:8px 6px;'
new_pad = 'padding:4px 4px;'
# 确保只有一处（ad-text里的）
assert c.count(old_pad) >= 1, 'ERROR: padding:8px 6px; not found'
c = c.replace(old_pad, new_pad)

# 4. CSS: 改title字号 14px -> 11px
old_title = 'font-size:14px;text-shadow:0 0 6px #000,0 0 12px #000,2px 2px 4px #000'
new_title = 'font-size:11px;text-shadow:0 0 6px #000,0 0 12px #000,2px 2px 4px #000'
assert c.count(old_title) == 1, 'ERROR: title font-size found %d times' % c.count(old_title)
c = c.replace(old_title, new_title)

# 5. CSS: 文字移到上方
c = c.replace(
    'bottom:0;left:0;width:100%;text-align:center;pointer-events:none;z-index:2;padding:4px 4px;box-sizing:border-box;background:linear-gradient(transparent,rgba(0,0,0,0.7))',
    'top:0;left:0;width:100%;text-align:center;pointer-events:none;z-index:2;padding:4px 4px;box-sizing:border-box;background:linear-gradient(rgba(0,0,0,0.7),transparent)'
)

# 6. CSS: 叉叉改小
c = c.replace(
    'top:6px;right:6px;width:24px;height:24px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0',
    'top:2px;right:2px;width:16px;height:16px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0'
)

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

print('%s: %d changes' % (target, c.count('\n') - old_c.count('\n')))
