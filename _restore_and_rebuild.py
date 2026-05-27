import re, os, subprocess

maps = [('map-farm','farm','农场'),('map-beishan','beishan','北山'),('map-valley','valley','河谷'),
        ('map-armory','armory','军港'),('map-airport','airport','机场'),('map-tvstation','tvstation','电视台')]

# 1. Git restore to clean
for m,_,_ in maps:
    subprocess.run(['git','-C',r'F:\暗区突围网站','restore','pages/'+m+'.html'],
                   capture_output=True)
print('Step 1: Git restore done')

# 2. Read all module files and extract code arrays
all_code_lines = []
mod_files = ['_mod01_basics.cjs','_mod02_events.cjs','_mod03_picker.cjs',
             '_mod04_markers.cjs','_mod05_details.cjs','_mod06_layers.cjs','_mod07_cloud.cjs']

# Replacements
icon_urls_str = '({"保险箱":"https://raw.githubusercontent.com/qiuxue111/anqutuweiwuxian/main/assets/containers/%E4%BF%9D%E9%99%A9.png",...})'  # placeholder - will read from mod01

def read_code_from_mod(filepath):
    """Read code array from a _mod*.cjs file"""
    with open(filepath, 'r', encoding='utf8') as f:
        src = f.read()
    # Find 'var code = ['
    start = src.find('var code = [')
    if start < 0:
        print(f'  {filepath}: no code array')
        return []
    # Parse the array manually
    arr_start = src.find('[', start + 11)
    lines = []
    i = arr_start + 1
    while i < len(src):
        # skip whitespace/newlines/comments
        while i < len(src) and src[i] in ' \n\r\t,':
            i += 1
        if i >= len(src):
            break
        # line comment
        if src[i] == '/' and i+1 < len(src) and src[i+1] == '/':
            while i < len(src) and src[i] != '\n':
                i += 1
            continue
        # block comment
        if src[i] == '/' and i+1 < len(src) and src[i+1] == '*':
            i = src.find('*/', i+2)
            if i < 0: break
            i += 2
            continue
        # closing bracket
        if src[i] == ']':
            break
        # string
        if src[i] == '"':
            i += 1
            cur = ''
            while i < len(src):
                if src[i] == '\\' and i+1 < len(src) and src[i+1] == '"':
                    cur += '"'
                    i += 2
                    continue
                if src[i] == '"':
                    break
                cur += src[i]
                i += 1
            lines.append(cur)
            i += 1
            continue
        i += 1
    print(f'  {filepath}: {len(lines)} lines')
    return lines

def read_code_from_mod_merged(filepath):
    """Read code array from a _mod*.cjs file"""
    with open(filepath, 'r', encoding='utf8') as f:
        src = f.read()
    # Find 'var code = ['
    start = src.find('var code = [')
    if start < 0:
        print(f'  {filepath}: no code array')
        return []
    # Parse the array manually
    arr_start = src.find('[', start + 11)
    lines = []
    i = arr_start + 1
    while i < len(src):
        # skip whitespace/newlines/comments
        while i < len(src) and src[i] in ' \n\r\t,':
            i += 1
        if i >= len(src):
            break
        # line comment
        if src[i] == '/' and i+1 < len(src) and src[i+1] == '/':
            while i < len(src) and src[i] != '\n':
                i += 1
            continue
        # block comment
        if src[i] == '/' and i+1 < len(src) and src[i+1] == '*':
            i = src.find('*/', i+2)
            if i < 0: break
            i += 2
            continue
        # closing bracket
        if src[i] == ']':
            break
        # string
        if src[i] == '"':
            i += 1
            cur = ''
            while i < len(src):
                if src[i] == '\\' and i+1 < len(src) and src[i+1] == '"':
                    cur += '"'
                    i += 2
                    continue
                if src[i] == '"':
                    break
                cur += src[i]
                i += 1
            lines.append(cur)
            i += 1
            continue
        i += 1
    print(f'  {filepath}: {len(lines)} lines')
    return lines

def read_code_from_mod_merged(filepath):
    """Read code array and merge iconUrls object into one line"""
    with open(filepath, 'r', encoding='utf8') as f:
        src = f.read()
    start = src.find('var code = [')
    if start < 0:
        print(f'  {filepath}: no code array')
        return []
    arr_start = src.find('[', start + 11)
    lines = []
    i = arr_start + 1
    in_icons = False
    icons_accum = ''
    while i < len(src):
        while i < len(src) and src[i] in ' \n\r\t,':
            i += 1
        if i >= len(src):
            break
        if src[i] == '/' and i+1 < len(src) and src[i+1] == '/':
            while i < len(src) and src[i] != '\n':
                i += 1
            continue
        if src[i] == '/' and i+1 < len(src) and src[i+1] == '*':
            i = src.find('*/', i+2)
            if i < 0: break
            i += 2
            continue
        if src[i] == ']':
            if in_icons:
                lines.append(icons_accum + '};')  # close the icons object
                in_icons = False
            break
        if src[i] == '"':
            i += 1
            cur = ''
            while i < len(src):
                if src[i] == '\\' and i+1 < len(src) and src[i+1] == '"':
                    cur += '"'
                    i += 2
                    continue
                if src[i] == '"':
                    break
                cur += src[i]
                i += 1
            # Check if this is part of iconUrls
            if not in_icons:
                lines.append(cur)
                # Check if this line starts 'var iconUrls=' - if so, next lines are icon data until '};'
                if cur.startswith('var iconUrls='):
                    in_icons = True
                    icons_accum = cur
            else:
                # Accumulate iconUrls key/value lines
                icons_accum += cur
            i += 1
            continue
        i += 1
    print(f'  {filepath}: {len(lines)} lines')
    return lines

all_code = []
for mod_file in mod_files:
    path = os.path.join(r'F:\暗区突围网站', mod_file)
    lines = read_code_from_mod_merged(path)
    all_code.extend(lines)

print(f'Total lines: {len(all_code)}')

# 3. Inject into each map HTML
for m_name, m_eng, m_cn in maps:
    fp = rf'F:\暗区突围网站\pages\{m_name}.html'
    with open(fp, 'r', encoding='utf8') as f:
        html = f.read()
    
    # Build JS code for this map
    js_lines = []
    for line in all_code:
        # Replace placeholders
        l = line.replace('MAP_ENG', m_eng).replace('MAP_CN', m_cn)
        js_lines.append(l)
    
    full_js = '\n'.join(js_lines)
    
    # CRITICAL: escape any </ in JS (would break HTML parser)
    full_js_safe = full_js.replace('</', r'<\/')
    
    # Remove existing script blocks
    html = re.sub(r'<script>[\s\S]*?</script>', '', html)
    
    # Insert new script
    html = html.replace('</body>', f'<script>\n{full_js_safe}\n</script>\n</body>')
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(html)
    
    print(f'{m_name}: INJECTED ({len(full_js_safe)} bytes)')

# 4. Validation
with open(r'F:\暗区突围网站\pages\map-farm.html', 'r', encoding='utf8') as f:
    html = f.read()

tag_s = html.count('<script>')
tag_e = html.count('</script>')
print(f'\nValidation:')
print(f'  <script>: {tag_s}, </script>: {tag_e} {"OK" if tag_s == tag_e else "FAIL"}')

m = re.search(r'<script>([\s\S]*?)</script>', html)
if m:
    code = m.group(1)
    # un-escape for JS validation
    code_real = code.replace(r'<\/', '</')
    checks = ['loginGitHub','checkReviewBtn','jumpToFromUrl','getIconUrl',
              'supabase','placePin','renderMarkers','deleteCurrentPin',
              'loadCloudPins','toggleMenu','renderLayers']
    for f in checks:
        cnt = code_real.count(f)
        status = ''
        if cnt > 1: status = ' ⚠ DUPLICATE'
        if cnt == 0: status = ' ❌ MISSING'
        print(f'  {f}: {cnt}{status}')
    
    braces_open = code_real.count('{')
    braces_close = code_real.count('}')
    parens_open = code_real.count('(')
    parens_close = code_real.count(')')
    print(f'  Braces: {{ {braces_open} = {braces_close} - diff: {braces_open-braces_close}')
    print(f'  Parens: ( {parens_open} = {parens_close} - diff: {parens_open-parens_close}')
    
    # JS parse check
    try:
        compile(code_real, '<script>', 'exec')
        print(f'  FULL PARSE OK!')
    except SyntaxError as e:
        print(f'  PARSE ERROR: {e}')
else:
    print('  NO SCRIPT BLOCK!')

print('DONE')
