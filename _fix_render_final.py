files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

new_render_map = """function renderMapComments(){
  var list=document.getElementById('mcList');
  if(!list)return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  if(!mapComments||mapComments.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">暂无评论</div>';
    return;
  }
  var html='';
  for(var i=0;i<mapComments.length;i++){
    var c=mapComments[i];
    html+='<div class="c-item">';
    html+='<div class="c-hdr"><span class="c-author">'+esc(c.user_name||'匿名')+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'')+'</span></div>';
    html+='<div class="c-body">'+esc(c.text||'')+'</div>';
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deleteMapComment('+c.id+')">删除</button></div>';
    }
    html+='</div>';
  }
  list.innerHTML=html;
}"""

new_render_pin = """function renderPinComments(){
  var list=document.getElementById('pdcList');
  if(!list)return;
  if(curPinIdx===null||!pins[curPinIdx])return;
  var token=localStorage.getItem('abi_token');
  var userName=getUserName();
  var cs=pins[curPinIdx].comments||[];
  if(cs.length===0){
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">暂无评论</div>';
    return;
  }
  var html='';
  for(var i=0;i<cs.length;i++){
    var c=cs[i];
    html+='<div class="c-item">';
    html+='<div class="c-hdr"><span class="c-author">'+esc(c.user_name||'匿名')+'</span><span class="c-time">'+(c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'')+'</span></div>';
    html+='<div class="c-body">'+esc(c.text||'')+'</div>';
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deletePinComment('+c.id+','+curPinIdx+')">删除</button></div>';
    }
    html+='</div>';
  }
  list.innerHTML=html;
}"""

# Also need to update deleteMapComment to not take containerId
new_delete_map = """async function deleteMapComment(commentId){
  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  if(!confirm('\\u786e\\u5b9a\\u5220\\u9664\\u8bc4\\u8bba\\uff1f'))return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/rpc/delete_my_map_comment',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({comment_id:commentId})
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
      body:JSON.stringify({comment_id:commentId})
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

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Replace renderMapComments
    for fn_name, new_fn in [('function renderMapComments(){', new_render_map), 
                              ('function renderPinComments(){', new_render_pin),
                              ('async function deleteMapComment(', new_delete_map),
                              ('async function deletePinComment(', new_delete_pin)]:
        start = c.find(fn_name)
        if start >= 0:
            depth = 0
            i = start
            while i < len(c):
                if c[i] == '{': depth += 1
                elif c[i] == '}':
                    depth -= 1
                    if depth == 0:
                        old = c[start:i+1]
                        c = c[:start] + new_fn + c[i+1:]
                        print(f'{fp.split("/")[-1]}: replaced {fn_name[:30]} ({len(old)} chars)')
                        break
                i += 1
    
    open(fp, 'w', encoding='utf8').write(c)

# Verify
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp}")
