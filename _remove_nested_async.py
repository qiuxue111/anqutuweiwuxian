files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Remove the nested (async function(){ ... })();
    # Pattern inside addCommentFromModal after try{:
    #   (async function(){
    # before the await fetch
    # and the closing  })(); at end of try block
    
    old_wrapper = """  (async function(){
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
  })();"""
    
    new_inner = """  try{
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
  }"""
    
    c = c.replace(old_wrapper, new_inner)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: removed nested async wrapper")

# Verify
print()
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    has_nested = '(async function(){})' in c2 or '(async function()' in c2
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {'OK' if ob==cb and op==cp else 'FAIL'} | nested={has_nested}")
