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
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_posts?id=eq.'+currentModalPostId,{
      method:'DELETE',
      headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON}
    });
    console.log('DELETE status:', r.status);
    if(r.ok){
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else{
      alert('删除失败: 服务器返回 ' + r.status);
    }
  }catch(e){alert('删除失败: '+e.message);}
}"""
    
    new = """async function deletePostFromModal(){
  if(!confirm('确定删除这条帖子？'))return;
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  console.log('Deleting post:', currentModalPostId);
  try{
    // Try using the db() function instead
    var r=await db('DELETE','map_posts',null,'id=eq.'+currentModalPostId);
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
    c = c.replace(old, new)
    
    # Also check db() supports DELETE method
    # Find the db() function and make sure it handles DELETE
    if 'case \'DELETE\'' not in c and 'case "DELETE"' not in c:
        # Add DELETE to db()
        old_db = """    case 'PATCH':"""
        new_db = """    case 'DELETE':
      var config={method:'DELETE',headers:headers,mode:'cors'};
      if(filter)url+='?'+filter;
      break;
    case 'PATCH':"""
        c = c.replace(old_db, new_db)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
