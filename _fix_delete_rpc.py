files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    old = """async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  console.log('Deleting post:', currentModalPostId);
  try{
    // Try using the db() function instead
    var r=await db('DELETE','map_posts',null,'id=eq.'+currentModalPostId+'&author=eq.'+encodeURIComponent(getUserName()));
    console.log('DELETE response:', r);
    console.log('DELETE status:', r.status);
    if(r.ok){
      var txt=await r.text();
      console.log('DELETE body:', txt);
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else{
      var txt=await r.text();
      console.error('DELETE failed:', r.status, txt);
      alert('删除失败 ('+r.status+'): '+(txt||'无响应'));
    }
  }catch(e){alert('删除失败: '+e.message);}
}"""
    
    new = """async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  console.log('Deleting post via RPC:', currentModalPostId);
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_post',{
      method:'POST',
      headers:{
        'Authorization':'Bearer '+SUPABASE_ANON,
        'apiKey':SUPABASE_ANON,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({post_id:currentModalPostId})
    });
    console.log('RPC DELETE status:', r.status);
    if(r.status===200||r.status===204){
      var result=await r.text();
      console.log('RPC result:', result);
      if(result==='true'||result===''){
        alert('\\uD83D\\uDDD1 帖子已删除');
        closePostModal();
        loadPosts();
      }else{
        alert('删除失败：可能没有权限');
      }
    }else{
      var txt=await r.text();
      console.error('RPC DELETE failed:', txt);
      alert('删除失败 ('+r.status+'): '+(txt||'无响应'));
    }
  }catch(e){alert('删除失败: '+e.message);}
}"""
    
    c = c.replace(old, new)
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed to use RPC")

print('DONE')
