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
    
    # fix submitMapComment: content -> text, author -> user_name, no pin_id
    old_mc = """function submitMapComment(){var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;var un=getUserName();var author=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,content:text,author:author})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    new_mc = """async function submitMapComment(){var input=document.getElementById('mcInput');var txt=input.value.trim();if(!txt)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    c = c.replace(old_mc, new_mc)
    
    # fix submitPinComment: content -> text, author -> user_name, no pin_id
    old_pc = """function submitPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;var un=getUserName();var author=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,pin_id:pins[curPinIdx].id||null,content:text,author:author})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    new_pc = """async function submitPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var txt=input.value.trim();if(!txt)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}}"""
    c = c.replace(old_pc, new_pc)
    
    # fix loadMapComments: remove pin_id filter since no such column
    old_lm = """async function loadMapComments(){try{var enc=encodeURIComponent(mapNameCN);var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&pin_id=is.null&order=created_at.asc',{headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}});if(!r.ok)return;var data=await r.json();mapComments=data||[];renderMapComments();}catch(e){console.error('loadMapComments err',e);}}"""
    new_lm = """async function loadMapComments(){try{var enc=encodeURIComponent(mapNameCN);var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&order=created_at.asc',{headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}});if(!r.ok)return;var data=await r.json();mapComments=data||[];renderMapComments();}catch(e){console.error('loadMapComments err',e);}}"""
    c = c.replace(old_lm, new_lm)
    
    # fix loadPinComments: remove pin_id filter since no such column
    old_lp = """async function loadPinComments(pinIdx){if(pinIdx===null||pinIdx===undefined)return;var p=pins[pinIdx];if(!p||!p.id)return;try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?pin_id=eq.'+p.id+'&order=created_at.asc',{headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}});if(!r.ok)return;var data=await r.json();pins[pinIdx].comments=data||[];renderPinComments();}catch(e){console.error('loadPinComments err',e);}}"""
    new_lp = """async function loadPinComments(pinIdx){if(pinIdx===null||pinIdx===undefined)return;var p=pins[pinIdx];if(!p||!p.id)return;try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN),{headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}});if(!r.ok)return;var data=await r.json();pins[pinIdx].comments=data||[];renderPinComments();}catch(e){console.error('loadPinComments err',e);}}"""
    c = c.replace(old_lp, new_lp)
    
    # fix renderMapComments: use text instead of content, user_name instead of author, also add author label
    old_rd = """function renderMapComments(){var list=document.getElementById('mcList');list.innerHTML='';mapComments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.time||'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    new_rd = """function renderMapComments(){var list=document.getElementById('mcList');list.innerHTML='';mapComments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var un=document.createElement('span');un.style.cssText='color:#ffc832;font-size:11px;font-weight:bold';un.textContent=(c.user_name||'\\u533f\\u540d')+' ';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.created_at?new Date(c.created_at).toLocaleString('zh-CN'):'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(un);item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    c = c.replace(old_rd, new_rd)
    
    # fix renderPinComments: same field name fix
    old_rp = """function renderPinComments(){var list=document.getElementById('pdcList');if(!pins[curPinIdx]||!pins[curPinIdx].comments){list.innerHTML='<div style="color:#666;padding:8px;font-size:13px">暂无评论</div>';return;}list.innerHTML='';pins[curPinIdx].comments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.time||'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    new_rp = """function renderPinComments(){var list=document.getElementById('pdcList');if(!pins[curPinIdx]||!pins[curPinIdx].comments){list.innerHTML='<div style="color:#666;padding:8px;font-size:13px">\\u6682\\u65e0\\u8bc4\\u8bba</div>';return;}list.innerHTML='';pins[curPinIdx].comments.forEach(function(c){var item=document.createElement('div');item.style.cssText='padding:8px;border-bottom:1px solid #222;font-size:13px';var un=document.createElement('span');un.style.cssText='color:#ffc832;font-size:11px;font-weight:bold';un.textContent=(c.user_name||'\\u533f\\u540d')+' ';var time=document.createElement('span');time.style.cssText='color:#666;font-size:11px';time.textContent=c.created_at?new Date(c.created_at).toLocaleString('zh-CN'):'';var txt=document.createElement('div');txt.style.cssText='margin-top:4px';txt.textContent=c.text||'';item.appendChild(un);item.appendChild(time);item.appendChild(txt);list.appendChild(item);});}"""
    c = c.replace(old_rp, new_rp)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed field names")

# Verify
import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb = s.count('{'),s.count('}')
    op,cp = s.count('('),s.count(')')
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {'OK' if ob==cb and op==cp else 'FAIL'}")
