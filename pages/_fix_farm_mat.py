path = r'F:\暗区突围网站\pages\map-farm.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()
old = c

# 1. mat-item 46->72, padding 3->6, gap 1->3, border-radius 5->6
c = c.replace('width:46px;padding:3px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;transition:all .1s',
              'width:72px;padding:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .1s')

# 2. img 20->40, border-radius 2->4
c = c.replace('.mat-item img{width:20px;height:20px;border-radius:2px;object-fit:cover}',
              '.mat-item img{width:40px;height:40px;border-radius:4px;object-fit:cover}')

# 3. mi-name 8->26
c = c.replace('.mat-item .mi-name{font-size:8px;color:#999;text-align:center;line-height:1.1}',
              '.mat-item .mi-name{font-size:26px;color:#999;text-align:center;line-height:1.2}')

# 4. 手机端 18px->36px
c = c.replace('.mat-item img{width:18px!important;height:18px!important}',
              '.mat-item img{width:36px!important;height:36px!important}')
c = c.replace('.mat-item img{width:22px!important;height:22px!important}',
              '.mat-item img{width:36px!important;height:36px!important}')

# 5. mat-panel 170->270
c = c.replace('width:170px;min-width:170px;max-width:170px}',
              'width:270px;min-width:270px;max-width:270px}')

# 6. mat-content 去掉90vw
c = c.replace('max-width:300px;width:90vw;overflow-y:auto',
              'width:auto;overflow-y:auto')

with open(path,'w',encoding='utf-8') as f:
    f.write(c)
print('Done',c!=old)
print('width:72px:',c.count('width:72px'))
print('img 40px:','width:40px;height:40px' in c)
print('name 26px:','font-size:26px' in c)
print('panel 270:',c.count('width:270px'))
print('content auto:',c.count('width:auto;overflow-y:auto'))
