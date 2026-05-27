import re

with open('F:\\暗区突围网站\\pages\\maps.html', 'rb') as f:
    raw = f.read()

# Work on raw bytes to avoid CRLF issues
text = raw.decode('utf-8')

# Replace CRLF with LF for consistent processing
text = text.replace('\r\n', '\n')

# Map: (section start marker, next section marker, link file)
sections = [
    ('北山 (ABI)',        '<!-- 山谷',      'map-beishan.html'),
    ('山谷 (ABI 专属)',   '<!-- 军械',      'map-valley.html'),
    ('军械 (ABI 核心',    '<!-- 农场',      'map-armory.html'),
    ('port"',             '<!-- 电视',      'map-airport.html'),  # still has 'port' id
    ('电视',              '<div style="margin-top:2rem;', 'map-tvstation.html'),
]

btn_html = '      <div style="margin-top:1rem;">\n        <a href="__LINK__" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n'

for marker, next_marker, link in sections:
    # Find the last </div> before the next section
    idx = text.find(marker)
    if idx < 0:
        print(f'NOT FOUND: {marker}')
        continue
    
    next_idx = text.find(next_marker, idx)
    if next_idx < 0:
        print(f'NEXT NOT FOUND: {next_marker} after {marker}')
        continue
    
    # Find the closing </div> of this section (before next section)
    # The section ends with \n    </div>\n\n    <!-- next
    end_pattern = '\n    </div>\n\n    <!-- ' + next_marker
    end_idx = text.find(end_pattern, idx)
    if end_idx < 0:
        print(f'END PATTERN NOT FOUND for {marker}, trying simpler pattern...')
        # Try just </div> before next
        last_close = text.rfind('</div>', idx, next_idx)
        if last_close >= 0:
            end_idx = last_close
        else:
            print(f'  Skip {marker}')
            continue
    
    # Insert button before the closing </div>
    insert_btn = btn_html.replace('__LINK__', link)
    
    # Replace the </div> with button + </div>
    # Find the exact </div> that closes the section
    # If we found end_pattern, the </div> is part of it
    if end_idx > 0 and text[end_idx:end_idx+6] == '</div>':
        text = text[:end_idx] + insert_btn + text[end_idx:]
        print(f'Added {link} at position {end_idx}')
    else:
        print(f'Could not insert at {marker}, end_idx={end_idx}')

# Also fix: remove duplicate button from farm (it already has one)
# Actually farm already has its button, let's not double-add

# Fix port -> airport
text = text.replace('<!-- 港口 -->', '<!-- 机场 -->')
text = text.replace('<h2>港口 <span class="badge badge-med">中等</span></h2>', '<h2>机场 <span class="badge badge-med">中等</span></h2>')
text = text.replace('id="port"', 'id="airport"')

# Write back with CRLF
text = text.replace('\n', '\r\n')
with open('F:\\暗区突围网站\\pages\\maps.html', 'w', encoding='utf-8', newline='\r\n') as f:
    f.write(text)

print('\nVerification:')
for link_name in ['farm','beishan','valley','armory','airport','tvstation','editor']:
    cnt = text.count(f'map-{link_name}.html')
    print(f'  map-{link_name}.html: {cnt}')
