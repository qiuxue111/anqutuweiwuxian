import re

files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # 1. Fix submitMapComment - remove pin_id and fix field names
    # Find it by pattern: submitMapComment(){ ... }
    old = """function submitMapComment(){var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;var un=getUserName();var author=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,content:text,author:author})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    new = """async function submitMapComment(){var input=document.getElementById('mcInput');var txt=input.value.trim();if(!txt)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    c = c.replace(old, new)
    
    # 2. Fix submitPinComment - remove pin_id and fix fields
    old2 = """function submitPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;var un=getUserName();var author=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,pin_id:pins[curPinIdx].id||null,content:text,author:author})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    new2 = """async function submitPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var txt=input.value.trim();if(!txt)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    c = c.replace(old2, new2)
    
    # 3. Fix loadMapComments - remove pin_id=is.null
    old3 = """async function loadMapComments(){
  try{
    var enc=encodeURIComponent(mapNameCN);
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&pin_id=is.null&order=created_at.asc',{
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    mapComments=data||[];
    renderMapComments();
  }catch(e){console.error('loadMapComments err',e);}
}"""
    new3 = """async function loadMapComments(){
  try{
    var enc=encodeURIComponent(mapNameCN);
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&order=created_at.asc',{
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    mapComments=data||[];
    renderMapComments();
  }catch(e){console.error('loadMapComments err',e);
  }
}"""
    c = c.replace(old3, new3)
    
    # 4. Fix loadPinComments - remove pin_id filter
    old4 = """async function loadPinComments(pinIdx){
  if(pinIdx===null||pinIdx===undefined)return;
  var p=pins[pinIdx];
  if(!p||!p.id)return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?pin_id=eq.'+p.id+'&order=created_at.asc',{
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    pins[pinIdx].comments=data||[];
    renderPinComments();
  }catch(e){console.error('loadPinComments err',e);
  }
}"""
    new4 = """async function loadPinComments(pinIdx){
  if(pinIdx===null||pinIdx===undefined)return;
  var p=pins[pinIdx];
  if(!p||!p.id)return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN),{
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    pins[pinIdx].comments=data||[];
    renderPinComments();
  }catch(e){console.error('loadPinComments err',e);
  }
}"""
    c = c.replace(old4, new4)
    
    # 5. Fix renderMapComments - already done by previous script? Check
    old5 = """function renderMapComments(){var list=document.getElementById('mcList');list.innerHTML='';mapComments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.time||'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    new5 = """function renderMapComments(){var list=document.getElementById('mcList');list.innerHTML='';mapComments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var un=document.createElement('span');un.style.cssText='color:#ffc832;font-size:11px;font-weight:bold';un.textContent=(c.user_name||'\\u533f\\u540d')+' ';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.created_at?new Date(c.created_at).toLocaleString('zh-CN'):'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(un);item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    c = c.replace(old5, new5)
    
    # 6. Fix renderPinComments - add user_name display (only if NOT already fixed)
    old6 = """function renderPinComments(){var list=document.getElementById('pdcList');if(!pins[curPinIdx]||!pins[curPinIdx].comments){list.innerHTML='<div style="color:#666;padding:8px;font-size:13px">\\u6682\\u65e0\\u8bc4\\u8bba</div>';return;}list.innerHTML='';pins[curPinIdx].comments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.time||'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
        new6 = """function renderPinComments(){var list=document.getElementById('pdcList');if(!pins[curPinIdx]||!pins[curPinIdx].comments){list.innerHTML='<div style="color:#666;padding:8px;font-size:13px">\\u6682\\u65e0\\u8bc4\\u8bba</div>';return;}list.innerHTML='';pins[curPinIdx].comments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var un=document.createElement('span');un.style.cssText='color:#ffc832;font-size:11px;font-weight:bold';un.textContent=(c.user_name||'\\u533f\\u540d')+' ';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.created_at?new Date(c.created_at).toLocaleString('zh-CN'):'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(un);item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    c = c.replace(old6, new6)
    
    # Verify things changed
    changes_before = c.count('pin_id=is.null') + c.count('pin_id=eq.')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed. pin_id refs remaining: {changes_before}")

print('VERIFY ALL:')
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    print(f"  {fp.split('/')[-1]}: {ob}={cb} {op}={cp} {'OK' if ob==cb and op==cp else 'FAIL'} | pin_id_refs: {c2.count('pin_id=')}")
