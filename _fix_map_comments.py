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
    
    # 1. Fix map comment: replace submitMapComment with DB version
    old_mc = """function submitMapComment(){var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;var comment={text:text,time:new Date().toLocaleString('zh-CN')};mapComments.push(comment);localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));input.value='';renderMapComments();}"""
    
    new_mc = """function submitMapComment(){var input=document.getElementById('mcInput');var text=input.value.trim();if(!text)return;var un=getUserName();var author=un||'匿名';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,content:text,author:author})});if(r.ok||r.status===204){input.value='';loadMapComments();alert('\\u2705 评论成功');}else{alert('评论失败');}}catch(e){alert('评论失败: '+e.message);}}"""
    c = c.replace(old_mc, new_mc)
    
    # 2. Fix pin comment: replace submitPinComment with DB version
    old_pc = """function submitPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;var comment={text:text,time:new Date().toLocaleString('zh-CN')};if(!pins[curPinIdx].comments)pins[curPinIdx].comments=[];pins[curPinIdx].comments.push(comment);localStorage.setItem('abi_'+mapNameEng+'_pins',JSON.stringify({pins:pins,mapComments:mapComments}));input.value='';renderPinComments();}"""
    
    new_pc = """function submitPinComment(){if(curPinIdx===null)return;var input=document.getElementById('pdcInput');var text=input.value.trim();if(!text)return;var un=getUserName();var author=un||'匿名';try{var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments',{method:'POST',headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},body:JSON.stringify({map_name:mapNameCN,pin_id:pins[curPinIdx].id||null,content:text,author:author})});if(r.ok||r.status===204){input.value='';loadPinComments(curPinIdx);alert('\\u2705 评论成功');}else{alert('评论失败');}}catch(e){alert('评论失败: '+e.message);}}"""
    c = c.replace(old_pc, new_pc)
    
    # 3. Add loadMapComments function (insert before renderMapComments)
    load_mc = """
async function loadMapComments(){
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
}
"""
    c = c.replace("function renderMapComments(){", load_mc + "\nfunction renderMapComments(){")
    
    # 4. Add loadPinComments function
    load_pc = """
async function loadPinComments(pinIdx){
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
  }catch(e){console.error('loadPinComments err',e);}
}
"""
    c = c.replace("function renderPinComments(){", load_pc + "\nfunction renderPinComments(){")
    
    # 5. Update showPinDetail to also load comments from DB
    old_show = """function showPinDetail(idx){curPinIdx=idx;var p=pins[idx];var ic=getIconUrl(p.name);var title=document.getElementById('pdTitle');if(title){title.innerHTML='';if(ic){var img=document.createElement('img');img.src=ic;img.style.cssText='width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px';title.appendChild(img);}title.appendChild(document.createTextNode(' '+(p.name||p.type||'?')));}var pc=document.getElementById('pdCoord');if(pc)pc.textContent=Math.round(p.x)+'%, '+Math.round(p.y)+'%';var note=document.getElementById('pdNote');if(note)note.value=p.note||'';renderPinComments();renderPinImages();var pd=document.getElementById('pd');if(pd)pd.classList.add('show');}"""
    
    new_show = """function showPinDetail(idx){curPinIdx=idx;var p=pins[idx];var ic=getIconUrl(p.name);var title=document.getElementById('pdTitle');if(title){title.innerHTML='';if(ic){var img=document.createElement('img');img.src=ic;img.style.cssText='width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px';title.appendChild(img);}title.appendChild(document.createTextNode(' '+(p.name||p.type||'?')));}var pc=document.getElementById('pdCoord');if(pc)pc.textContent=Math.round(p.x)+'%, '+Math.round(p.y)+'%';var note=document.getElementById('pdNote');if(note)note.value=p.note||'';renderPinImages();var pd=document.getElementById('pd');if(pd)pd.classList.add('show');loadPinComments(idx);}"""
    c = c.replace(old_show, new_show)
    
    # 6. Fix loadCloudMarkers to also load comments after pins load
    old_load = """function loadCloudPins(){supabase('pins?map_name=eq.'+encodeURIComponent(mapNameCN),'GET').then(function(d){if(d&&d.length){cloudPins=d;}supabase('map_comments?map_name=eq.'+encodeURIComponent(mapNameCN),'GET').then(function(d2){if(d2&&d2.length)cloudComments=d2;loadCloudMarkers();})['catch'](function(){loadCloudMarkers();});})['catch'](function(){});}"""
    
    new_load = """function loadCloudPins(){supabase('pins?map_name=eq.'+encodeURIComponent(mapNameCN),'GET').then(function(d){if(d&&d.length){cloudPins=d;}loadCloudMarkers();loadMapComments();})['catch'](function(){loadCloudMarkers();});}"""
    c = c.replace(old_load, new_load)
    
    # 7. Also call postMapComment as submitMapComment (fix button was using wrong name)
    if 'postMapComment' in c:
        c = c.replace('onclick="postMapComment()"', 'onclick="submitMapComment()"')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed comments")

# Verify no errors
import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_async = 'async function' in s
    has_loadMc = 'loadMapComments' in s
    has_loadPc = 'loadPinComments' in s
    print(f"{fp.split('/')[-1]}: {ob}={cb} ({op}={cp}) {ok} | async={has_async} | loadMap={has_loadMc} | loadPin={has_loadPc}")

print('ALL DONE')
