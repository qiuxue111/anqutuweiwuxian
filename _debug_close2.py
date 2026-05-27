files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Check: does closePostModal have async?
    idx = c.index('function closePostModal')
    chunk = c[max(0,idx-30):idx+30]
    is_async_close = 'async function closePostModal' in chunk
    print(f"{fp.split('/')[-1]}: closePostModal async={is_async_close}")
    
    # List all functions with async
    print("  Functions:")
    for m in re.finditer(r'(?:async\s+)?function\s+(\w+)\s*\(', c):
        fn = m.group(1)
        is_a = m.group(0).startswith('async')
        print(f"    {fn}: async={is_a}")
    
    print()
