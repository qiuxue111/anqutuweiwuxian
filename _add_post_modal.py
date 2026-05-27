files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

# Post detail modal CSS
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
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. Add modal CSS before last </style>
    idx = c.rfind('</style>')
    if idx >= 0:
        c = c[:idx] + modal_css + '\n  ' + c[idx:]
    
    # 2. Add modal HTML before </body> (find the footer or last section)
    # Insert before the footer
    modal_html = '''
<div id="postModal">
  <div class="modal-content">
    <button class="close-btn" onclick="closePostModal()">✕</button>
    <h2 id="modalTitle"></h2>
    <div class="post-meta">
      <span id="modalCategory" style="font-size:0.7rem;padding:2px 6px;border-radius:4px;"></span>
      <span id="modalAuthor"></span>
      <span id="modalDate"></span>
      <button id="modalDelBtn" style="margin-left:auto;padding:2px 8px;background:#3a1a1a;color:#f66;border:none;border-radius:4px;cursor:pointer;font-size:0.7rem;display:none;" onclick="deletePostFromModal()">删除</button>
    </div>
    <div id="modalImages" class="post-images"></div>
    <div id="modalBody" class="post-body"></div>
    <h4>💬 评论</h4>
    <div id="modalComments" class="post-comments"></div>
    <div class="comment-input">
      <input id="modalCommentInput" placeholder="输入评论..." onkeydown="if(event.key==='Enter')addCommentFromModal()">
      <button onclick="addCommentFromModal()">评论</button>
    </div>
  </div>
</div>
'''
    # Insert before </body>
    c = c.replace('</body>', modal_html + '\n</body>')
    
    # 3. Change card link from '#' to onclick
    old_card_link = "<h3><a href=\"#\">'+esc(p.title||'无标题')+'</a></h3>"
    new_card_link = "<h3><a href=\"javascript:void(0)\" onclick=\"openPostModal('+pId+')\">'+esc(p.title||'无标题')+'</a></h3>"
    c = c.replace(old_card_link, new_card_link)
    
    # 4. Remove comment section and comment-input from card (keep only in modal)
    old_comment_section = """'<div class="post-comments" id="'+cId+'"></div>'+
        '<div class="comment-input"><input id="'+cInputId+'" placeholder="输入评论..." onkeydown="if(event.key==\\'Enter\\')addComment('+pId+',\\''+cInputId+'\\',\\''+cId+'\\')"><button onclick="addComment('+pId+',\\''+cInputId+'\\',\\''+cId+'\\')">评论</button></div>'+"""
    new_comment_section = """// comments in modal only"""+'''\n        '''
    c = c.replace(old_comment_section, new_comment_section)
    
    # 5. Also remove the post-render comments loading and the cId/cInputId vars
    old_post_render = """    // Load comments for each post
    posts.forEach(function(p){
      var cId='comments_'+p.id;
      loadComments(p.id, cId);
    });"""
    c = c.replace(old_post_render, '')
    
    # 6. Remove the cId and cInputId variable declarations from the template
    old_var_decls = """var cId='comments_'+pId;
      var cInputId='cinput_'+pId;"""
    c = c.replace(old_var_decls, """""")
    
    # 7. Add modal JS functions before the last script closing
    modal_js = '''
var currentModalPostId = null;

function openPostModal(postId){
  var token=localStorage.getItem('abi_token');
  var posts=window._cachedPosts||[];
  var p=posts.find(function(x){return x.id===postId;});
  if(!p){alert('帖子数据加载失败');return;}
  currentModalPostId=postId;
  document.getElementById('modalTitle').textContent=p.title||'无标题';
  document.getElementById('modalBody').textContent=p.content||'';
  document.getElementById('modalAuthor').textContent=(p.author||'匿名');
  document.getElementById('modalDate').textContent=p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'';
  var cat=p.category||'general';
  var catNames={'general':'杂谈','question':'问答','guide':'攻略','showoff':'炫耀'};
  var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
  var catEl=document.getElementById('modalCategory');
  catEl.textContent=catNames[cat]||'杂谈';
  catEl.style.background=hue+'22';
  catEl.style.color=hue;
  // Images
  var imgEl=document.getElementById('modalImages');
  var imgs=((p.images&&typeof p.images==='string')?JSON.parse(p.images):[])||[];
  imgEl.innerHTML=imgs.length ? imgs.map(function(u){return '<img src="'+u+'" onclick="window.open(this.src)">';}).join('') : '';
  // Delete button
  var delBtn=document.getElementById('modalDelBtn');
  var userName=getUserName();
  delBtn.style.display=(token&&p.author===userName)?'inline':'none';
  // Load comments
  loadComments(postId, 'modalComments');
  document.getElementById('postModal').style.display='block';
  document.body.style.overflow='hidden';
}

function closePostModal(){
  document.getElementById('postModal').style.display='none';
  document.body.style.overflow='';
}

function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var author=getUserName();
  (async function(){
    try{
      var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
        method:'POST',
        headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify({post_id:currentModalPostId,content:content,author:author})
      });
      if(!r.ok){var err=await r.json().catch(function(){});alert('评论失败: '+(err&&err.message||r.status));return;}
      alert('\\u2705 评论成功');
      input.value='';
      loadComments(currentModalPostId, 'modalComments');
    }catch(e){alert('评论失败: '+e.message);}
  })();
}

async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+currentModalPostId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok){var err=await r.json().catch(function(){});alert('删除失败'+(err?': '+err.message:''));return;}
    alert('\\uD83D\\uDDD1 帖子已删除');
    closePostModal();
    loadPosts();
  }catch(e){alert('删除失败: '+e.message);}
}
'''
    script_end = c.rfind('</script>')
    c = c[:script_end] + '\n' + modal_js + '\n' + c[script_end:]
    
    # 8. Save cached posts for modal lookup
    old_join2 = """    }).join('');
  }catch(e){"""
    new_join2 = """    }).join('');
    window._cachedPosts=posts;
  }catch(e){"""
    c = c.replace(old_join2, new_join2)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': post detail modal added')

print('ALL DONE')
