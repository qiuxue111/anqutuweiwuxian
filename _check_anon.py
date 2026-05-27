import re
files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
for fp in files:
    c = open(fp,'r',encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    has_bare = bool(re.search(r'\nasync\s*\n', s))
    token_refs = s.count("'Bearer '+token")
    anon_refs = s.count("'Bearer '+SUPABASE_ANON")
    print(f"{fp.split('/')[-1]}: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok} | bare_async={has_bare} | token_uses={token_refs} | anon_uses={anon_refs}")
