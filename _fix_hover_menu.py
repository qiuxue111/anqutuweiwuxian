import re

files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/maps.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
    'F:/暗区突围网站/search.html',
]

new_style = '''
#menuBtn{position:fixed;top:12px;left:12px;z-index:9999;width:38px;height:38px;border-radius:10px;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.08);color:#ccc;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
#menuBtn:hover{background:rgba(255,200,50,0.15);color:#ffc832;}
#bubbleMenu{display:block;position:fixed;top:56px;left:12px;z-index:9998;background:rgba(15,15,24,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:8px;min-width:180px;box-shadow:0 8px 40px rgba(0,0,0,0.6);overflow:hidden;opacity:0;pointer-events:none;transform:translateY(-8px);transition:opacity 0.2s ease,transform 0.2s ease;}
#menuBtn:hover + #bubbleMenu,#bubbleMenu:hover{opacity:1;pointer-events:all;transform:translateY(0);}
#bubbleMenu a{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#ccc;border-radius:8px;font-size:0.95rem;transition:all 0.15s;}
#bubbleMenu a:hover{background:rgba(255,200,50,0.08);color:#ffc832;}
#bubbleMenu .sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 8px;}
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # Remove any existing menuBtn + bubbleMenu CSS (between /* Floating menu */ or similar)
    # Strategy: find and replace the entire section
    old_css_pattern = r'''#menuBtn\{position:fixed;top:12px;left:12px;z-index:9999;width:38px;height:38px;border-radius:10px;background:rgba\(20,20,30,0\.7\);backdrop-filter:blur\(6px\).*?/;margin:4px 8px;\}'''
    
    # Simpler: just remove any existing #menuBtn and #bubbleMenu CSS blocks
    # Remove lines containing menuBtn CSS (before )
    lines = c.split('\n')
    new_lines = []
    skip = False
    for line in lines:
        # Skip old menuBtn CSS
        if '#menuBtn{' in line and 'position:fixed' in line:
            skip = True
        if skip:
            # Keep going until we see the end of bubbleMenu CSS (bubbleMenu .sep)
            if '#bubbleMenu .sep' in line and 'margin' in line:
                skip = False
                continue
            continue
        # Also skip standalone 'menuBtn:hover' and 'bubbleMenu' CSS that comes after removed block
        if skip:
            continue
        new_lines.append(line)
    c = '\n'.join(new_lines)
    
    # Now inject new CSS before last </style>
    idx = c.rfind('</style>')
    if idx >= 0:
        c = c[:idx] + new_style + '\n' + c[idx:]
    
    # Replace toggleMenu to just toggle on click (still works for mobile)
    old_toggle = '''function toggleMenu(){
  var m=document.getElementById('bubbleMenu');
  if(!m)return;
  m.style.display=m.style.display==='none'?'block':'none';
  // Close on outside click
  if(m.style.display==='block'){
    setTimeout(function(){
      document.addEventListener('click', function closeMenu(e){
        if(!m.contains(e.target) && e.target.id!=='menuBtn'){
          m.style.display='none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 10);
  }
}'''
    new_toggle = '''function toggleMenu(){
  var m=document.getElementById('bubbleMenu');
  if(!m)return;
  var vis=m.style.opacity==='1'||m.style.opacity==='';
  m.style.opacity=vis?'0':'1';
  m.style.pointerEvents=vis?'none':'all';
  m.style.transform=vis?'translateY(-8px)':'translateY(0)';
}'''
    c = c.replace(old_toggle, new_toggle)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': done')

print('ALL DONE')
