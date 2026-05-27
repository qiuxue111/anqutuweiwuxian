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
    
    # Extract the base URL from supabase function (it includes /rest/v1/)
    m = re.search(r"var u='(https://[^']+/rest/v1/)", c)
    if not m:
        print(f"{fp.split('/')[-1]}: cannot find base URL")
        continue
    
    supa_base = m.group(1)  # e.g. https://hanrfbciinkhgcumvous.supabase.co/rest/v1/
    
    # Fix SUPABASE_URL to NOT include /rest/v1/
    old_prefix = f"var SUPABASE_URL='{supa_base}';"
    new_prefix = f"var SUPABASE_URL='{supa_base.replace('/rest/v1/', '')}';"
    c = c.replace(old_prefix, new_prefix)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed SUPABASE_URL (removed /rest/v1/)")

print('DONE')
