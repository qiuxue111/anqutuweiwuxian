files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix addCommentFromModal - use anon key everywhere
    old = """async function addCommentFromModal(){
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
    
    new = """async function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
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
            headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
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
}"""
    c = c.replace(old, new)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed addCommentFromModal")

print('DONE')
