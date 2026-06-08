# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Replace ad-card CSS to be super visible
    new_css = '''/* ─── 广告卡片 ─── */
.ad-card{
  position:fixed;
  top:12px;left:12px;
  z-index:99999;
  width:300px;
  height:120px;
  background:red;
  border:3px solid yellow;
  border-radius:10px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:8px 12px;
  box-shadow:0 0 20px rgba(255,0,0,0.5);
  user-select:none;
  -webkit-user-select:none;
  touch-action:none;
  font-size:20px;
  color:white;
}'''
    
    # Find the ad card CSS block in style and replace entirely
    start = t.find('/* ─── 广告卡片 ─── */')
    end = t.find('/* ─── 容器详情弹窗', start)
    if end < 0:
        end = t.find('\n}\n\n', start)
        if end < 0:
            end = t.find('.ad-card{', start + 50)
            end = t.find('}\n\n', end) + 3
    
    if start > 0:
        old_block = t[start:end]
        t = t[:start] + new_css + '\n' + t[end:]
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: replaced ad CSS (going from {start} to {end})')
