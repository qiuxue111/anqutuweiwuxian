"""
Fix addCommentFromModal and loadComments in all 4 post pages:
1. Remove nested (async function(){})()
2. Replace JWT token with anon key (keep login check for UX)
3. Use proper async function pattern
"""

files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

# The exact old function code in gear/strategy/weapons
old_fn = """function addCommentFromModal(){
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
      if(!r.ok){var err=await r.json().catch(function(){});alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+(err&&err.message?err.message:r.status));return;}
      if(r.ok||r.status===204||r.status===201){
        var ci=document.getElementById('modalCommentInput');
        if(ci)ci.value='';
        var fi=document.getElementById('commentImages');
        if(fi)fi.value='';
        var pp=document.getElementById('commentPreview');
        if(pp)pp.innerHTML='';
        commentImages=[];
        loadComments(currentModalPostId,'modalComments');
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
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  var author=getUserName();
  try{
    var body={post_id:currentModalPostId,content:content,author:author};
    if(commentImages&&commentImages.length>0){
      var imgUrls=[];
      for(var i=0;i<commentImages.length;i++){
        var f=commentImages[i];
        var fn='comment_'+Date.now()+'_'+i+'.jpg';
        var fd=new FormData();
        fd.append('file',f,fn);
        var ur=await fetch(SUPABASE_URL.replace('/rest/v1','')+'/storage/v1/object/post_images/'+fn,{
          method:'POST',
          headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON},
          body:f
        });
        if(ur.ok){
          imgUrls.push(SUPABASE_URL.replace('/rest/v1','')+'/storage/v1/object/public/post_images/'+fn);
        }
      }
      if(imgUrls.length>0)body.images=JSON.stringify(imgUrls);
    }
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify(body)
    });
    if(!r.ok){var err=await r.json().catch(function(){});alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+(err&&err.message?err.message:r.status));return;}
    if(r.ok||r.status===204||r.status===201){
      var ci=document.getElementById('modalCommentInput');
      if(ci)ci.value='';
      var fi=document.getElementById('commentImages');
      if(fi)fi.value='';
      var pp=document.getElementById('commentPreview');
      if(pp)pp.innerHTML='';
      commentImages=[];
      loadComments(currentModalPostId,'modalComments');
    }
  }catch(e){
    alert('\\u53d1\\u5e03\\u5931\\u8d25:'+e.message);
  }
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    if old_fn in c:
        c = c.replace(old_fn, new_fn)
        open(fp, 'w', encoding='utf8').write(c)
        print(f"{fp.split('/')[-1]}: replaced addCommentFromModal (with image upload)")
    else:
        print(f"{fp.split('/')[-1]}: pattern NOT FOUND")
        # Check what's there
        idx = c.find('function addCommentFromModal')
        if idx >= 0:
            print(f"  Found at {idx}: {c[idx:idx+200]}")

# Verify
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_nested = '(async function()' in c2
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp} | nested={has_nested}")
