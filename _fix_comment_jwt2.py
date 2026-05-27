files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

U_ANON = '\\u533f\\u540d'
U_LOGIN = '\\u8bf7\\u5148\\u767b\\u5f55'

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Add async to addCommentFromModal if missing
    c = c.replace('function addCommentFromModal(){', 'async function addCommentFromModal(){')
    
    # Remove JWT token check pattern (var token=..; if(!token){alert...;return;} var author=...;)
    old_jwt = ("  var token=localStorage.getItem('abi_token');\n"
               "  if(!token){alert('" + U_LOGIN + "');return;}\n"
               "  var author=getUserName();")
    new_auth = ("  var author=getUserName()||'" + U_ANON + "';")
    c = c.replace(old_jwt, new_auth)
    
    # Replace 'Bearer '+token with anon key in post_comments POST
    old_header = "'Authorization':'Bearer '+token,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}"
    new_header = "'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}"
    c = c.replace(old_header, new_header)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

# Verify
print()
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    jwt_refs = c2.count("'Bearer '+token")
    not_login = c2.count(U_LOGIN)
    async_fn = c2.count('async function')
    ms = __import__('re').findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    print(f"{fp.split('/')[-1]}: {'OK' if ob==cb and op==cp else 'FAIL'} | JWT_refs={jwt_refs} | login_check={not_login} | async={async_fn}")
