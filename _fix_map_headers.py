files = [
    "F:/暗区突围网站/pages/map-farm.html",
    "F:/暗区突围网站/pages/map-airport.html",
    "F:/暗区突围网站/pages/map-armory.html",
    "F:/暗区突围网站/pages/map-beishan.html",
    "F:/暗区突围网站/pages/map-tvstation.html",
    "F:/暗区突围网站/pages/map-valley.html",
]

new_fn = """async function loadMapComments(){
  try{
    var enc=encodeURIComponent(mapNameCN);
    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?map_name=eq.'+enc+'&order=created_at.asc',{
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON}
    });
    if(!r.ok)return;
    var data=await r.json();
    mapComments=data||[];
    renderMapComments();
  }catch(e){console.error('loadMapComments err',e);}
}"""

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Replace loadMapComments
    start = c.find('async function loadMapComments(){')
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
                    print(f'{fp.split("/")[-1]}: replaced loadMapComments ({len(old)} chars)')
                    break
            i += 1
    
    # Also fix loadPinComments
    start = c.find('async function loadPinComments')
    if start >= 0:
        # Find the end of the function - may need to look for } after fetch
        # Check if it also lacks headers
        end = c.find('}', start)
        sub = c[start:end+1]
        if ',{' in sub and 'headers' not in sub:
            # Add headers to the fetch
            c = c[:start] + c[start:end+1].replace(',{\n    });', ",{\n    headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON}\n  });") + c[end+1:]
            print(f'{fp.split("/")[-1]}: added headers to loadPinComments')
    
    open(fp, 'w', encoding='utf8').write(c)
