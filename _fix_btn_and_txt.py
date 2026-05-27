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
    
    # 1. Fix button onclick from postPinComment to submitPinComment
    c = c.replace('onclick="postPinComment()"', 'onclick="submitPinComment()"')
    
    # 2. Fix txt is not defined — the submit functions renamed text->txt
    # Check if 'var text=' exists but the function uses 'txt'
    # Find submitPinComment and submitMapComment
    
    # submitMapComment: replace txt with text (simpler)
    old_mc = """var txt=input.value.trim();if(!txt)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}"""
    new_mc = """var content=input.value.trim();if(!content)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:content,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}"""
    c = c.replace(old_mc, new_mc)
    
    # submitPinComment: same fix
    old_pc = """var txt=input.value.trim();if(!txt)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}"""
    new_pc = """var content=input.value.trim();if(!content)return;var un=getUserName();var user_name=un||'\\u533f\\u540d';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,text:content,user_name:user_name})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 \\u8bc4\\u8bba\\u6210\\u529f');}else{alert('\\u8bc4\\u8bba\\u5931\\u8d25');}}catch(e){alert('\\u8bc4\\u8bba\\u5931\\u8d25: '+e.message);}"""
    c = c.replace(old_pc, new_pc)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Verify
print()
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_txt = c2.count('text:txt') > 0
    has_postPin = 'onclick="postPinComment()"' in c2
    print(f"{fp.split('/')[-1]}: {ok} {ob}={cb} | txt_refs={c2.count('text:txt')} | postPin_btn={has_postPin}")
