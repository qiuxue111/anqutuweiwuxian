c = open('F:/暗区突围网站/pages/map-farm.html', 'r', encoding='utf8').read()

# Find the exact loadPinComments function
idx_start = c.find('async function loadPinComments(pinIdx){')
idx_end = c.find('function renderPinComments(){')
if idx_start > 0 and idx_end > idx_start:
    old_fn = c[idx_start:idx_end]
    new_fn = """async function loadPinComments(pinIdx){
  if(pinIdx===null||pinIdx===undefined)return;
  var p=pins[pinIdx];
  if(!p||!p.id)return;
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN));
    if(!r.ok)return;
    var data=await r.json();
    pins[pinIdx].comments=data||[];
    renderPinComments();
  }catch(e){console.error('loadPinComments err',e);
  }
}

"""
    c = c.replace(old_fn, new_fn)
    open('F:/暗区突围网站/pages/map-farm.html', 'w', encoding='utf8').write(c)
    print(f'Replaced loadPinComments: {len(old_fn)} chars -> {len(new_fn)} chars')
    import re
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb = s.count('{'),s.count('}')
    print(f'Braces: {ob}={cb} {"OK" if ob==cb else "FAIL"}')
