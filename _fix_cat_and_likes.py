import re

# gear.html: category=guide
# strategy.html: category=general  
# weapons.html: category=showoff
mapping = {
    'gear.html': 'guide',
    'strategy.html': 'general',
    'weapons.html': 'showoff'
}

for fn, cat_filter in mapping.items():
    fp = f'F:/暗区突围网站/pages/{fn}'
    c = open(fp, 'r', encoding='utf8').read()
    
    # 1. Fix loadPosts: add category filter + order by likes
    old_load = "var r=await db('GET','map_posts',null,'order=created_at.desc&limit=50');"
    new_load = f"var r=await db('GET','map_posts',null,'category=eq.{cat_filter}&order=created_at.desc&limit=50');"
    c = c.replace(old_load, new_load)
    print(f"{fn}: category filter -> {cat_filter}")
    
    # 2. Fix post form default category
    old_cat = "'postCategory');\n    var category=cat?cat.value:'general';"
    new_cat = f"'postCategory');\n    var category=cat?cat.value:'{cat_filter}';"
    c = c.replace(old_cat, new_cat)
    
    # 3. Fix the modal form too
    old_form_cat = "'postCategoryModal');\n  var category=cat?cat.value:'general';"
    new_form_cat = f"'postCategoryModal');\n  var category=cat?cat.value:'{cat_filter}';"
    c = c.replace(old_form_cat, new_form_cat)
    
    # 4. Add likes display + like button in post card and modal
    # Add likes_count to card
    # Find the card template return
    old_card_likes = "delBtn+'</div>'"
    new_card_likes = "delBtn+'</div>'+'<div style=\"margin-top:4px;display:flex;gap:8px;align-items:center;\">'+(p.likes_count!==undefined?'<span style=\"font-size:0.7rem;color:#888;\">❤️ '+(p.likes_count||0)+'</span>':'')+'</div>'"
    if old_card_likes in c:
        c = c.replace(old_card_likes, new_card_likes)
    
    # 5. Add likes in the modal - find modalLikes span and ensure it exists
    # Check if modal already has likes
    if "modalLikes" not in c:
        # Add likes to modal meta area
        old_meta = "<span id=\"modalDate\"></span>"
        new_meta = "<span id=\"modalDate\"></span><span id=\"modalLikes\" class=\"like-btn\" onclick=\"toggleLike()\">❤️ 0</span>"
        c = c.replace(old_meta, new_meta)
    
    # 6. Add toggleLike function if not present
    if "async function toggleLike" not in c:
        toggle_fn = """
async function toggleLike(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var id=currentModalPostId;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/like_post',{
      method:'POST',
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json'},
      body:JSON.stringify({post_id:id})
    });
    if(r.ok){
      var newCount=await r.json();
      var el=document.getElementById('modalLikes');
      if(el)el.textContent='❤️ '+(newCount||0);
      loadPosts();
    }else{
      alert('点赞失败');
    }
  }catch(e){alert('点赞失败: '+e.message);}
}
"""
        # Insert before loadComments function
        c = c.replace("async function loadComments", toggle_fn + "\nasync function loadComments")
    
    # 7. Force likes_count to order in loadPosts (already has order=created_at.desc in API)
    # Also change sort to likes first
    c = c.replace(
        "'category=eq." + cat_filter + "&order=created_at.desc&limit=50'",
        "'category=eq." + cat_filter + "&order=likes_count.desc.nullslast,created_at.desc&limit=50'"
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fn}: added likes + category filter")

# Verify all three
print('\n--- Verify ---')
for fn in ['gear.html', 'strategy.html', 'weapons.html']:
    c = open(f'F:/暗区突围网站/pages/{fn}', 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"{fn}: {ob}={cb} ({op}={cp}) {ok} | has_likes={'toggleLike' in s} | has_modalLikes={'modalLikes' in c}")
