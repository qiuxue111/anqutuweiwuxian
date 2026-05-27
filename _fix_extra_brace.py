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
    
    # Fix: after URL, there's }); but should be );
    # The old pattern was: URL+',{        -> URL+\n    }); 
    #                    headers:{...}
    #                    });
    # Now it's: URL\n    });
    # Should be: URL\n    );
    
    c = c.replace(
        "encodeURIComponent(mapNameCN)\n    });",
        "encodeURIComponent(mapNameCN)\n    );"
    )
    
    open(fp, 'w', encoding='utf8').write(c)
    print(f"{fp.split('/')[-1]}: fixed")

import re
for fp in files:
    c = open(fp, 'r', encoding='utf8').read()
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    s = ';'.join(ms) if ms else ''
    ob,cb,op,cp = s.count('{'),s.count('}'),s.count('('),s.count(')')
    print(f"  {ob}={cb} {op}={cp} {'OK' if ob==cb and op==cp else 'FAIL'}")
