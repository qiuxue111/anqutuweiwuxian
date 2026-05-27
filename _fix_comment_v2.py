import re

files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

# New unified function
new_fn = """async function addCommentFromModal(){
  var input=document.getElementById('modalCommentInput');
  var content=input?input.value.trim():'';
  if(!content){alert('请输入评论内容');return;}
  var token=localStorage.getItem('abi_token');
  if(!token){alert('请先登录');return;}
  var author=getUserName();
  try{
    var body={post_id:currentModalPostId,content:content,author:author};
    if(commentImages&&commentImages.length>0){
      var imgUrls=[];
      for(var i=0;i<commentImages.length;i++){
        var f=commentImages[i];
        var fn='comment_'+Date.now()+'_'+i+'.jpg';
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
    if(!r.ok){var err=await r.json().catch(function(){});alert('评论失败: '+(err&&err.message?err.message:r.status));return;}
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
    alert('发布失败:'+e.message);
  }
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find the old function by regex
    pattern = r'function addCommentFromModal\(\)\{[\s\S]*?\}'
    matches = list(re.finditer(pattern, c))
    
    if matches:
        # Take the LAST match (should be the full function)
        old_fn = matches[-1].group()
        # But it might be truncated (greedy match stops at first })
        # Find the actual end by counting braces
        start = c.find('function addCommentFromModal')
        depth = 0
        i = start
        while i < len(c):
            if c[i] == '{': depth += 1
            elif c[i] == '}':
                depth -= 1
                if depth == 0:
                    # Found function end
                    old_fn = c[start:i+1]
                    break
            i += 1
        
        c = c[:start] + new_fn + c[i+1:]
        open(fp, 'w', encoding='utf8').write(c)
        print(f"{fp.split('/')[-1]}: replaced addCommentFromModal ({len(old_fn)} chars -> {len(new_fn)} chars)")
    else:
        print(f"{fp.split('/')[-1]}: addCommentFromModal NOT found")

# Verify
print()
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_bearer_token = c2.count("'Bearer '+token") > 0
    print(f"{fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp} | JWT_header={has_bearer_token}")
