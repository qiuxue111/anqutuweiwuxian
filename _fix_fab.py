files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

old_style = 'display:none;width:36px;height:36px;border-radius:50%;background:#ffc832;color:#0a0a0f;border:none;font-size:1.5rem;cursor:pointer;line-height:1;margin-left:auto;flex-shrink:0;'
new_style = 'display:none;width:36px;height:36px;border-radius:50%;background:#ffc832;color:#0a0a0f;border:none;font-size:1.5rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;margin-left:auto;flex-shrink:0;'

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    if old_style in c:
        c = c.replace(old_style, new_style)
        with open(fp, 'w', encoding='utf8') as f:
            f.write(c)
        print(fp.split('/')[-1] + ': fixed')
    else:
        # Maybe already fixed
        if 'inline-flex' in c[c.index('fabBtn'):c.index('fabBtn')+300]:
            print(fp.split('/')[-1] + ': already has inline-flex')
        else:
            print(fp.split('/')[-1] + ': pattern not found')
            idx = c.index('fabBtn')
            print('  actual:', c[idx:idx+300])
