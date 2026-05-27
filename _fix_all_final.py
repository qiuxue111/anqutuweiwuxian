import re, os

base = 'F:/暗区突围网站/'
page_files = ['pages/maps.html', 'pages/gear.html', 'pages/strategy.html', 'pages/weapons.html', 'search.html']

# Common HTML components
menu_btn = '<button id="menuBtn" onclick="toggleMenu()">☰</button>'

user_area = '<div id="userArea"><span id="loginDot" style="display:none;width:8px;height:8px;border-radius:50%;background:#2ecc71;margin-right:2px;"></span><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>'

# Menu for pages/ subdirectory
sub_menu_pages = '<div id="bubbleMenu"><a href="../index.html">🏠 首页</a><a href="maps.html">🗺 地图选图</a><a href="weapons.html">🔧 改枪</a><a href="strategy.html">💬 聊天</a><a href="gear.html">📖 攻略</a><a href="../search.html">🔍 搜索</a><div class="sep"></div><a href="#" onclick="showUserCenter()">👤 用户中心</a><a href="#" onclick="logout()">🚪 退出登录</a></div>'

# Menu for root-level search.html
sub_menu_root = '<div id="bubbleMenu"><a href="index.html">🏠 首页</a><a href="pages/maps.html">🗺 地图选图</a><a href="pages/weapons.html">🔧 改枪</a><a href="pages/strategy.html">💬 聊天</a><a href="pages/gear.html">📖 攻略</a><a href="search.html">🔍 搜索</a><div class="sep"></div><a href="#" onclick="showUserCenter()">👤 用户中心</a><a href="#" onclick="logout()">🚪 退出登录</a></div>'

# CSS to inject INSIDE <style> block
menu_css = '''
/* Floating menu button - upper left */
#menuBtn{position:fixed;top:12px;left:12px;z-index:9999;width:38px;height:38px;border-radius:10px;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.08);color:#ccc;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
#menuBtn:hover{background:rgba(255,200,50,0.15);color:#ffc832;}

/* Bubble menu */
#bubbleMenu{display:none;position:fixed;top:56px;left:12px;z-index:9998;background:rgba(15,15,24,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:8px;min-width:180px;box-shadow:0 8px 40px rgba(0,0,0,0.6);overflow:hidden;}
#bubbleMenu a{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#ccc;border-radius:8px;font-size:0.95rem;transition:all 0.15s;}
#bubbleMenu a:hover{background:rgba(255,200,50,0.08);color:#ffc832;}
#bubbleMenu .sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 8px;}
'''

for fname in page_files:
    fp = base + fname
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    old_c = c  # for change detection
    
    # 1. Remove <nav> if exists
    c = re.sub(r'<nav[^>]*>[\s\S]*?</nav>', '', c)
    
    # 2. Remove any old menu/userArea elements
    c = re.sub(r'<div\s+id="userArea"[^>]*>[\s\S]*?</div>', '', c)
    c = re.sub(r'<div\s+id="sideMenu"[^>]*>[\s\S]*?</div>', '', c)
    c = re.sub(r'<div\s+id="bubbleMenu"[^>]*>[\s\S]*?</div>', '', c)
    
    # 3. Insert menuBtn + userArea + bubbleMenu after <body>
    sub_menu = sub_menu_pages if fname != 'search.html' else sub_menu_root
    c = c.replace('<body>', '<body>\n' + menu_btn + '\n' + user_area + '\n' + sub_menu)
    
    # 4. Inject CSS INSIDE <style> (before </style>)
    last_style_close = c.rfind('</style>')  # use last style block
    if last_style_close >= 0:
        c = c[:last_style_close] + menu_css + '\n' + c[last_style_close:]
    else:
        print(f'{fname}: ERROR - no <style> found!')
        continue
    
    # 5. Auth fixes: store JSON instead of email string
    c = c.replace("localStorage.setItem('abi_user',email);", "localStorage.setItem('abi_user',JSON.stringify(payload));")
    
    # 6. Auth cleanup: use location.href instead of reload()
    c = c.replace(
        "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
        "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;"
    )
    
    # 7. Add normalizeUser + getUserName before loginGitHub
    need_nu = 'function normalizeUser()' not in c
    need_gu = 'function getUserName()' not in c
    if need_nu or need_gu:
        insert = ''
        if need_nu:
            insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n"
        if need_gu:
            insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n"
        c = c.replace("function loginGitHub(){", insert + "function loginGitHub(){")
    
    # 8. Fix textContent 
    c = c.replace(".textContent=localStorage.getItem('abi_user')||'已登录';", ".textContent=getUserName();")
    
    # 9. Fix loginGitHub redirect (subpages → index.html)
    c = c.replace(
        "var cb=window.location.origin+window.location.pathname;",
        "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');"
    )
    
    # 10. Fix showUserCenter
    c = c.replace("alert('用户: '+u+'\\n(更多功能开发中)');", "alert('用户: '+getUserName()+'\\n(更多功能开发中)');")
    
    # 11. Fix toggleMenu: sideMenu → bubbleMenu
    c = c.replace("getElementById('sideMenu')", "getElementById('bubbleMenu')")
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    # Verify
    ms = re.findall(r'<script>([\s\S]*?)</script>', c)
    if ms and ms[0]:
        s = ms[0]
        ob = s.count('{'); cb = s.count('}')
        op = s.count('('); cp = s.count(')')
        ok = ob == cb and op == cp
        print(f'{fname}: BRACES {\"OK\" if ok else \"FAIL\"} ({{={ob} }}={cb} (={op})={cp})')
    else:
        print(f'{fname}: NO SCRIPT FOUND')
    
    # Verify features
    has_nav = '<nav' in c
    has_side = 'sideMenu' in c
    has_bubble = 'bubbleMenu' in c
    has_menu_btn = 'menuBtn' in c
    has_user = 'userArea' in c
    has_json = "JSON.stringify(payload)" in c
    has_get_user = "function getUserName()" in c
    has_href = "window.location.href=" in c
    print(f'  nav={not has_nav} sideMenu={not has_side} bubbleMenu={has_bubble} menuBtn={has_menu_btn} userArea={has_user}')
    print(f'  JSON={has_json} getUserName={has_get_user} href={has_href}')
    print()

print('ALL DONE')
