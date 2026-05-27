files = [
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html'
]

import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # The upload uses Date.now() in the path, but the URL push also uses Date.now()
    # We need to use the SAME filename for both
    # Rewrite to generate the filename once
    
    old_pattern = """      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg',{
          method:'POST',
          headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg');
        }"""
    
    new_pattern = """      var imgName=Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg';
      var formData=new FormData();
      formData.append('file',f);
      try{
        var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+imgName,{
          method:'POST',
          headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
          body:formData
        });
        if(uploadRes.ok){
          images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+imgName);
        }"""
    
    c = c.replace(old_pattern, new_pattern)
    
    # Same fix for comment images  
    old_comment_pattern = """      var formData=new FormData();
        formData.append('file',f);
        try{
          var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/comment_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg',{
            method:'POST',
            headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
            body:formData
          });
          if(uploadRes.ok){
            images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/comment_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg');
          }"""
    
    new_comment_pattern = """      var imgName='c_'+Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg';
        var formData=new FormData();
        formData.append('file',f);
        try{
          var uploadRes=await fetch(SUPABASE_URL+'/storage/v1/object/post_images/'+imgName,{
            method:'POST',
            headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'x-upsert':'false'},
            body:formData
          });
          if(uploadRes.ok){
            images.push(SUPABASE_URL+'/storage/v1/object/public/post_images/'+imgName);
          }"""
    
    c = c.replace(old_comment_pattern, new_comment_pattern)
    
    open(fp, 'w', encoding='utf8').write(c)
    
    # Verify
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    still_broken = "Date.now()+'_'+Math.random().toString(36).slice(2,8)+'.jpg'" in s.replace("imgName+", "REPLACED")
    print(f"{fp.split('/')[-1]}: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok}")

print('ALL DONE')
