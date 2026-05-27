files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    old = """async function deletePostFromModal(){"""
    new = """async function deletePostFromModal(){"""
    # Find and replace the whole function
    st = c.index("async function deletePostFromModal")
    en = c.index("async function addCommentFromModal", st) if "async function addCommentFromModal" in c[st:] else c.index("async function deleteComment", st)
    old_fn = c[st:en-1]  # -1 for trailing newline
    if '' not in old_fn:  # Make sure we got something
        pass
    
    new_fn = """async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  console.log('Deleting post:', currentModalPostId);
  try{
    // Try raw fetch with Prefer count
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+currentModalPostId,{
      method:'DELETE',
      headers:{
        'Authorization':'Bearer '+token,
        'apiKey':SUPABASE_ANON,
        'Prefer':'count=exact'
      }
    });
    console.log('DELETE status:', r.status);
    var txt=await r.text();
    console.log('DELETE response body:', txt);
    var count=r.headers.get('content-range');
    console.log('Content-Range:', count);
    if(r.ok && r.status===204){
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else if(r.status===200){
      // Supabase sometimes returns 200 with body
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else{
      alert('删除失败 ('+r.status+'): '+(txt||'无响应'));
    }
  }catch(e){alert('删除失败: '+e.message);}
}"""
    
    c = c.replace(old_fn, new_fn)
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
