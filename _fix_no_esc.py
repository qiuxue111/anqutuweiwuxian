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
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">\\u6682\\u65e0\\u8bc4\\u8bba</div>';
    return;
  }
  var html='';
  for(var i=0;i<mapComments.length;i++){
    var c=mapComments[i];
    var un=c.user_name||'\\u533f\\u540d';
    var txt=c.text||'';
    var time=c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    html+='<div class="c-item"><div class="c-hdr"><span class="c-author">'+un+'</span><span class="c-time">'+time+'</span></div><div class="c-body">'+txt+'</div>';
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deleteMapComment('+c.id+')">\\u5220\\u9664</button></div>';
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
    list.innerHTML='<div style="color:#555;font-size:0.75rem;padding:8px;">\\u6682\\u65e0\\u8bc4\\u8bba</div>';
    return;
  }
  var html='';
  for(var i=0;i<cs.length;i++){
    var c=cs[i];
    var un=c.user_name||'\\u533f\\u540d';
    var txt=c.text||'';
    var time=c.created_at?new Date(c.created_at).toLocaleString('zh-CN',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit'}):'';
    html+='<div class="c-item"><div class="c-hdr"><span class="c-author">'+un+'</span><span class="c-time">'+time+'</span></div><div class="c-body">'+txt+'</div>';
    if(token&&c.user_name===userName){
      html+='<div class="c-actions"><button class="c-del" onclick="deletePinComment('+c.id+','+curPinIdx+')">\\u5220\\u9664</button></div>';
    }
    html+='</div>';
  }
  list.innerHTML=html;
}"""

new_esc = """function esc(s){
  if(!s)return'';
  var d=document.createElement('div');
  d.appendChild(document.createTextNode(s||''));
  return d.innerHTML;
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Replace renderMapComments
    for fn_name, new_fn in [('function renderMapComments(){', new_render_map), 
                              ('function renderPinComments(){', new_render_pin)]:
        start = c.find(fn_name)
        if start >= 0:
            depth = 0
            i = start
            while i < len(c):
                if c[i] == '{': depth += 1
                elif c[i] == '}':
                    depth -= 1
                    if depth == 0:
                        c = c[:start] + new_fn + c[i+1:]
                        break
                i += 1
    
    # Check if esc function exists
    if 'function esc(' not in c:
        # Add esc before the first function that needs it
        # Insert after supabase stuff, before renderMapComments
        mc_idx = c.find('function renderMapComments')
        if mc_idx >= 0:
            c = c[:mc_idx] + new_esc + '\n\n' + c[mc_idx:]
            print(f'{fp.split("/")[-1]}: added esc function')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f'{fp.split("/")[-1]}: replaced renders')

import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_esc = 'function esc(' in c2
    print(f"  {fp.split('/')[-1]}: {ok} {ob}={cb} {op}={cp} esc={has_esc}")
