files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Insert liked check right after the catEl color line (first occurrence)
    target = "catEl.style.color=hue;"
    insert = """catEl.style.color=hue;
    (async function(){
      var un=getUserName();
      if(!un||!token)return;
      try{
        var lr=await db('GET','post_likes',null,'post_id=eq.'+postId+'&user_id=eq.'+encodeURIComponent(un)+'&limit=1');
        if(lr.ok){
          var likes=await lr.json();
          if(likes&&likes.length>0){
            var el=document.getElementById('modalLikes');
            if(el)el.classList.add('active');
          }
        }
      }catch(e){}
    })();"""
    
    c = c.replace(target, insert)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: liked check inserted")

# Verify
import re
print()
for fn in ['gear.html', 'strategy.html', 'weapons.html']:
    c = open(f'F:/暗区突围网站/pages/{fn}', 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    has_liked = 'post_likes' in s
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"{fn}: {ob}={cb} ({op}={cp}) {ok} | liked_check={has_liked}")
