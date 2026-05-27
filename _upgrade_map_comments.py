"""
Upgrade map comment system with login check, delete button, username display (like post comments)
All 6 map pages. Uses map_comments table (separate from post_comments).
Fields: map_name, text, user_name, created_at
"""

# New renderMapComments with login check + delete
new_render_map = """function renderMapComments(){
  var list=document.getElementById('mcList');
  if(!list)return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  if(!mapComments||mapComments.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">\\u6682\\u65e0\\u8bc4\\u8bba</div>';
    return;
  }
  list.innerHTML=mapComments.map(function(c){
    var delBtn=(token&&c.user_name===userName)?'<button class="c-del" onclick="deleteMapComment(\''+c.id+'\',\''+containerId+'\')">\\u5220\\u9664</button>':'';
    return '<div class="c-item"><div class="c-hdr"><span class="c-author">'+esc(c.user_name||'\\u533f\\u540d')+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'')+'</span></div><div class="c-body">'+esc(c.text||'')+'</div>'+(delBtn?'<div class="c-actions">'+delBtn+'</div>':'')+'</div>';
  }).join('');
}"""

# New renderPinComments
new_render_pin = """function renderPinComments(){
  var list=document.getElementById('pdcList');
  if(!list)return;
  if(curPinIdx===null||!pins[curPinIdx])return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  var cs=pins[curPinIdx].comments||[];
  if(cs.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">\\u6682\\u65e0\\u8bc4\\u8bba</div>';
    return;
  }
  list.innerHTML=cs.map(function(c){
    var delBtn=(token&&c.user_name===userName)?'<button class="c-del" onclick="deletePinComment(\''+c.id+'\',\''+curPinIdx+'\')">\\u5220\\u9664</button>':'';
    return '<div class="c-item"><div class="c-hdr"><span class="c-author">'+esc(c.user_name||'\\u533f\\u540d')+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'')+'</span></div><div class="c-body">'+esc(c.text||'')+'</div>'+(delBtn?'<div class="c-actions">'+delBtn+'</div>':'')+'</div>';
  }).join('');
}"""

# New submitMapComment with login check
new_submit_map = """async function submitMapComment(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  var input=document.getElementById('mcInput');
  var content=input.value.trim();
  if(!content){alert('\\u8bf7\\u8f93\\u5165\\u8bc4\\u8bba\\u5185\\u5bb9');return;}
  var user_name=getUserName()||'\\u533f\\u540d';
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({map_name:mapNameCN,text:content,user_name:user_name})
    });
    if(r.ok||r.status===204||r.status===201){
      input.value='';
      loadMapComments();
    }else{
      alert('\\u8bc4\\u8bba\\u5931\\u8d25');
    }
  }catch(e){
    alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);
  }
}"""

# New submitPinComment with login check
new_submit_pin = """async function submitPinComment(){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  if(curPinIdx===null)return;
  var input=document.getElementById('pdcInput');
  var content=input.value.trim();
  if(!content){alert('\\u8bf7\\u8f93\\u5165\\u8bc4\\u8bba\\u5185\\u5bb9');return;}
  var user_name=getUserName()||'\\u533f\\u540d';
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({map_name:mapNameCN,text:content,user_name:user_name})
    });
    if(r.ok||r.status===204||r.status===201){
      input.value='';
      loadPinComments(curPinIdx);
    }else{
      alert('\\u8bc4\\u8bba\\u5931\\u8d25');
    }
  }catch(e){
    alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);
  }
}"""

# Need delete functions
new_delete_map = """async function deleteMapComment(commentId,containerId){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  if(!confirm('\\u786e\\u5b9a\\u5220\\u9664\\u8bc4\\u8bba\\uff1f'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_map_comment',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({comment_id:parseInt(commentId)})
    });
    if(r.ok){
      loadMapComments();
    }else{
      alert('\\u5220\\u9664\\u5931\\u8d25');
    }
  }catch(e){
    alert('\\u5220\\u9664\\u5931\\u8d25: '+e.message);
  }
}"""

new_delete_pin = """async function deletePinComment(commentId,pinIdx){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  if(!confirm('\\u786e\\u5b9a\\u5220\\u9664\\u8bc4\\u8bba\\uff1f'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_map_comment',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({comment_id:parseInt(commentId)})
    });
    if(r.ok){
      loadPinComments(parseInt(pinIdx));
    }else{
      alert('\\u5220\\u9664\\u5931\\u8d25');
    }
  }catch(e){
    alert('\\u5220\\u9664\\u5931\\u8d25: '+e.message);
  }
}"""

files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

repl = {
    'function renderMapComments()': 'renderMapComments',
    'function renderPinComments()': 'renderPinComments',
    'async function submitMapComment()': new_submit_map,
    'async function submitPinComment()': new_submit_pin,
}

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Replace renderMapComments
    for search_key, new_val in [('function renderMapComments(){', new_render_map), 
                                   ('function renderPinComments(){', new_render_pin)]:
        # Find the old function by search
        start = c.find(search_key)
        if start >= 0:
            depth = 0
            i = start
            while i < len(c):
                if c[i] == '{': depth += 1
                elif c[i] == '}':
                    depth -= 1
                    if depth == 0:
                        old = c[start:i+1]
                        c = c[:start] + new_val + c[i+1:]
                        print(f'{fp.split("/")[-1]}: replaced {search_key[18:]} ({len(old)} chars)')
                        break
                i += 1
    
    # Replace submitMapComment
    start = c.find('async function submitMapComment(){')
    if start >= 0:
        depth = 0
        i = start
        while i < len(c):
            if c[i] == '{': depth += 1
            elif c[i] == '}':
                depth -= 1
                if depth == 0:
                    old = c[start:i+1]
                    c = c[:start] + new_submit_map + c[i+1:]
                    print(f'{fp.split("/")[-1]}: replaced submitMapComment ({len(old)} chars)')
                    break
            i += 1
    
    # Replace submitPinComment
    start = c.find('async function submitPinComment(){')
    if start >= 0:
        depth = 0
        i = start
        while i < len(c):
            if c[i] == '{': depth += 1
            elif c[i] == '}':
                depth -= 1
                if depth == 0:
                    old = c[start:i+1]
                    c = c[:start] + new_submit_pin + c[i+1:]
                    print(f'{fp.split("/")[-1]}: replaced submitPinComment ({len(old)} chars)')
                    break
            i += 1
    
    # Add delete functions (after submitPinComment)
    # Find a good insertion point - after loadMapComments function
    if 'async function deleteMapComment' not in c:
        # Insert before last </script>
        c = c.replace('</script>', '\n' + new_delete_map + '\n' + new_delete_pin + '\n</script>')
        print(f'{fp.split("/")[-1]}: added delete functions')
    
    open(fp, 'w', encoding='utf8').write(c)
    print()

# Verify
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_del = 'deleteMapComment' in c2
    print(f"{fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp} | has_delete={has_del}")
