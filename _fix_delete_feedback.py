files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix deletePostFromModal - add console.log and better feedback
    old_del = """async function deletePostFromModal(){
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
}"""
    
    new_del = """async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  console.log('Deleting post:', currentModalPostId);
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+currentModalPostId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    console.log('DELETE status:', r.status);
    if(r.status===204||r.status===200){
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else{
      var txt=await r.text();
      console.error('DELETE failed:', txt);
      alert('删除失败 ('+r.status+'): '+(txt||'无权限'));
    }
  }catch(e){alert('删除失败: '+e.message);}
}"""
    
    c = c.replace(old_del, new_del)
    
    # Also fix deleteComment
    old_delc = """async function deleteComment(commentId, containerId, postId){
  if(!confirm('确定删除这条评论？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments?id=eq.'+commentId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok){var err=await r.json().catch(function(){});alert('删除失败'+(err?': '+err.message:''));return;}
    alert('评论已删除');
    loadComments(postId, containerId);
  }catch(e){alert('删除失败: '+e.message);
  }
}"""
    
    new_delc = """async function deleteComment(commentId, containerId, postId){
  if(!confirm('确定删除这条评论？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  console.log('Deleting comment:', commentId);
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments?id=eq.'+commentId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    console.log('DELETE comment status:', r.status);
    if(r.status===204||r.status===200){
      alert('评论已删除');
      loadComments(postId, containerId);
    }else{
      var txt=await r.text();
      console.error('DELETE comment failed:', txt);
      alert('删除评论失败 ('+r.status+'): '+(txt||'无权限'));
    }
  }catch(e){alert('删除失败: '+e.message);
  }
}"""
    
    c = c.replace(old_delc, new_delc)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
