files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

new_fn = """async function openPostModal(postId){
  var token=localStorage.getItem('abi_token');
  try{
    var r=await db('GET','map_posts',null,'id=eq.'+postId+'&limit=1');
    if(!r.ok){alert('\\u52a0\\u8f7d\\u5931\\u8d25');return;}
    var posts=await r.json();
    var p=posts&&posts[0];
    if(!p){alert('\\u5e16\\u5b50\\u4e0d\\u5b58\\u5728');return;}
    currentModalPostId=postId;
    document.getElementById('modalTitle').textContent=p.title||'\\u65e0\\u6807\\u9898';
    document.getElementById('modalBody').textContent=p.content||'';
    document.getElementById('modalAuthor').textContent=(p.author||'\\u533f\\u540d');
    document.getElementById('modalDate').textContent=p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'';
    var cat=p.category||'general';
    var catNames={'general':'\\u6742\\u8c08','question':'\\u95ee\\u7b54','guide':'\\u653b\\u7565','showoff':'\\u70ab\\u8000'};
    var cn=catNames[cat]||'\\u6742\\u8c08';
    var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
    var catEl=document.getElementById('modalCategory');
    catEl.textContent=cn;
    catEl.style.background=hue+'22';
    catEl.style.color=hue;
    try{
      var un=getUserName();
      if(un&&token){
        var lr=await db('GET','post_likes',null,'post_id=eq.'+postId+'&user_id=eq.'+encodeURIComponent(un)+'&limit=1');
        if(lr.ok){
          var likes=await lr.json();
          if(likes&&likes.length>0){
            var el=document.getElementById('modalLikes');
            if(el)el.classList.add('active');
          }
        }
      }
    }catch(e){}
    var imgEl=document.getElementById('modalImages');
    var imgs=((p.images&&typeof p.images==='string')?JSON.parse(p.images):[])||[];
    imgEl.innerHTML=imgs.length?imgs.map(function(u){return '<img src="'+u+'" onclick="window.open(this.src)">';}).join(''):'';
    var delBtn=document.getElementById('modalDelBtn');
    var userName=getUserName();
    delBtn.style.display=(token&&p.author===userName)?'inline':'none';
    loadComments(postId,'modalComments');
    document.getElementById('postModal').style.display='block';
    document.body.style.overflow='hidden';
  }catch(e){alert('\\u52a0\\u8f7d\\u5931\\u8d25: '+e.message);}
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find and replace openPostModal
    start = c.find('async function openPostModal')
    depth = 0
    i = start
    while i < len(c):
        if c[i] == '{': depth += 1
        elif c[i] == '}':
            depth -= 1
            if depth == 0:
                old_fn = c[start:i+1]
                c = c[:start] + new_fn + c[i+1:]
                open(fp, 'w', encoding='utf8').write(c)
                print(f"{fp.split('/')[-1]}: replaced openPostModal ({len(old_fn)} chars)")
                break
        i += 1

import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp}")
