import os, re

pages = r'F:\暗区突围网站\pages'
maps = ['map-farm.html','map-valley.html','map-beishan.html','map-tvstation.html','map-armory.html','map-airport.html']

for fn in maps:
    path = os.path.join(pages, fn)
    with open(path, 'r', encoding='utf-8', errors='ignore') as f:
        c = f.read()
    
    old_c = c
    
    # 1. 替换链接
    c = c.replace('https://qm.qq.com/q/YWswLAYuoU', 'https://mp.weixin.qq.com/s/PiXAJpvE-ehcLHDNic75Zw')
    
    # 2. 替换文字 - 用多种方式确保匹配到
    c = c.replace('3x3代肝喵', '护航代肝')
    c = c.replace('点击这里喵', '点这里喵')
    
    # 3. 缩小尺寸 - 找到 width/height 的行
    c = re.sub(r'width:180px;height:240px;', 'width:90px;height:120px;', c)
    
    # 4. 缩小ad-text padding
    c = re.sub(r'padding:8px 6px;', 'padding:4px 4px;', c)
    
    # 5. 缩小title字号
    c = re.sub(r'font-size:14px;text-shadow:0 0 6px #000,0 0 12px #000,2px 2px 4px #000',
               'font-size:11px;text-shadow:0 0 6px #000,0 0 12px #000,2px 2px 4px #000', c)
    
    if c != old_c:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(c)
        print('%s: OK (changed)' % fn)
    else:
        print('%s: NO CHANGE' % fn)

print('Done!')
