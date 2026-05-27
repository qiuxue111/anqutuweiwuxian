files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # 1. deletePost - add success toast
    old_del_post = """alert('删除失败');return;}
    loadPosts();"""
    new_del_post = """alert('删除失败'+(err&&':'+err.message||''));return;}
    alert('🗑 帖子已删除');
    loadPosts();"""
    c = c.replace(old_del_post, new_del_post)
    
    # 2. deleteComment - add success toast
    old_del_comment = """alert('删除失败');return;}
    loadComments(postId, containerId);"""
    new_del_comment = """alert('删除失败');return;}
    alert('🗑 评论已删除');
    loadComments(postId, containerId);"""
    c = c.replace(old_del_comment, new_del_comment)
    
    # 3. submitPost - add success toast (after clearing form)
    old_submit_clear = """document.getElementById('postTitle').value='';
    document.getElementById('postContent').value='';
    if(fileInput)fileInput.value='';
    var pf=document.getElementById('postForm');
    if(pf)pf.style.display='none';
    loadPosts();"""
    new_submit_clear = """alert('✅ 发布成功！');
    document.getElementById('postTitle').value='';
    document.getElementById('postContent').value='';
    if(fileInput)fileInput.value='';
    var pf=document.getElementById('postForm');
    if(pf)pf.style.display='none';
    loadPosts();"""
    c = c.replace(old_submit_clear, new_submit_clear)
    
    # 4. addComment - add success toast
    old_comment_clear = """input.value='';
    loadComments(postId, containerId);"""
    new_comment_clear = """alert('✅ 评论成功');
    input.value='';
    loadComments(postId, containerId);"""
    c = c.replace(old_comment_clear, new_comment_clear)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': toasts added')

print('DONE')
