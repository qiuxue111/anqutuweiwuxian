files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Just add async to ALL functions that contain 'await' by checking each one
    idx = 0
    while True:
        idx = c.find('function ', idx)
        if idx < 0: break
        # Check if already async
        line_start = c.rfind('\n', 0, idx)
        if line_start < 0: line_start = 0
        pre_line = c[line_start:idx].strip()
        # Only add async if not already there
        if 'async' not in pre_line.split()[-1] if pre_line else True:
            # But check if this specific function actually uses await
            chunk = c[idx:idx+600]
            # Find the function body start
            brace_start = chunk.find('{')
            if brace_start > 0 and brace_start < 100:
                body = chunk[brace_start:]
                if 'await' in body:
                    # Check function name
                    fn_end = chunk.index('(')
                    fn_name = chunk[9:fn_end].strip()
                    if fn_name != 'closePostModal':
                        c = c[:idx] + 'async ' + c[idx:]
                        idx += 6  # skip past inserted 'async '
        idx += 1
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: done")

print('DONE')
