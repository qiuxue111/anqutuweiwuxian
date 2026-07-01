path = r'F:\暗区突围网站\pages\map-tvstation.html'
with open(path, 'r', encoding='utf-8', errors='ignore') as f:
    c = f.read()

old = c

# 方块缩回72px
c = c.replace('.mat-item{width:144px;padding:10px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:6px;transition:all .1s}',
              '.mat-item{width:72px;padding:6px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:8px;cursor:pointer;display:flex;flex-direction:column;align-items:center;gap:3px;transition:all .1s}')

# 图标保持80px
# 文字保持26px

with open(path,'w',encoding='utf-8') as f:
    f.write(c)
print('Done',c!=old)
print('width:72px:',c.count('width:72px'))
print('width:144px:',c.count('width:144px'))
print('img 80px:','width:80px;height:80px' in c)
print('name 26px:','font-size:26px' in c)
