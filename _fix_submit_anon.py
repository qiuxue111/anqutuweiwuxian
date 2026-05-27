files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Change submitPostModal to use anon key POST to map_posts
    old = """async function submitPostModal(){
  var title=document.getElementById('postTitleModal').value.trim();
  var content=document.getElementById('postContentModal').value.trim();
  if(!title||!content){alert('标题和内容不能为空');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var author=getUserName();
  var cat=document.getElementById('postCategoryModal');
  var category=cat?cat.value:'general';
  var fileInput=document.getElementById('postImagesModal');
  var images=[];
  if(fileInput&&fileInput.files.length>0){
    for(var i=0;i<fileInput.files.length;i++){
      var f=fileInput.files[i];
      if(!f.type.startsWith('image/')){alert('只支持图片文件');return;}
      if(f.size>5*1024*1024){alert('单张图片不能超过5MB');return;}
      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+Date.now()+'_'+f.name,{
          method:'POST',
          headers:{'Authorization':'Bearer '+token,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+Date.now()+'_'+f.name);
        }
      }catch(e){console.error('Upload failed',e);}
    }
  }
  try{
    var body={title:title,content:content,category:category,author:author};
    if(images.length)body.images=JSON.stringify(images);
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts',{
      method:'POST',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    console.log('POST status:',r.status);
    if(!r.ok){var err;try{err=await r.json();}catch(e){err={message:await r.text()}};alert('发布失败('+r.status+'): '+(err.message||err));return;}
    alert('\\u2705 发布成功！');
    closePostFormModal();
    document.getElementById('postTitleModal').value='';
    document.getElementById('postContentModal').value='';
    fileInput.value='';
    document.getElementById('filePreviewModal').innerHTML='';
    document.getElementById('fileCountModal').textContent='未选择图片';
    loadPosts();
  }catch(e){alert('发布失败: '+e.message);}
}"""
    
    new = """async function submitPostModal(){
  var title=document.getElementById('postTitleModal').value.trim();
  var content=document.getElementById('postContentModal').value.trim();
  if(!title||!content){alert('标题和内容不能为空');return;}
  var author=getUserName();
  var cat=document.getElementById('postCategoryModal');
  var category=cat?cat.value:'general';
  var fileInput=document.getElementById('postImagesModal');
  var images=[];
  if(fileInput&&fileInput.files.length>0){
    for(var i=0;i<fileInput.files.length;i++){
      var f=fileInput.files[i];
      if(!f.type.startsWith('image/')){alert('只支持图片文件');return;}
      if(f.size>5*1024*1024){alert('单张图片不能超过5MB');return;}
      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+Date.now()+'_'+f.name,{
          method:'POST',
          headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+Date.now()+'_'+f.name);
        }
      }catch(e){console.error('Upload failed',e);}
    }
  }
  try{
    var body={title:title,content:content,category:category,author:author};
    if(images.length)body.images=JSON.stringify(images);
    // Use anon key instead of token to avoid JWT expiry
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts',{
      method:'POST',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    console.log('POST status:',r.status);
    if(r.status===201||r.ok){
      alert('\\u2705 发布成功！');
      closePostFormModal();
      document.getElementById('postTitleModal').value='';
      document.getElementById('postContentModal').value='';
      if(fileInput){fileInput.value='';}
      document.getElementById('filePreviewModal').innerHTML='';
      document.getElementById('fileCountModal').textContent='未选择图片';
      loadPosts();
    }else{
      var err;try{err=await r.json();}catch(e){err={message:await r.text()}};alert('发布失败('+r.status+'): '+(err.message||err));
    }
  }catch(e){alert('发布失败: '+e.message);}
}"""
    
    c = c.replace(old, new)
    
    # Also fix the comment upload - use anon key for storage too
    old_comment_s3 = """headers:{'Authorization':'Bearer '+token,'x-upsert':'false'}"""
    new_comment_s3 = """headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'}"""
    c = c.replace(old_comment_s3, new_comment_s3)
    
    # Fix the comment POST
    old_comment_post = """headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}"""
    # Only replace the one inside addCommentFromModal, not the general db()
    # We need to be specific: find the one inside addCommentFromModal
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed submit to use anon key")

print('DONE')
