files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Replace the exact function body
    old = """async function toggleLike(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var id=currentModalPostId;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/like_post',{
      method:'POST',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({post_id:id})
    });
    if(r.ok){
      var newCount=await r.json();
      var el=document.getElementById('modalLikes');
      if(el)el.textContent='❤️ '+(newCount||0);
      loadPosts();
    }else{
      alert('点赞失败');
    }
  }catch(e){alert('点赞失败: '+e.message);}
}"""
    
    new = """async function toggleLike(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var id=currentModalPostId;
  var userName=getUserName();
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/like_post',{
      method:'POST',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({post_id:id,user_name:userName})
    });
    if(r.ok){
      var newCount=await r.json();
      var el=document.getElementById('modalLikes');
      if(el){
        var isLiked=el.classList.contains('active');
        if(isLiked)el.classList.remove('active');else el.classList.add('active');
        el.textContent='❤️ '+(newCount||0);
      }
      loadPosts();
    }else{
      alert('点赞失败');
    }
  }catch(e){alert('点赞失败: '+e.message);}
}"""
    c = c.replace(old, new)
    
    # Add liked check in openPostModal
    old_open_chunk = """catEl.style.background=hue+'22';
    catEl.style.color=hue;"""
    new_open_chunk = """catEl.style.background=hue+'22';
    catEl.style.color=hue;
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
    c = c.replace(old_open_chunk, new_open_chunk)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: done")

# Verify
import re
print('\n--- Verify ---')
for fn in ['gear.html', 'strategy.html', 'weapons.html']:
    c = open(f'F:/暗区突围网站/pages/{fn}', 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_userName = 'user_name:userName' in s
    has_liked = 'post_likes' in s
    print(f"{fn}: {ob}={cb} ({op}={cp}) {ok} | toggle_name={has_userName} | liked_check={has_liked}")
