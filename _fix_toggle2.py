files = [
    'F:/暗区突围网站/pages/maps.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
    'F:/暗区突围网站/search.html'
]

new_toggle = '''function toggleMenu(){
  var m=document.getElementById('bubbleMenu');
  if(!m)return;
  var isHidden = m.style.opacity==='0'||m.style.opacity==='';
  m.style.opacity=isHidden?'1':'0';
  m.style.pointerEvents=isHidden?'all':'none';
  m.style.transform=isHidden?'translateY(0)':'translateY(-8px)';
}'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    old = "m.style.display=m.style.display==='none'?'block':'none';\n}"
    new = "m.style.opacity=m.style.opacity==='1'||m.style.opacity===''?'0':'1';\n  m.style.pointerEvents=m.style.opacity==='1'?'all':'none';\n  m.style.transform=m.style.opacity==='1'?'translateY(0)':'translateY(-8px)';\n}"
    c = c.replace(old, new)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': done')
    
    # Verify
    if 'm.style.opacity' not in c:
        print('  WARNING: opacity not found')
    if 'm.style.display=m.style.display' in c:
        print('  WARNING: old toggle still present')

print('ALL DONE')
