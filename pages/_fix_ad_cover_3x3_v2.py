import re
path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Replace the multi-line .ad-card block (the first one at pos 18147)
# Match from .ad-card{ to the closing }
old_match = re.search(r'\.ad-card\{[^}]*?\n\}', t)
if old_match:
    old_str = old_match.group()
    new_str = '''.ad-card{
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
}'''
    t = t.replace(old_str, new_str)
    print('Replaced main ad-card block')
else:
    print('No match for .ad-card{...} block')

# Also update img rule
t = t.replace('.ad-card img{width:40px;height:40px;object-fit:contain;border-radius:6px;pointer-events:none;display:block}',
              '.ad-card img{width:100%;height:100%;object-fit:cover;border-radius:10px;pointer-events:none;display:block}.ad-card a{display:flex;width:100%;height:100%}')

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3 done')
