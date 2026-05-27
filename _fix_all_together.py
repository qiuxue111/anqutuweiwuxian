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
    
    # Fix 1: Add async to loadMapComments (if missing)
    c = c.replace('function loadMapComments(){', 'async function loadMapComments(){')
    # Fix 2: Add async to loadPinComments (if missing)
    c = c.replace('function loadPinComments(', 'async function loadPinComments(')
    # Fix 3: Add async to submitMapComment (if missing)
    c = c.replace('function submitMapComment(){', 'async function submitMapComment(){')
    # Fix 4: Add async to submitPinComment (if missing)
    c = c.replace('function submitPinComment(){', 'async function submitPinComment(){')
    
    print(f"{fp.split('/')[-1]}: processing")
    
    # Fix 6-7: cleanup
    c = c.replace("&pin_id=is.null", "")
    c = c.replace("?pin_id=is.null", "")
    
    open(fp, 'w', encoding='utf8').write(c)

print()

# Now fix strategy.html (and gear, weapons) - addCommentFromModal uses JWT token
subpages = ['F:/暗区突围网站/pages/strategy.html', 'F:/暗区突围网站/pages/gear.html', 'F:/暗区突围网站/pages/weapons.html', 'F:/暗区突围网站/index.html']
for fp in subpages:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find addCommentFromModal and replace JWT token with anon key
    old_comment = """  var token=localStorage.getItem('abi_token');
  if(!token){alert('\\u8bf7\\u5148\\u767b\\u5f55');return;}
  var author=getUserName();
  (async function(){
    try{
      var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
        method:'POST',
        headers:{'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
        body:JSON.stringify({post_id:currentModalPostId,content:content,author:author})"""
    
    new_comment = """  var author=getUserName()||'\\u533f\\u540d';
  try{
    var r=await fetch(SUPABASE_URL+'/rest/v1/post_comments',{
      method:'POST',
      headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({post_id:currentModalPostId,content:content,author:author})"""
    
    if old_comment in c:
        c = c.replace(old_comment, new_comment)
        print(f"{fp.split('/')[-1]}: fixed addCommentFromModal JWT -> anon")
    else:
        print(f"{fp.split('/')[-1]}: addCommentFromModal pattern not found (might already be fixed)")
        # Debug: show what it looks like
        idx = c.find('addCommentFromModal')
        if idx >= 0:
            print(f"  Actual code: {c[idx:idx+350]}")
    
    open(fp, 'w', encoding='utf8').write(c)

# Final verify all files
print()
all_files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
] + files

for fp in all_files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    async_issues = 0
    if 'await' in s:
        # Check all functions with await have async
        for m in re.finditer(r'\bawait\b', s):
            # Simple check: is there an async function before it?
            pass
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {ok} | async={c2.count('async function')}")
