# -*- coding: utf-8 -*-
import re

maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport']
for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    # Use regex to find the init scaling block
    # Match: var iw = ... ; var ratio = ... ; scaleM = Math.min(ratio, 2.5); ...
    pattern = r'var iw = img\.naturalWidth \|\| img\.clientWidth;[^;]*;[\s\S]*?var ratio = w / iw;[\s\S]*?scaleM = Math\.min\(ratio, 2\.5\);[\s\S]*?if \(scaleM < 0\.8\) scaleM = 0\.8;[\s\S]*?// 如果地图较窄，水平居中[\s\S]*?var mvEl = document\.getElementById\(\'mv\'\);[\s\S]*?if \(mvEl && iw \* scaleM < w\) \{[\s\S]*?panX = \(w - iw \* scaleM\) / 2;[\s\S]*?\}[\s\S]*?ut\(\);'
    
    match = re.search(pattern, t)
    if match:
        old_block = match.group(0)
        # Extract the exact indentation from the first line
        indent = ''
        first_line = old_block.split('\n')[0]
        if first_line.strip() and first_line[0] == ' ':
            indent = first_line[:len(first_line) - len(first_line.lstrip())]
        
        new_lines = [
            f'{indent}var iw = img.naturalWidth || img.clientWidth || 2000;',
            f'{indent}var ih = img.naturalHeight || iw;',
            f'{indent}var sx = w / iw;',
            f'{indent}var sy = h / ih;',
            f'{indent}scaleM = Math.min(sx, sy);',
            f'{indent}if (scaleM > 2) scaleM = 2;',
            f'{indent}if (scaleM < 0.3) scaleM = 0.3;',
            f'{indent}// 始终保持居中',
            f'{indent}panX = (w - iw * scaleM) / 2;',
            f'{indent}panY = (h - ih * scaleM) / 2;',
            f'{indent}ut();',
        ]
        new_block = '\n'.join(new_lines)
        
        t = t[:match.start()] + new_block + t[match.end():]
        with open(path, 'wb') as f:
            f.write(t.encode('utf-8'))
        print(f'{m}: replaced init scaling block')
    else:
        print(f'{m}: regex no match')
