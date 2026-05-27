files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

new_fn = """async function loadPinComments(pinIdx){
  if(pinIdx===null||pinIdx===undefined)return;
  var p=pins[pinIdx];
  if(!p||!p.id)return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN),{
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    var filtered=(data||[]).filter(function(c){return c.pin_id===p.id;});
    pins[pinIdx].comments=filtered;
    renderPinComments();
  }catch(e){console.error('loadPinComments err',e);
}
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    start = c.find('async function loadPinComments(')
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
                    print(f'{fp.split("/")[-1]}: replaced ({len(old)} chars)')
                    break
            i += 1
        open(fp, 'w', encoding='utf8').write(c)
