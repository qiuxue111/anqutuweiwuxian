files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

new_open_func = '''
function openPostModal(postId){
  var token=localStorage.getItem('abi_token');
  (async function(){
    try{
      var r=await db('GET','map_posts',null,'id=eq.'+postId+'&limit=1');
      if(!r.ok){alert('加载失败');return;}
      var posts=await r.json();
      var p=posts&&posts[0];
      if(!p){alert('帖子不存在');return;}
      currentModalPostId=postId;
      document.getElementById('modalTitle').textContent=p.title||'无标题';
      document.getElementById('modalBody').textContent=p.content||'';
      document.getElementById('modalAuthor').textContent=(p.author||'匿名');
      document.getElementById('modalDate').textContent=p.created_at?new Date(p.created_at).toLocaleDateString('zh-CN'):'';
      var cat=p.category||'general';
      var catNames={'general':'杂谈','question':'问答','guide':'攻略','showoff':'炫耀'};
      var cn=catNames[cat]||'杂谈';
      var hue=cat==='guide'?'#4a9eff':cat==='question'?'#ff6b6b':cat==='showoff'?'#ffc832':'#888';
      var catEl=document.getElementById('modalCategory');
      catEl.textContent=cn;
      catEl.style.background=hue+'22';
      catEl.style.color=hue;
      var imgEl=document.getElementById('modalImages');
      var imgs=((p.images&&typeof p.images==='string')?JSON.parse(p.images):[])||[];
      imgEl.innerHTML=imgs.length?imgs.map(function(u){return '<img src="'+u+'" onclick="window.open(this.src)">';}).join(''):'';
      var delBtn=document.getElementById('modalDelBtn');
      var userName=getUserName();
      delBtn.style.display=(token&&p.author===userName)?'inline':'none';
      loadComments(postId,'modalComments');
      document.getElementById('postModal').style.display='block';
      document.body.style.overflow='hidden';
    }catch(e){alert('加载失败: '+e.message);}
  })();
}
'''

for fp in files:
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # Replace the old openPostModal function
    old_start = c.index("function openPostModal")
    old_end = c.index("function closePostModal", old_start)
    old_func = c[old_start:old_end]
    
    # Get indentation from first line
    indent = old_func[:len(old_func) - len(old_func.lstrip())]
    
    # Replace with new function
    c = c.replace(old_func, new_open_func)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fp.split('/')[-1] + ': fixed')

print('DONE')
