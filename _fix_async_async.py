files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Fix 1: async async -> async (remove duplicate)
    c = c.replace('async async function', 'async function')
    
    # Fix 2: Remove the nested (async function(){ try{ }) wrapper and replace with simpler version
    # Pattern: the addCommentFromModal function with nested async wrapper
    old_fn = """async function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  var author=getUserName();
  (async function(){
    try{
      var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
        method:'POST',
        headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify({post_id:currentModalPostId,content:content,author:author})
      });
      if(r.ok||r.status===204||r.status===201){
        var ci=document.getElementById('modalCommentInput');
        if(ci)ci.value='';
        loadComments(currentModalPostId,'modalComments');
      }else{
        var err=await r.text();
        alert('\\u53d1\\u5e03\\u5931\\u8d25:'+err);
      }
    }catch(e){
      alert('\\u53d1\\u5e03\\u5931\\u8d25:'+e.message);
    }
  })();
}"""
    
    new_fn = """async function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('\\u8bf7\\u8f93\\u5165\\u8bc4\\u8bba\\u5185\\u5bb9');return;}
  var author=getUserName()||'\\u533f\\u540d';
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({post_id:currentModalPostId,content:content,author:author})
    });
    if(r.ok||r.status===204||r.status===201){
      var ci=document.getElementById('modalCommentInput');
      if(ci)ci.value='';
      loadComments(currentModalPostId,'modalComments');
    }else{
      var err=await r.text();
      alert('\\u53d1\\u5e03\\u5931\\u8d25:'+err);
    }
  }catch(e){
    alert('\\u53d1\\u5e03\\u5931\\u8d25:'+e.message);
  }
}"""
    
    c = c.replace(old_fn, new_fn)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed addCommentFromModal")

# Verify
print()
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = __import__('re').findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {'OK' if ob==cb and op==cp else 'FAIL'} | async_async={c2.count('async async')}")
