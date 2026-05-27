files = [
    'F:/暗区突围网站/index.html',
    'F:/暗区突围网站/pages/gear.html',
    'F:/暗区突围网站/pages/strategy.html',
    'F:/暗区突围网站/pages/weapons.html',
]

U_LOGIN = '\\u8bf7\\u5148\\u767b\\u5f55'

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Restore login check in addCommentFromModal
    old = ("var author=getUserName()||'" + "\\u533f\\u540d" + "';"
           "\n  try{")
    new = ("var token=localStorage.getItem('abi_token');"
           "\n  if(!token){alert('" + U_LOGIN + "');return;}"
           "\n  var author=getUserName();"
           "\n  try{")
    c = c.replace(old, new)
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: restored login check")

# Verify
print()
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c2)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    has_login = U_LOGIN in c2
    print(f"{fp.split('/')[-1]}: {'OK' if ob==cb and op==cp else 'FAIL'} | login_check={has_login}")
