import re

files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # 1. Update toggleLike to pass userName and toggle
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
  }catch(e){alert('点赞失败: '+e.message);
  }
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
  }catch(e){alert('点赞失败: '+e.message);
  }
}"""
    c = c.replace(old, new)
    
    # 2. Update openPostModal to check if user already liked
    old_open = """catEl.style.background=hue+'22';
    catEl.style.color=hue;"""
    
    new_open = """catEl.style.background=hue+'22';
    catEl.style.color=hue;
    // Check if user already liked
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
    c = c.replace(old_open, new_open)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed toggleLike + liked check")

# Also fix index.html
c = open('F:/暗区突围网站/index.html', 'r', encoding='utf8').read()
# Fix toggleLike in index
old_idx = """    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+id,{
      method:'PATCH',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({likes_count:1})
    });
    // Can't increment via PATCH without raw SQL, so use patch with += syntax
    if(r.ok||r.status===204){
      var el=document.getElementById('modalLikes');
      var txt=el.textContent;
      var cur=parseInt(txt.replace(/[^0-9]/g,''))||0;
      el.textContent='❤️ '+(cur+1);
      el.className='like-btn active';
      // Reload posts to update order
      loadHotPosts();
    }else{
      var txt=await r.text();
      alert('点赞失败: '+txt);
    }"""

new_idx = """    var userName=getUserName();
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
      loadHotPosts();
    }else{
      alert('点赞失败');
    }"""
c = c.replace(old_idx, new_idx)

# Also add liked check in index openPostModal
old_open_idx = """catEl.style.background=hue+'22';
    catEl.style.color=hue;"""
new_open_idx = """catEl.style.background=hue+'22';
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
c = c.replace(old_open_idx, new_open_idx)

open('F:/暗区突围网站/index.html', 'w', encoding='utf8').write(c)
print("index.html: fixed toggleLike + liked check")

# Verify all
print('\n--- Verify ---')
for fn in ['index.html', 'gear.html', 'strategy.html', 'weapons.html']:
    fp = f'F:/暗区突围网站/pages/{fn}' if fn != 'index.html' else f'F:/暗区突围网站/{fn}'
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_toggle = 'user_name:userName' in s
    has_liked_check = 'post_likes' in s
    print(f"{fn}: {ob}={cb} ({op}={cp}) {ok} | toggle_with_name={has_toggle} | liked_check={has_liked_check}")

print('\nALL DONE')
