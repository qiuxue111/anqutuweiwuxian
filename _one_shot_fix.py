"""
One-shot fix for all map pages:
1. Add async to functions that use await
2. Fix loadPinComments URL (no broken ,{ )
3. Fix button onclick postPinComment -> submitPinComment
4. Fix txt -> content variable name
5. Remove JWT token references
"""

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
    
    # 1. Add async to functions
    c = c.replace('function loadMapComments(){', 'async function loadMapComments(){')
    c = c.replace('function loadPinComments(pinIdx){', 'async function loadPinComments(pinIdx){')
    c = c.replace('function submitMapComment(){', 'async function submitMapComment(){')
    c = c.replace('function submitPinComment(){', 'async function submitPinComment(){')
    c = c.replace('async async function', 'async function')
    
    # 2. Fix loadPinComments URL - remove the broken ,{ and headers
    # Replace the whole fetch call in loadPinComments
    old_fetch = """    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN),{
      headers:{'apiKey':SUPABASE_ANON,'Authorization':'Bearer '+SUPABASE_ANON}
    });"""
    new_fetch = """    var r=await fetch(SUPABASE_URL+'/rest/v1/map_comments?order=created_at.asc&map_name=eq.'+encodeURIComponent(mapNameCN));"""
    c = c.replace(old_fetch, new_fetch)
    
    # 3. Fix button onclick (postPinComment -> submitPinComment)
    # The HTML button uses postPinComment but the function is submitPinComment
    c = c.replace('onclick="postPinComment()"', 'onclick="submitPinComment()"')
    
    # 4. Fix variable names in submitMapComment: txt -> content
    old_txt = "var txt=input.value.trim();if(!txt)return;"
    new_txt = "var content=input.value.trim();if(!content)return;"
    c = c.replace(old_txt, new_txt)
    
    # Fix body: text:txt -> text:content
    c = c.replace('text:txt,user_name', 'text:content,user_name')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Also fix the 4 post pages
post_files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

for fp in post_files:
    c = open(fp, 'r', encoding='utf8').read()
    # Fix async async
    c = c.replace('async async function', 'async function')
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: cleaned async")

# Final verification
print()
import re
for fp in files + post_files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    src = fp.split('/')[-1]
    print(f'{src}: {ok} {ob}={cb} {op}={cp} | {c2.count("async function")} async fns')
