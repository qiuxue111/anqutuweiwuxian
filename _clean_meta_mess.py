files = [
    'F:/暗区突围网站/pages/map-farm.html',
    'F:/暗区突围网站/pages/map-airport.html',
    'F:/暗区突围网站/pages/map-armory.html',
    'F:/暗区突围网站/pages/map-beishan.html',
    'F:/暗区突围网站/pages/map-tvstation.html',
    'F:/暗区突围网站/pages/map-valley.html',
]

for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    
    # Remove all cache meta tags we added
    c = c.replace('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">\n', '')
    c = c.replace('<meta http-equiv="Pragma" content="no-cache">\n', '')
    c = c.replace('<meta http-equiv="Expires" content="0">\n', '')
    
    # Also remove any broken lines with just quotes
    c = c.replace('\'></script>\'', '')
    c = c.replace('\'</body>\'', '')
    c = c.replace('\'</html>\'', '')
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: cleaned")

# Final check
import re
for fp in files:
    c2 = open(fp, 'r', encoding='utf8').read()
    print(f"  Broken meta: {c2.count('no-cache')}")
    # Verify script tag integrity
    scripts = re.findall(r'<script>([\s\S]*?)</script>', c2)
    print(f"  Script blocks: {len(scripts)}")
    for s in scripts:
        ob,cb = s.count('{'),s.count('}')
        if ob != cb:
            print(f"  WARNING: {ob}={{ {cb}=}}")
