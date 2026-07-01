import sys

path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

old = c

# HTML
c = c.replace('href="https://qm.qq.com/q/YWswLAYuoU"', 'href="https://mp.weixin.qq.com/s/PiXAJpvE-ehcLHDNic75Zw"')
c = c.replace('alt="3x3代肝喵"', 'alt="护航代肝"')
c = c.replace('>3x3代肝喵<', '>护航代肝<')
c = c.replace('>点击这里喵<', '>点这里喵<')

# CSS: 尺寸
c = c.replace('.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:180px;height:240px;',
             '.ad-card{position:fixed;left:12px;bottom:12px;z-index:99990;width:90px;height:120px;')

# CSS: padding
c = c.replace('.ad-card .ad-text{position:absolute;bottom:0;left:0;width:100%;text-align:center;pointer-events:none;z-index:2;padding:8px 6px;box-sizing:border-box;background:linear-gradient(transparent,rgba(0,0,0,0.7))}',
             '.ad-card .ad-text{position:absolute;top:0;left:0;width:100%;text-align:center;pointer-events:none;z-index:2;padding:4px 4px;box-sizing:border-box;background:linear-gradient(rgba(0,0,0,0.7),transparent)}')

# CSS: title字号
c = c.replace('.ad-card .ad-title{color:#fff;font-weight:900;font-size:14px;',
             '.ad-card .ad-title{color:#fff;font-weight:900;font-size:11px;')

# CSS: 叉叉
c = c.replace('.ad-close-btn{position:absolute;top:6px;right:6px;width:24px;height:24px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0}',
             '.ad-close-btn{position:absolute;top:2px;right:2px;width:16px;height:16px;background:rgba(255,50,50,0.85);border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:11px;font-weight:700;cursor:pointer;z-index:3;line-height:1;border:1px solid rgba(255,0,0,0.4);transition:opacity .2s,transform .2s;opacity:0}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(c)

# 验证
print('=== 验证 ===')
print('微信链接:', 'mp.weixin.qq.com' in c)
print('护航代肝:', '护航代肝' in c)
print('点这里喵:', '点这里喵' in c)
print('旧QQ链接:', 'qm.qq.com/q/YWswLAYuoU' in c)
print('width:90px ×', c.count('width:90px'), '(应在.ad-card中 + max-width:90px)')
print('height:120px ×', c.count('height:120px'))
print('文字在top:', 'top:0;left:0;width:100%' in c)
print('叉叉16px:', 'width:16px;height:16px' in c)
print('padding:4px 4px:', 'padding:4px 4px' in c)
