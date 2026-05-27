import re

files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Add async to addCommentFromModal if missing
    c = re.sub(r'function addCommentFromModal\(\)\{', 'async function addCommentFromModal(){', c)
    
    # Inside addCommentFromModal: remove JWT token check and use anon key
    # Pattern: var token=...; if(!token){alert...;return;} var author=...;
    c = re.sub(
        r"var token=localStorage\.getItem\('abi_token'\);[\s\S]{0,200}?if\(!token\)\{alert\('[^']*'\);return;\}\s*var author=getUserName\(\);",
        "var author=getUserName()||'\\u533f\\u540d';",
        c
    )
    
    # Also replace 'Authorization':'Bearer '+token with anon key
    c = c.replace(
        "'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}",
        "'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}"
    )
    
    # Also check if there's a version with 'Authorization':'Bearer '+token for post_comments
    c = c.replace(
        "'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}",
        "'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}"
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Final verify
print()
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb = s.count('{'),s.count('}')
    op,cp = s.count('('),s.count(')')
    jwt_count = c2.count("'Bearer '+token")
    print(f"{fp.split('/')[-1]}: {ob}={cb} {op}={cp} {'OK' if ob==cb and op==cp else 'FAIL'} | JWT_refs={jwt_count}")
