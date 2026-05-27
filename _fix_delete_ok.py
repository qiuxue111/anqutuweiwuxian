files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    old = """    if(r.status===204||r.status===200){
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else{
      var txt=await r.text();
      console.error('DELETE failed:', txt);
      alert('删除失败 ('+r.status+'): '+(txt||'无权限'));
    }"""
    new = """    if(r.ok){
      alert('\\uD83D\\uDDD1 帖子已删除');
      closePostModal();
      loadPosts();
    }else{
      alert('删除失败: 服务器返回 ' + r.status);
    }"""
    c = c.replace(old, new)
    
    # Same for deleteComment
    old2 = """    if(r.status===204||r.status===200){
      alert('评论已删除');
      loadComments(postId, containerId);
    }else{
      var txt=await r.text();
      console.error('DELETE comment failed:', txt);
      alert('删除评论失败 ('+r.status+'): '+(txt||'无权限'));
    }"""
    new2 = """    if(r.ok){
      alert('评论已删除');
      loadComments(postId, containerId);
    }else{
      alert('删除评论失败: 服务器返回 ' + r.status);
    }"""
    c = c.replace(old2, new2)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
