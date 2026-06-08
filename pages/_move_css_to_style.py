# -*- coding: utf-8 -*-
"""把 script 块中的 .ad-close-btn CSS 移到最近的 </style> 前"""
import re
import os

maps = ['map-farm','map-valley','map-beishan','map-tvstation','map-armory','map-airport','3x3']

for m in maps:
    path = 'F:/暗区突围网站/pages/'+m+'.html'
    with open(path, 'rb') as f:
        t = f.read().decode('utf-8')
    
    css_to_move = []
    
    # Find all script blocks containing CSS
    for match in re.finditer(r'<script[^>]*>.*?</script>', t, re.DOTALL):
        s = match.group(0)
        # Find CSS patterns: .ad-card:hover .ad-close-btn{opacity:1}
        # and .ad-close-btn{opacity:0;transition:opacity .15s}
        # and .ad-close-btn:hover{color:#aaa!important}
        css_patterns = [
            r'\.ad-card:hover\s*\.ad-close-btn\{[^}]*\}',
            r'\.ad-close-btn\{[^}]*\}',
            r'\.ad-close-btn:hover\{[^}]*\}',
        ]
        
        for pat in css_patterns:
            for css_match in re.finditer(pat, s):
                css = css_match.group(0)
                css_to_move.append(css)
                # Remove from script block
                s = s[:css_match.start()] + s[css_match.end():]
        
        # Update the text
        t = t[:match.start()] + s + t[match.end():]
    
    if not css_to_move:
        print(f'{m}: no CSS to move')
        continue
    
    # Insert CSS before the last </style> (the one in ad section)
    last_style_end = t.rfind('</style>')
    if last_style_end < 0:
        print(f'{m}: no </style> found!')
        continue
    
    # Find the line start before </style>
    insert_pos = t.rfind('\n', 0, last_style_end) + 1
    css_block = '\n'.join(css_to_move) + '\n'
    t = t[:insert_pos] + css_block + t[insert_pos:]
    
    with open(path, 'wb') as f:
        f.write(t.encode('utf-8'))
    
    scripts = t.count('<script>') == t.count('</script>')
    braces = t.count('{') == t.count('}')
    print(f'{m}: moved {len(css_to_move)} CSS entries | scripts={scripts} braces={braces}')
