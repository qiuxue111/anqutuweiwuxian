path = r'F:\暗区突围网站\pages\map-armory.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()
old = c

c = c.replace('width:46px;padding:3px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:5px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:1px;transition:all .1s}',
              'width:72px;padding:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:6px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .1s')
c = c.replace('.mat-item img{width:20px;height:20px;border-radius:2px;object-fit:cover}',
              '.mat-item img{width:40px;height:40px;border-radius:4px;object-fit:cover}')
c = c.replace('.mat-item .mi-name{font-size:8px;color:#999;text-align:center;line-height:1.1}',
              '.mat-item .mi-name{font-size:26px;color:#999;text-align:center;line-height:1.2}')
c = c.replace('.mat-item img{width:18px!important;height:18px!important}',
              '.mat-item img{width:36px!important;height:36px!important}')
c = c.replace('.mat-item img{width:22px!important;height:22px!important}',
              '.mat-item img{width:36px!important;height:36px!important}')
c = c.replace('max-width:300px;width:90vw;overflow-y:auto',
              'width:auto;overflow-y:auto')
c = c.replace('{width:170px!important;min-width:170px!important;max-width:170px!important}',
              '{width:270px!important;min-width:270px!important;max-width:270px!important}')

with open(path,'w',encoding='utf-8') as f:
    f.write(c)
print('Done',c!=old)
print('72px:',c.count('width:72px'))
print('40px:','width:40px;height:40px' in c)
print('26px:','font-size:26px' in c)
print('270px:',c.count('width:270px'))
