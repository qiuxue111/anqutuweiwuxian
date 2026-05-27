import re

# Read template
c = open('F:\\暗区突围网站\\pages\\map-farm.html', 'r', encoding='utf-8').read()

# Map definitions: (src_name, title, img_file, storage_key)
maps = [
    ('北山',      '北山地图 - 暗区突围：无限',      'beishan.png',  'abi_beishan_pins'),
    ('山谷',      '山谷地图 - 暗区突围：无限',      'valley.png',   'abi_valley_pins'),
    ('前线要塞',  '前线要塞地图 - 暗区突围：无限',  'armory.png',   'abi_armory_pins'),
    ('机场',      '机场地图 - 暗区突围：无限',      'airport.png',  'abi_airport_pins'),
    ('电视台',    '电视台地图 - 暗区突围：无限',    'tvstation.png','abi_tvstation_pins'),
]

for name, title, img_file, storage_key in maps:
    out = c
    
    # 1. Title
    out = out.replace('<title>农场地图 - 暗区突围：无限</title>', f'<title>{title}</title>')
    
    # 2. Map image
    out = out.replace('../assets/maps/farm.png', f'../assets/maps/{img_file}')
    
    # 3. localStorage key: abi_farm_pins
    out = out.replace('abi_farm_pins', storage_key)
    
    # 4. "← 返回地图" href (already ../index.html, fine)
    
    # 5. Output file
    out_file = f'F:\\暗区突围网站\\pages\\map-{name.replace("前线要塞","armory").replace("机场","airport")}.html'
    # Use pinyin-based filenames
    filename_map = {
        '北山': 'map-beishan.html',
        '山谷': 'map-valley.html',
        '前线要塞': 'map-armory.html',
        '机场': 'map-airport.html',
        '电视台': 'map-tvstation.html',
    }
    
    # Verify png path
    png_path = f'F:\\暗区突围网站\\assets\\maps\\{img_file}'
    import os
    if not os.path.exists(png_path):
        print(f'WARNING: {png_path} not found!')
    
    with open(f'F:\\暗区突围网站\\pages\\{filename_map[name]}', 'w', encoding='utf-8') as f:
        f.write(out)
    
    # Quick verification
    if '<title>' + title in out:
        print(f'OK: {filename_map[name]} -> {title} ({img_file}, key={storage_key})')
    else:
        print(f'ERROR: {filename_map[name]} -> title not found!')
    
    # Check syntax
    m = re.search(r'<script>([\s\S]*?)</script>', out)
    if m:
        s = m.group(1)
        print(f'  Script: braces {s.count("{")}/{s.count("}")}, parens {s.count("(")}/{s.count(")")}')

print('\nAll done!')
