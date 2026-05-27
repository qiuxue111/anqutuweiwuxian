import re, os

base = 'F:/暗区突围网站/'
page_files = ['pages/maps.html', 'pages/gear.html', 'pages/strategy.html', 'pages/weapons.html', 'search.html']

menu_btn = '<button id="menuBtn" onclick="toggleMenu()">☰</button>'
user_area = '<div id="userArea"><span id="loginDot" style="display:none;width:8px;height:8px;border-radius:50%;background:#2ecc71;margin-right:2px;"></span><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>'

sub_menu_pages = '<div id="bubbleMenu"><a href="../index.html">@#home#@</a><a href="maps.html">@#map#@</a><a href="weapons.html">@#weapon#@</a><a href="strategy.html">@#chat#@</a><a href="gear.html">@#gear#@</a><a href="../search.html">@#search#@</a><div class="sep"></div><a href="#" onclick="showUserCenter()">@#profile#@</a><a href="#" onclick="logout()">@#logout#@</a></div>'
sub_menu_root = '<div id="bubbleMenu"><a href="index.html">@#home#@</a><a href="pages/maps.html">@#map#@</a><a href="pages/weapons.html">@#weapon#@</a><a href="pages/strategy.html">@#chat#@</a><a href="pages/gear.html">@#gear#@</a><a href="search.html">@#search#@</a><div class="sep"></div><a href="#" onclick="showUserCenter()">@#profile#@</a><a href="#" onclick="logout()">@#logout#@</a></div>'

menu_css = '''
#menuBtn{position:fixed;top:12px;left:12px;z-index:9999;width:38px;height:38px;border-radius:10px;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.08);color:#ccc;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
#menuBtn:hover{background:rgba(255,200,50,0.15);color:#ffc832;}
#bubbleMenu{display:none;position:fixed;top:56px;left:12px;z-index:9998;background:rgba(15,15,24,0.92);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:8px;min-width:180px;box-shadow:0 8px 40px rgba(0,0,0,0.6);overflow:hidden;}
#bubbleMenu a{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#ccc;border-radius:8px;font-size:0.95rem;transition:all 0.15s;}
#bubbleMenu a:hover{background:rgba(255,200,50,0.08);color:#ffc832;}
#bubbleMenu .sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 8px;}
'''

# Placeholder replacement
repl_map = {'@#home#@':'🏠 首页','@#map#@':'🗺 地图选图','@#weapon#@':'🔧 改枪','@#chat#@':'💬 聊天','@#gear#@':'📖 攻略','@#search#@':'🔍 搜索','@#profile#@':'👤 用户中心','@#logout#@':'🚪 退出登录'}

for fname in page_files:
    fp = base + fname
    with open(fp, 'r', encoding='utf8') as f:
        c = f.read()
    
    # Remove nav, old user-area, sideMenu
    c = re.sub(r'<nav[^>]*>[\s\S]*?</nav>', '', c)
    c = re.sub(r'<div\s+id="userArea"[^>]*>[\s\S]*?</div>', '', c)
    c = re.sub(r'<div\s+id="sideMenu"[^>]*>[\s\S]*?</div>', '', c)
    c = re.sub(r'<div\s+id="bubbleMenu"[^>]*>[\s\S]*?</div>', '', c)
    
    # Insert HTML after <body>
    sub_m = sub_menu_pages if fname != 'search.html' else sub_menu_root
    c = c.replace('<body>', '<body>\n' + menu_btn + '\n' + user_area + '\n' + sub_m)
    
    # Inject CSS before last </style>
    idx = c.rfind('</style>')
    if idx >= 0:
        c = c[:idx] + menu_css + '\n' + c[idx:]
    
    # Auth fixes
    c = c.replace("localStorage.setItem('abi_user',email);", "localStorage.setItem('abi_user',JSON.stringify(payload));")
    c = c.replace("history.replaceState(null,'',window.location.pathname);\n        location.reload();", "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;")
    
    # Add normalizeUser + getUserName
    need_nu = 'function normalizeUser()' not in c
    need_gu = 'function getUserName()' not in c
    if need_nu or need_gu:
        ins = ''
        if need_nu:
            ins += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n"
        if need_gu:
            ins += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n"
        c = c.replace("function loginGitHub(){", ins + "function loginGitHub(){")
    
    c = c.replace(".textContent=localStorage.getItem('abi_user')||'已登录';", ".textContent=getUserName();")
    c = c.replace("var cb=window.location.origin+window.location.pathname;", "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');")
    c = c.replace("alert('用户: '+u+'\\n(更多功能开发中)');", "alert('用户: '+getUserName()+'\\n(更多功能开发中)');")
    c = c.replace("getElementById('sideMenu')", "getElementById('bubbleMenu')")
    
    # Replace menu placeholders
    for k,v in repl_map.items():
        c = c.replace(k, v)
    
    with open(fp, 'w', encoding='utf8') as f:
        f.write(c)
    
    print(fname + ': saved')
    print('  nav removed:', '<nav' not in c)
    print('  CSS in style:', '#bubbleMenu' in c.split('</style>')[0] if '</style>' in c else 'NO STYLE')
    print('  bubbleMenu in body:', 'bubbleMenu' in c[c.index('</head>'):] if '</head>' in c else 'no head')
    print('  toggleMenu fixed:', "getElementById('bubbleMenu')" in c)
    print()

print('ALL DONE')
