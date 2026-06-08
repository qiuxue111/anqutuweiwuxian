# -*- coding: utf-8 -*-
maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    import re
    # Match: if (sessionStorage.getItem('adCardClosed_v2')) { card.style.display = 'none'; return; }
    # with any whitespace
    pattern = r"if \(sessionStorage\.getItem\('adCardClosed_v2'\)\) \{\s*card\.style\.display\s*=\s*'none';\s*return;\s*\}"
    count = len(re.findall(pattern, t))
    if count:
        t = re.sub(pattern, '/* adCard always visible */', t)
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
    print(f'{m}: replaced {count}')
    
    # Also verify no other broken code
    scripts = t.count('<script>') == t.count('</script>')
    braces = t.count('{') == t.count('}')
    print(f'  scripts={scripts} braces={braces}')
