files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find all functions with await that lack async
    # Find function X ( that is NOT async function X
    # Use a simple approach: find 'function ' and check context
    idx = 0
    problems = []
    while True:
        idx = c.find('\nfunction ', idx)
        if idx < 0: break
        # Check if preceded by async
        pre = c[max(0,idx-20):idx].strip()
        if pre and pre.split()[-1] == 'async':
            idx += 1
            continue
        # Get function name
        rest = c[idx+10:idx+60]
        fn_name = rest.split('(')[0].strip().split('{')[0].strip().split('\n')[0].strip()
        # Check for await within this function
        chunk = c[idx:idx+600]
        # Find function end roughly
        if 'await' in chunk:
            problems.append(fn_name)
        idx += 1
    
    if problems:
        print(f"{fp.split('/')[-1]}: STILL has async issues: {problems}")
    else:
        print(f"{fp.split('/')[-1]}: ALL GOOD")
    
    # Also verify brackets
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    ok = 'OK' if ob==cb and op==cp else 'FAIL'
    print(f"  Brackets: {'{'}{ob}{'}'}={cb} ({op})={cp} {ok}")
