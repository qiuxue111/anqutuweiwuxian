c = open('F:/暗区突围网站/index.html', 'r', encoding='utf8').read()

# 1. Add post modal CSS (same as subpages)
modal_css = '''
    #postModal{display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);overflow-y:auto;}
    #postModal .modal-content{max-width:650px;margin:60px auto;background:#12121a;border:1px solid #1e1e2a;border-radius:14px;padding:1.5rem;position:relative;}
    #postModal .close-btn{position:absolute;top:12px;right:14px;background:none;border:none;color:#888;font-size:1.5rem;cursor:pointer;width:32px;height:32px;display:flex;align-items:center;justify-content:center;border-radius:6px;}
    #postModal .close-btn:hover{background:rgba(255,255,255,0.06);color:#ffc832;}
    #postModal h2{color:#ffc832;margin:0 0 0.5rem 0;font-size:1.2rem;}
    #postModal .post-meta{display:flex;gap:12px;align-items:center;font-size:0.8rem;color:#666;margin-bottom:1rem;}
    #postModal .post-body{color:#ccc;font-size:0.95rem;line-height:1.7;margin-bottom:1.5rem;white-space:pre-wrap;word-break:break-word;}
    #postModal .post-images{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:1.5rem;}
    #postModal .post-images img{max-width:100%;max-height:300px;border-radius:8px;object-fit:contain;background:#0a0a0f;}
    #postModal h4{color:#aaa;font-size:0.9rem;margin:0 0 0.5rem 0;}
    .like-btn{cursor:pointer;padding:2px 10px;border-radius:6px;border:1px solid rgba(255,255,255,0.08);background:transparent;color:#aaa;font-size:0.8rem;display:inline-flex;align-items:center;gap:4px;}
    .like-btn:hover{border-color:#ffc83244;color:#ffc832;}
    .like-btn.active{background:rgba(255,200,50,0.1);border-color:#ffc83255;color:#ffc832;}
'''

c = c.replace('</style>', modal_css + '\n</style>')

# 2. Add modal HTML before </body>
modal_html = '''
<div id="postModal" style="display:none;position:fixed;top:0;left:0;width:100%;height:100%;z-index:10000;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px);overflow-y:auto;">
  <div class="modal-content">
    <button class="close-btn" onclick="closePostModal()">✕</button>
    <h2 id="modalTitle"></h2>
    <div class="post-meta">
      <span id="modalCategory" style="font-size:0.7rem;padding:2px 6px;border-radius:4px;"></span>
      <span id="modalAuthor"></span>
      <span id="modalDate"></span>
      <span id="modalLikes" class="like-btn" onclick="toggleLike()">❤️ 0</span>
      <button id="modalDelBtn" style="margin-left:auto;padding:2px 8px;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;display:none;" onclick="deletePostFromModal()">删除</button>
    </div>
    <div id="modalImages" class="post-images"></div>
    <div id="modalBody" class="post-body"></div>
    <h4>💬 评论</h4>
    <div id="modalComments" class="post-comments"></div>
    <div style="display:flex;gap:6px;align-items:center;margin-top:8px;">
      <input id="modalCommentInput" placeholder="输入评论..." style="flex:1;padding:8px 12px;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:8px;font-size:0.85rem;" onkeydown="if(event.key==='Enter')addCommentFromModal()">
      <button class="file-btn" style="width:34px;height:34px;border-radius:50%;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);font-size:1.2rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;" onclick="document.getElementById('commentImages').click()">+</button>
      <input id="commentImages" type="file" accept="image/*" multiple style="display:none;" onchange="previewCommentFiles(this)">
      <button style="padding:8px 16px;background:#ffc832;color:#0a0a0f;border:none;border-radius:8px;cursor:pointer;font-weight:600;font-size:0.85rem;" onclick="addCommentFromModal()">评论</button>
    </div>
    <div id="commentFilePreview" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;"></div>
  </div>
</div>
'''

c = c.replace('</body>', modal_html + '\n</body>')

# 3. Replace the db() function to support token for DELETE/POST
old_db = """function db(method,table,body,query){
  return fetch(SUPABASE_URL+'/rest/v1/'+table+(query?'?'+query:''),{
    method:method,
    headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}"""

new_db = """function db(method,table,body,query){
  var token=localStorage.getItem('abi_token');
  var useToken=(method==='POST'||method==='PATCH'||method==='DELETE');
  var auth=useToken&&token?'Bearer '+token:'Bearer '+SUPABASE_ANON;
  return fetch(SUPABASE_URL+'/rest/v1/'+table+(query?'?'+query:''),{
    method:method,
    headers:{'Authorization':auth,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
    body:body?JSON.stringify(body):null
  });
}"""
c = c.replace(old_db, new_db)

# 4. Replace loadHotPosts with full-featured version
old_load = """async function loadHotPosts(){
  try{
    var r=await db('GET','map_posts',null,'order=created_at.desc&limit=10');
    if(!r.ok)throw new Error(r.status);
    var posts=await r.json();
    var el=document.getElementById('postList');
    if(!posts||posts.length===0){
      el.innerHTML='<div style="text-align:center;color:#555;padding:2rem;">暂无帖子</div>';
      return;
    }
    el.innerHTML=posts.map(function(p){
      var prev=(p.content||'').substring(0,120);
      var cat=p.category||'杂谈';
      var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
      return '<div style="background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:12px;">'+
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">'+
        '<span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:'+hue+'22;color:'+hue+';">'+cat+'</span>'+
        '<span style="font-size:0.7rem;color:#555;">'+(p.author||'匿名')+'</span>'+
        '<span style="font-size:0.7rem;color:#444;">'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span></div>'+
        '<div style="color:#ddd;font-size:0.95rem;font-weight:500;">'+esc(p.title||'无标题')+'</div>'+
        '<div style="color:#777;font-size:0.8rem;margin-top:4px;">'+esc(prev)+(prev.length>=120?'...':'')+'</div></div>';
    }).join('');
  }catch(e){
    document.getElementById('postList').innerHTML='<div style="text-align:center;color:#555;padding:2rem;">加载失败</div>';
  }
}"""

new_load = """async function loadHotPosts(){
  try{
    var r=await db('GET','map_posts',null,'order=likes_count.desc.nullslast,created_at.desc&limit=20');
    if(!r.ok)throw new Error(r.status);
    var posts=await r.json();
    var el=document.getElementById('postList');
    if(!posts||posts.length===0){
      el.innerHTML='<div style="text-align:center;color:#555;padding:2rem;">暂无帖子</div>';
      return;
    }
    el.innerHTML=posts.map(function(p){
      var prev=(p.content||'').substring(0,120);
      var cat=p.category||'杂谈';
      var cn={'general':'杂谈','question':'问答','guide':'攻略','showoff':'炫耀'}[cat]||'杂谈';
      var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
      var pId=p.id;
      var imgs=((p.images&&typeof p.images==='string')?JSON.parse(p.images):[])||[];
      var imgHTML=imgs.length?'<div style="display:flex;gap:4px;margin-top:4px;">'+imgs.slice(0,3).map(function(u){return '<img src="'+u+'" style="width:40px;height:40px;border-radius:4px;object-fit:cover;border:1px solid #1e1e2a;">';}).join('')+(imgs.length>3?'<span style="color:#555;font-size:0.7rem;align-self:center;">+'+imgs.length+'</span>':'')+'</div>':'';
      var likes=p.likes_count||0;
      return '<div style="background:rgba(20,20,30,0.6);border:1px solid rgba(255,255,255,0.05);border-radius:10px;padding:12px;cursor:pointer;" onclick="openPostModal('+pId+')">'+
        '<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">'+
        '<span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:'+hue+'22;color:'+hue+';">'+cn+'</span>'+
        '<span style="font-size:0.7rem;color:#555;">'+(p.author||'匿名')+'</span>'+
        '<span style="font-size:0.7rem;color:#444;">'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span>'+
        '<span style="margin-left:auto;font-size:0.7rem;color:#888;">❤️ '+likes+'</span></div>'+
        '<div style="color:#ddd;font-size:0.95rem;font-weight:500;">'+esc(p.title||'无标题')+'</div>'+
        '<div style="color:#777;font-size:0.8rem;margin-top:4px;">'+esc(prev)+(prev.length>=120?'...':'')+'</div>'+
        imgHTML+'</div>';
    }).join('');
  }catch(e){
    var lel=document.getElementById('postList');
    if(lel)lel.innerHTML='<div style="text-align:center;color:#555;padding:2rem;">加载失败</div>';
  }
}"""
c = c.replace(old_load, new_load)

# 5. Add all the modal functions + like/comment/rpc delete functions before the last script block
functions_js = """
var currentModalPostId = null;

async function openPostModal(postId){
  var token=localStorage.getItem('abi_token');
  try{
    var r=await db('GET','map_posts',null,'id=eq.'+postId+'&limit=1');
    if(!r.ok){alert('加载失败');return;}
    var posts=await r.json();
    var p=posts&&posts[0];
    if(!p){alert('帖子不存在');return;}
    currentModalPostId=postId;
    document.getElementById('modalTitle').textContent=p.title||'无标题';
    document.getElementById('modalBody').textContent=p.content||'';
    document.getElementById('modalAuthor').textContent=(p.author||'匿名');
    document.getElementById('modalDate').textContent=p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'';
    var cat=p.category||'general';
    var catNames={'general':'杂谈','question':'问答','guide':'攻略','showoff':'炫耀'};
    var cn=catNames[cat]||'杂谈';
    var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
    var catEl=document.getElementById('modalCategory');
    catEl.textContent=cn;
    catEl.style.background=hue+'22';
    catEl.style.color=hue;
    var imgEl=document.getElementById('modalImages');
    var imgs=((p.images&&typeof p.images==='string')?JSON.parse(p.images):[])||[];
    imgEl.innerHTML=imgs.length?imgs.map(function(u){return '<img src="'+u+'" onclick="window.open(this.src)">';}).join(''):'';
    var delBtn=document.getElementById('modalDelBtn');
    var userName=getUserName();
    delBtn.style.display=(token&&p.author===userName)?'inline':'none';
    document.getElementById('modalLikes').textContent='❤️ '+(p.likes_count||0);
    document.getElementById('modalLikes').className='like-btn'+(p.liked_by?'':''); // could add active class later
    loadComments(postId,'modalComments');
    document.getElementById('postModal').style.display='block';
    document.body.style.overflow='hidden';
  }catch(e){alert('加载失败: '+e.message);}
}

function closePostModal(){
  document.getElementById('postModal').style.display='none';
  document.body.style.overflow='';
}

async function toggleLike(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var id=currentModalPostId;
  try{
    // Just increment likes_count via RPC (needs function)
    // Fallback: PATCH the map_posts record to increment
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+id,{
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
    }
  }catch(e){alert('点赞失败: '+e.message);}
}

async function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
  var author=getUserName();
  (async function(){
    var fileInput=document.getElementById('commentImages');
    var images=[];
    if(fileInput&&fileInput.files.length>0){
      for(var i=0;i<fileInput.files.length;i++){
        var f=fileInput.files[i];
        if(!f.type.startsWith('image/')){alert('只支持图片文件');return;}
        if(f.size>5*1024*1024){alert('单张图片不能超过5MB');return;}
        var imgName='c_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg';
        var formData=new FormData();
        formData.append('file',f);
        try{
          var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+imgName,{
            method:'POST',
            headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
            body:formData
          });
          if(uploadRes.ok){
            images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+imgName);
          }
        }catch(e){console.error('Upload failed',e);}
      }
    }
    try{
      var body={post_id:currentModalPostId,content:content,author:author};
      if(images.length)body.images=JSON.stringify(images);
      var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
        method:'POST',
        headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify(body)
      });
      if(!r.ok){var err=await r.json().catch(function(){});alert('评论失败: '+(err&&err.message||r.status));return;}
      alert('\\u2705 评论成功');
      input.value='';
      if(fileInput)fileInput.value='';
      document.getElementById('commentFilePreview').innerHTML='';
      loadComments(currentModalPostId, 'modalComments');
    }catch(e){alert('评论失败: '+e.message);}
  })();
}

async function loadComments(postId, containerId){
  try{
    var r=await db('GET','post_comments',null,'post_id=eq.'+postId+'&order=created_at.asc');
    if(!r.ok)return;
    var comments=await r.json();
    var el=document.getElementById(containerId);
    if(!el)return;
    if(!comments||comments.length===0){
      el.innerHTML='<div style="color:#555;font-size:0.8rem;padding:4px 0;">暂无评论</div>';
      return;
    }
    var userName=getUserName();
    var token=localStorage.getItem('abi_token');
    el.innerHTML=comments.map(function(c){
      var delBtn=(token&&c.author===userName)?'<button style="background:none;border:none;color:#f55;font-size:0.65rem;cursor:pointer;margin-left:8px;" onclick="deleteComment('+c.id+',\\''+containerId+'\\','+postId+')">删除</button>':'';
      var cimgs=(c.images&&typeof c.images==='string')?JSON.parse(c.images):[];
      var cimgHTML=cimgs.length?'<div style="display:flex;gap:4px;margin-top:2px;">'+cimgs.map(function(u){return '<img src="'+u+'" style="max-width:80px;max-height:60px;border-radius:4px;object-fit:cover;cursor:pointer;border:1px solid #1e1e2a;" onclick="window.open(this.src)">';}).join('')+'</div>':'';
      return '<div style="display:flex;align-items:flex-start;gap:8px;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.04);">'+
        '<span style="color:#ffc832;font-size:0.8rem;white-space:nowrap;">'+esc(c.author)+'</span>'+
        '<div style="flex:1;"><span style="color:#ccc;font-size:0.85rem;">'+esc(c.content)+'</span>'+cimgHTML+'</div>'+
        '<span style="color:#555;font-size:0.65rem;">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'')+'</span>'+
        delBtn+'</div>';
    }).join('');
  }catch(e){}
}

async function deleteComment(commentId, containerId, postId){
  if(!confirm('确定删除这条评论？'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_comment',{
      method:'POST',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({comment_id:commentId})
    });
    if(r.ok||r.status===204){
      alert('评论已删除');
      loadComments(postId, containerId);
    }else alert('删除评论失败');
  }catch(e){alert('删除失败: '+e.message);}
}

async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_post',{
      method:'POST',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({post_id:currentModalPostId})
    });
    if(r.ok||r.status===204){
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadHotPosts();
    }else alert('删除失败');
  }catch(e){alert('删除失败: '+e.message);}
}

function previewCommentFiles(input){
  var preview=document.getElementById('commentFilePreview');
  if(!preview)return;
  if(!input.files||!input.files.length){preview.innerHTML='';return;}
  preview.innerHTML='';
  for(var i=0;i<input.files.length;i++){
    (function(file){
      var reader=new FileReader();
      reader.onload=function(e){
        var img=document.createElement('img');
        img.style.cssText='width:50px;height:50px;border-radius:4px;object-fit:cover;border:1px solid #1e1e2a;';
        img.src=e.target.result;
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    })(input.files[i]);
  }
}
"""

# Insert before the last </script>
script_end = c.rfind('</script>')
c = c[:script_end] + '\n' + functions_js + '\n' + c[script_end:]

open('F:/暗区突围网站/index.html', 'w', encoding='utf8').write(c)
print("index.html updated")

# Verify
import re
ms = re.findall(r'<script>([\s\S]*?)</script>', c)
s = ';'.join(ms) if ms else ''
ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
ok = 'OK' if ob==cb and op==cp else 'FAIL'
print(f"Brackets: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok}")
print(f"Has openPostModal: {'openPostModal' in c}")
print(f"Has toggleLike: {'toggleLike' in c}")
print(f"Has loadComments: {'loadComments' in c}")
