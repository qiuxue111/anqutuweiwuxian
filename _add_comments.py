files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

# CSS for comments
comment_css = '''
    .post-comments{margin-top:12px;padding-top:10px;border-top:1px solid #1e1e2a;}
    .post-comments .comment{display:flex;justify-content:space-between;align-items:flex-start;padding:6px 0;border-bottom:1px solid rgba(255,255,255,0.03);}
    .post-comments .comment .c-author{color:#ffc832;font-size:0.75rem;flex-shrink:0;}
    .post-comments .comment .c-text{color:#aaa;font-size:0.8rem;flex:1;margin:0 8px;word-break:break-word;}
    .post-comments .comment .c-del{background:none;border:none;color:#f44;cursor:pointer;font-size:0.7rem;padding:0 4px;flex-shrink:0;}
    .post-comments .comment .c-time{color:#555;font-size:0.65rem;flex-shrink:0;}
    .comment-input{display:flex;gap:6px;margin-top:8px;}
    .comment-input input{flex:1;padding:6px 10px;background:#1a1a22;color:#fff;border:1px solid #333;border-radius:6px;font-size:0.8rem;}
    .comment-input button{padding:4px 12px;background:#ffc832;color:#0a0a0f;border:none;border-radius:6px;cursor:pointer;font-size:0.8rem;font-weight:500;}
    .comment-input button:hover{background:#ffd84a;}
'''

# JS functions to add
comment_js = '''
async function loadComments(postId, containerId){
  var el=document.getElementById(containerId);
  if(!el)return;
  try{
    var r=await db('GET','post_comments',null,'post_id=eq.'+postId+'&order=created_at.asc');
    if(!r.ok){el.innerHTML='<div style="color:#555;font-size:0.75rem;">加载失败</div>';return;}
    var comments=await r.json();
    if(!comments||comments.length===0){el.innerHTML='<div style="color:#555;font-size:0.75rem;">暂无评论</div>';return;}
    var token=localStorage.getItem('abi_token');
    var userName=getUserName();
    el.innerHTML=comments.map(function(c){
      var delBtn=(token&&c.author===userName)?'<button class="c-del" onclick="deleteComment('+c.id+',\\''+containerId+'\\','+postId+')">删除</button>':'';
      return '<div class="comment"><span class="c-author">'+esc(c.author)+'</span><span class="c-text">'+esc(c.content)+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'')+'</span>'+delBtn+'</div>';
    }).join('');
  }catch(e){el.innerHTML='<div style="color:#555;font-size:0.75rem;">加载失败</div>';}
}

async function addComment(postId, inputId, containerId){
  var input=document.getElementById(inputId);
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var author=getUserName();
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({post_id:postId,content:content,author:author})
    });
    if(!r.ok){var err=await r.json().catch(function(){});alert('评论失败: '+(err&&err.message||r.status));return;}
    input.value='';
    loadComments(postId, containerId);
  }catch(e){alert('评论失败: '+e.message);}
}

async function deleteComment(commentId, containerId, postId){
  if(!confirm('确定删除这条评论？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments?id=eq.'+commentId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok){alert('删除失败');return;}
    loadComments(postId, containerId);
  }catch(e){alert('删除失败: '+e.message);}
}

async function deletePost(postId){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+postId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok){var err=await r.json().catch(function(){});alert('删除失败: '+(err&&err.message||r.status));return;}
    loadPosts();
  }catch(e){alert('删除失败: '+e.message);}
}
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. Add comment CSS before last </style>
    idx = c.rfind('</style>')
    if idx >= 0:
        c = c[:idx] + comment_css + '\n  ' + c[idx:]
    
    # 2. Add comment JS functions before the last script's closing
    # Find the bottom of the last script block
    script_end = c.rfind('</script>')
    if script_end >= 0:
        c = c[:script_end] + '\n' + comment_js + '\n' + c[script_end:]
    
    # 3. Modify loadPosts to add comment section and delete button to each post card
    # Replace the return line in loadPosts to include comments
    old_card = """return '<div class="post-card"><h3><a href="#">'+esc(p.title||'无标题')+'</a></h3>'+"""
    new_card = """var pId=p.id;
      var token=localStorage.getItem('abi_token');
      var delBtn=(token&&p.author===getUserName())?'<button style="padding:2px 8px;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;" onclick="deletePost('+pId+')">删除</button>':'';
      var cId='comments_'+pId;
      var cInputId='cinput_'+pId;
      return '<div class="post-card" id="post_'+pId+'"><h3><a href="#">'+esc(p.title||'无标题')+'</a></h3>'+"""
    c = c.replace(old_card, new_card)
    
    # Add meta line (after the category span line) to include delete button
    old_meta = """'<div class="meta"><span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:'+hue+'22;color:'+hue+';">'+cn+'</span>'+"""
    new_meta = """'<div class="meta"><span style="font-size:0.7rem;padding:2px 6px;border-radius:4px;background:'+hue+'22;color:'+hue+';">'+cn+'</span>'+"""
    c = c.replace(old_meta, new_meta)
    
    # Add delete button to meta area
    # Find the meta closing and add delBtn + imgHTML + comment section
    old_meta_end = """'<span>'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span></div>'+
        '<div class="preview">'+esc(prev)+(prev.length>=150?'...':'')+'</div>'+
        imgHTML+'</div>';"""
    new_meta_end = """'<span>'+(p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'')+'</span>'+
        delBtn+'</div>'+
        '<div class="preview">'+esc(prev)+(prev.length>=150?'...':'')+'</div>'+
        imgHTML+
        '<div class="post-comments" id="'+cId+'"></div>'+
        '<div class="comment-input"><input id="'+cInputId+'" placeholder="输入评论..." onkeydown="if(event.key==\\'Enter\\')addComment('+pId+',\\''+cInputId+'\\',\\''+cId+'\\')"><button onclick="addComment('+pId+',\\''+cInputId+'\\',\\''+cId+'\\')">评论</button></div>'+
        '</div>'+
        '<script>loadComments('+pId+',\\''+cId+'\\');<' + '/script>';"""
    c = c.replace(old_meta_end, new_meta_end)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': comments added')

print('ALL DONE')
