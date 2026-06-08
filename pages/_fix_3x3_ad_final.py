path = 'F:/暗区突围网站/pages/3x3.html'
with open(path, 'r', encoding='utf-8') as f:
    t = f.read()

# Replace the main .ad-card block (multi-line) with 3:4 layout
old_main = '''.ad-card{
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

new_main = '''.ad-card{
  position:fixed;
  left:12px;bottom:12px;
  z-index:99998;
  width:180px;
  height:240px;
  background:rgba(10,10,15,0.72);
  backdrop-filter:blur(8px);
  -webkit-backdrop-filter:blur(8px);
  border:1px solid rgba(255,255,255,0.08);
  border-radius:10px;
  cursor:pointer;
  overflow:hidden;
  transition:border-color .2s,box-shadow .2s;
  box-shadow:0 2px 12px rgba(0,0,0,0.4);
  user-select:none;
  -webkit-user-select:none;
  touch-action:none
}'''

t = t.replace(old_main, new_main)

# Add a-tag and img CSS after the main block
# Insert after the closing } of the main .ad-card block
# Find the first .ad-card:hover and insert before it
insert_before = '.ad-card:hover{border-color:rgba(255,200,50,0.3);box-shadow:0 2px 16px rgba(255,200,50,0.08)}'
new_rules = '''.ad-card a{display:block;width:100%;height:calc(100% - 48px);overflow:hidden;position:relative}
.ad-card img{width:100%;height:100%;object-fit:cover;pointer-events:none;display:block}
.ad-card .ad-text{position:absolute;bottom:0;left:0;width:100%;height:48px;background:rgba(0,0,0,0.6);display:flex;flex-direction:column;align-items:center;justify-content:center;padding:4px;box-sizing:border-box}
'''
t = t.replace(insert_before, new_rules + insert_before)

with open(path, 'w', encoding='utf-8') as f:
    f.write(t)
print('3x3: 3:4 layout applied')
