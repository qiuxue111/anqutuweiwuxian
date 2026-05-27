files = ['F:/暗区突围网站/pages/weapons.html','F:/暗区突围网站/pages/gear.html','F:/暗区突围网站/pages/strategy.html']
import re

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Find all function declarations
    funcs = re.findall(r'(?:async\s+)?function\s+(\w+)\s*\(', c)
    s = ' '.join(re.findall(r'<script>([\s\S]*?)</script>', c))
    
    # Check which ones have await and might need async
    blocks = re.findall(r'(?:function\s+\w+|async\s+function\s+\w+)\s*\([^{]*\{([^}]*(?:\{[^}]*\}[^}]*)*)\}', c)
    
    # Simple check: find functions with 'await' in them
    for fn in funcs:
        st = c.index('function ' + fn)
        en = st + 500
        snippet = c[st:en]
        has_await = 'await ' in snippet or 'await(' in snippet
        is_async = 'async function' in snippet[:20]
        if has_await and not is_async:
            print(f"{fp.split('/')[-1]}: {fn} has await but NOT async")
        elif has_await and is_async:
            ...
        elif fn == 'loadPosts':
            print(f"{fp.split('/')[-1]}: {fn} is_async={is_async} has_await={has_await}")

print('DONE')
