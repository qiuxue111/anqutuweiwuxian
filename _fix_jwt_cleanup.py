import re

files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find all 'Bearer '+token occurrences
    old_count = c.count("Bearer '+token")
    
    # Replace all variants of 'Bearer '+token with 'Bearer '+SUPABASE_ANON
    c = c.replace("'Authorization':'Bearer '+token,", "'Authorization':'Bearer '+SUPABASE_ANON,")
    c = c.replace("'Authorization':'Bearer '+token}", "'Authorization':'Bearer '+SUPABASE_ANON}")
    
    # Also fix any remaining 'Bearer '+token in function calls
    c = c.replace("'Bearer '+token", "'Bearer '+SUPABASE_ANON")
    
    new_count = c.count("Bearer '+token")
    
    open(fp, 'w', encoding='utf8').write(c)
    if new_count < old_count:
        print(f"{fp.split('/')[-1]}: fixed {old_count - new_count} JWT refs, remaining: {new_count}")
    else:
        print(f"{fp.split('/')[-1]}: nothing changed, JWT refs: {new_count}")

# Final check
print()
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    jwt = c2.count("Bearer '+token")
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"{fp.split('/')[-1]}: {ok} | {ob}={cb} {op}={cp} | JWT={jwt}")
