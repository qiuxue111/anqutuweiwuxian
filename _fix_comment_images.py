files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # Update modal comment section to support images
    old_modal_comment = """<h4>💬 评论</h4>
    <div id="modalComments" class="post-comments"></div>
    <div class="comment-input">
      <input id="modalCommentInput" placeholder="输入评论..." onkeydown="if(event.key==='Enter')addCommentFromModal()">
      <button onclick="addCommentFromModal()">评论</button>
    </div>"""
    
    new_modal_comment = """<h4>💬 评论</h4>
    <div id="modalComments" class="post-comments"></div>
    <div class="comment-input">
      <input id="modalCommentInput" placeholder="输入评论..." onkeydown="if(event.key==='Enter')addCommentFromModal()">
      <button class="file-btn" onclick="document.getElementById('commentImages').click()" title="添加图片" style="width:30px;height:30px;font-size:1.1rem;margin-right:4px;">+</button>
      <input id="commentImages" type="file" accept="image/*" multiple style="display:none;" onchange="previewCommentFiles(this)">
      <button onclick="addCommentFromModal()">评论</button>
    </div>
    <div id="commentFilePreview" class="file-preview" style="margin-top:4px;"></div>"""
    c = c.replace(old_modal_comment, new_modal_comment)
    
    # Update addCommentFromModal to support images
    old_add = """function addCommentFromModal(){
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
      alert('\u2705 评论成功');
      input.value='';
      loadComments(currentModalPostId, 'modalComments');
    }catch(e){alert('评论失败: '+e.message);}
  })();
}"""
    
    new_add = """function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var author=getUserName();
  (async function(){
    // Upload images if any
    var fileInput=document.getElementById('commentImages');
    var images=[];
    if(fileInput&&fileInput.files.length>0){
      for(var i=0;i<fileInput.files.length;i++){
        var f=fileInput.files[i];
        if(!f.type.startsWith('image/')){alert('只支持图片文件');return;}
        if(f.size>5*1024*1024){alert('单张图片不能超过5MB');return;}
        var formData=new FormData();
        formData.append('file',f);
        try{
          var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/comment_'+Date.now()+'_'+f.name,{
            method:'POST',
            headers:{'Authorization':'Bearer '+token,'x-upsert':'false'},
            body:formData
          });
          if(uploadRes.ok){
            images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/comment_'+Date.now()+'_'+f.name);
          }
        }catch(e){console.error('Upload failed',e);}
      }
    }
    try{
      var body={post_id:currentModalPostId,content:content,author:author};
      if(images.length)body.images=JSON.stringify(images);
      var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
        method:'POST',
        headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
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
}"""
    c = c.replace(old_add, new_add)
    
    # Add previewCommentFiles function
    preview_comment_fn = '''
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
        img.src=e.target.result;
        img.style.cssText='width:50px;height:50px;border-radius:4px;object-fit:cover;border:1px solid #1e1e2a;';
        preview.appendChild(img);
      };
      reader.readAsDataURL(file);
    })(input.files[i]);
  }
}
'''
    old_fn = "function deletePostFromModal"
    c = c.replace("function loadComments", preview_comment_fn + "\nfunction loadComments")
    
    # Update loadComments to show images in comments
    old_inner = """el.innerHTML=comments.map(function(c){
      var delBtn=(token&&c.author===userName)?'<button class="c-del" onclick="deleteComment('+c.id+',\\''+containerId+'\\','+postId+')">删除</button>':'';
      return '<div class="comment"><span class="c-author">'+esc(c.author)+'</span><span class="c-text">'+esc(c.content)+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'')+'</span>'+delBtn+'</div>';
    }).join('');"""
    new_inner = """el.innerHTML=comments.map(function(c){
      var delBtn=(token&&c.author===userName)?'<button class="c-del" onclick="deleteComment('+c.id+',\\''+containerId+'\\','+postId+')">删除</button>':'';
      var cimgs=(c.images&&typeof c.images==='string')?JSON.parse(c.images):[];
      var cimgHTML=cimgs.length?'<div style="display:flex;gap:4px;margin-top:2px;">'+cimgs.map(function(u){return '<img src="'+u+'" style="max-width:80px;max-height:60px;border-radius:4px;object-fit:cover;cursor:pointer;border:1px solid #1e1e2a;" onclick="window.open(this.src)">';}).join('')+'</div>':'';
      return '<div class="comment"><span class="c-author">'+esc(c.author)+'</span><span class="c-text">'+esc(c.content)+cimgHTML+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}):'')+'</span>'+delBtn+'</div>';
    }).join('');"""
    c = c.replace(old_inner, new_inner)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': comment images + UI updated')

print('DONE')
