files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    # Find ALL function declarations that contain await but lack async
    # Use regex: function X (but not async function X) followed by code containing await
    funcs = re.findall(r'(?<!async )function (\w+)\s*\(', c)
    for fn in set(funcs):
        pattern = 'function ' + fn + '('
        idx = c.index(pattern)
        # Look for 'await' within reasonable range (1000 chars)
        end_marker_pos = c.find('function ', idx + 10)
        if end_marker_pos < 0:
            end_marker_pos = idx + 1000
        chunk = c[idx:min(idx+1000, end_marker_pos)]
        if 'await' in chunk:
            c = c[:idx] + 'async ' + c[idx:]
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

print('DONE')
