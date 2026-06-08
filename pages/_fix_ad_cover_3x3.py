path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

old = '''.ad-card{
  position:fixed;
  left:12px;bottom:12px;
  z-index:99998;
  width:200px;
  height:80px;
  background:rgba(10,10,15,0.72);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:10px;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  gap:8px;
  padding:8px 12px;
  transition:border-color .2s,box-shadow .2s;
  box-shadow:0 2px 12px rgba(0,0,0,0.4);
  user-select:none;
  -webkit-user-select:none;
  touch-action:none
}'''

new = '''.ad-card{
  position:fixed;
  left:12px;bottom:12px;
  z-index:99998;
  width:240px;
  height:auto;
  background:rgba(10,10,15,0.72);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:10px;
  cursor:pointer;
  display:flex;
  flex-direction:column;
  align-items:stretch;
  gap:0;
  padding:0;
  transition:border-color .2s,box-shadow .2s;
  box-shadow:0 2px 12px rgba(0,0,0,0.4);
  user-select:none;
  -webkit-user-select:none;
  touch-action:none
}
.ad-card a{display:flex;width:100%;height:100%}
.ad-card img{width:100%;height:100%;object-fit:cover;border-radius:10px;pointer-events:none;display:block}'''

t = t.replace(old, new)
print(f'Replaced: {old in t}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3: CSS updated')
