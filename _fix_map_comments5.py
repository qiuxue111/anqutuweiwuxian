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
    
    # Fix loadMapComments: remove pin_id=is.null
    c = re.sub(r"SUPABASE_URL\+\'/rest/v1/map_comments\?map_name=eq\.\'\+enc\+\'&pin_id=is\.null&order=created_at\.asc\'", 
               "SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&order=created_at.asc'", c)
    
    # Fix loadPinComments: change pin_id=eq.X to map_name filter
    c = re.sub(r"SUPABASE_URL\+\'/rest/v1/map_comments\?pin_id=eq\.\'\+p\.id\+\'&order=created_at\.asc\'",
               "SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN)+'",
               c)
    
    # Fix submitPinComment: remove pin_id and fix fields
    c = re.sub(r"JSON\.stringify\(\{map_name:mapNameCN,pin_id:pins\[curPinIdx\]\.id\|\|null,content:text,author:author\}\)",
               "JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})", c)
    
    # Fix submitMapComment: fix fields
    c = re.sub(r"JSON\.stringify\(\{map_name:mapNameCN,content:text,author:author\}\)",
               "JSON.stringify({map_name:mapNameCN,text:txt,user_name:user_name})", c)
    
    # Also fix content:text in renderMapComments and renderPinComments
    # renderMapComments: c.text should stay, c.time -> created_at
    # renderMapComments user_name already done above
    # renderPinComments user_name already done above
    
    pin_count = c.count('pin_id=')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed. pin_id= refs: {pin_count} (should be 1 for deletion_requests)")

# Final verify
print()
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {ok} | pin_id={c2.count('pin_id=')} | async={c2.count('async function')}")
