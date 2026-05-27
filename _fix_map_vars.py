files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

# Find the base URL and anon key from the supabase function
import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Extract URL and key from supabase function
    m_url = re.search(r"var u='(https://[^']+)", c)
    m_key = re.search(r"'apikey':'([^']+)'", c)
    
    if not m_url or not m_key:
        print(f"{fp.split('/')[-1]}: CANNOT find url/key")
        continue
    
    supa_url = m_url.group(1)
    anon_key = m_key.group(1)
    
    # Add SUPABASE_URL and SUPABASE_ANON right before the supabase function
    old = "function supabase(t,m,b,f){"
    new = f"var SUPABASE_URL='{supa_url}';var SUPABASE_ANON='{anon_key}';\nfunction supabase(t,m,b,f){{"
    c = c.replace(old, new)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: added SUPABASE_URL/SUPABASE_ANON vars")

print('DONE')
