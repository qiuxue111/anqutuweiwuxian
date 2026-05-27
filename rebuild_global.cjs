const fs = require('fs');
const path = require('path');
const root = 'F:\\暗区突围网站';

// ===============================
// GLOBAL NAV + AUTH TEMPLATE
// ===============================

const navHTML = `<nav class="navbar">
  <div class="logo"><a href="../index.html" style="color:#ffc832;text-decoration:none;font-weight:bold;">暗区无限</a><span style="color:#888;font-size:0.8rem;"> 攻略站</span></div>
  <div id="userArea" style="margin-left:auto;display:flex;align-items:center;gap:8px;">
    <span id="userName" style="color:#ffc832;font-size:0.85rem;display:none;"></span>
    <button id="loginBtn" onclick="loginGitHub()" style="padding:4px 12px;background:#ffc832;color:#0a0a0f;border:none;border-radius:4px;font-size:0.8rem;cursor:pointer;font-weight:bold;">登录</button>
    <button id="menuBtn" onclick="toggleMenu()" style="width:32px;height:32px;background:#1e1e2a;color:#ccc;border:1px solid #333;border-radius:6px;font-size:1.2rem;cursor:pointer;display:flex;align-items:center;justify-content:center;">&#9776;</button>
  </div>
  <div id="sideMenu" style="display:none;position:fixed;top:0;right:0;width:260px;height:100vh;background:#0f0f18;border-left:1px solid #1e1e2a;z-index:9999;padding:1rem;box-shadow:-4px 0 20px rgba(0,0,0,0.5);">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid #1e1e2a;">
      <span style="color:#ffc832;font-weight:bold;">菜单</span>
      <button onclick="toggleMenu()" style="width:28px;height:28px;background:transparent;color:#888;border:1px solid #333;border-radius:4px;cursor:pointer;font-size:1rem;">&#10005;</button>
    </div>
    <div style="display:flex;flex-direction:column;gap:4px;">
      <a href="maps.html" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F5FA; 地图选图</a>
      <a href="weapons.html" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F527; 改枪</a>
      <a href="strategy.html" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F4AC; 聊天</a>
      <a href="gear.html" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F4D6; 攻略</a>
      <a href="../search.html" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F50D; 搜索</a>
      <div style="border-top:1px solid #1e1e2a;margin:8px 0;padding-top:8px;">
        <a href="#" onclick="showUserCenter()" style="display:block;padding:10px 12px;color:#ccc;border-radius:6px;text-decoration:none;font-size:0.95rem;">&#x1F464; 用户中心</a>
        <a href="#" onclick="logout()" style="display:block;padding:10px 12px;color:#e74c3c;border-radius:6px;text-decoration:none;font-size:0.9rem;">退出登录</a>
      </div>
    </div>
  </div>
</nav>

<style>
.navbar{display:flex;align-items:center;padding:0.5rem 1rem;background:#0a0a10;border-bottom:1px solid #1a1a28;position:relative;z-index:100;}
.navbar a{transition:color 0.2s;}
.navbar a:hover{color:#ffc832!important;}
#sideMenu a:hover{background:#1a1a28;}
</style>`;

const navJS = `
// ========== GLOBAL AUTH & NAV ==========
function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}

(function initAuth(){
  var h=window.location.hash;
  if(h&&h.indexOf('access_token=')>=0){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        var email=payload.email||p.get('email')||'';
        localStorage.setItem('abi_user',email);
        history.replaceState(null,'',window.location.pathname);
        location.reload();
      }catch(e){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    var u=document.getElementById('userName');
    var b=document.getElementById('loginBtn');
    if(u){u.style.display='';u.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(b){b.style.display='none';}
  }
})();

function toggleMenu(){
  var m=document.getElementById('sideMenu');
  if(!m)return;
  m.style.display=m.style.display==='none'?'block':'none';
}

function logout(){
  localStorage.removeItem('abi_token');
  localStorage.removeItem('abi_user');
  location.reload();
}

function showUserCenter(){
  toggleMenu();
  var u=localStorage.getItem('abi_user');
  if(!u){alert('请先登录');return;}
  var info='[用户中心]\\n用户名: '+u+'\\n(更多功能开发中)';
  alert(info);
}
`;

// ===============================
// HELPER: clean old auth code from first script block
// ===============================

function cleanScriptBlock(code) {
  // Remove old authCheck IIFE
  var result = [];
  var lines = code.split('\n');
  var skipDepth = 0;
  var skipping = false;
  
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i];
    
    // Skip lines that look like old authCheck function declarations
    if (line.indexOf('function authCheck') >= 0 && line.indexOf('IIFE') < 0) {
      skipping = true;
      skipDepth = 1;
      // Count braces in this line
      for (var j = 0; j < line.length; j++) {
        if (line[j] === '{') skipDepth++;
        if (line[j] === '}') skipDepth--;
      }
      if (skipDepth <= 0) skipping = false;
      continue;
    }
    if (skipping) {
      for (var j = 0; j < line.length; j++) {
        if (line[j] === '{') skipDepth++;
        if (line[j] === '}') skipDepth--;
      }
      if (skipDepth <= 0) skipping = false;
      continue;
    }
    
    // Skip lines with function loginGitHub
    if (line.indexOf('function loginGitHub') >= 0) {
      // Skip the function body (3 lines)
      i += 3;
      continue;
    }
    
    // Skip old IIFE with access_token
    if (line.indexOf('(function()') >= 0 && lines[i+1] && lines[i+1].indexOf('access_token') >= 0) {
      var depth = 1;
      for (var k = i; k < lines.length; k++) {
        for (var j = 0; j < lines[k].length; j++) {
          if (lines[k][j] === '(') depth++;
          if (lines[k][j] === ')') depth--;
        }
        if (depth <= 0) { i = k; break; }
      }
      continue;
    }
    
    // Skip authCheck variable
    if (line.indexOf('initAuth') >= 0 && line.indexOf('function') >= 0) {
      for (var k = i; k < lines.length; k++) {
        if (lines[k].indexOf('})();') >= 0) { i = k; break; }
      }
      continue;
    }
    
    result.push(line);
  }
  
  return result.join('\n').replace(/\n\n\n+/g, '\n\n').trim();
}

// ===============================
// APPLY TO ALL PAGES
// ===============================

function applyToFile(relativePath) {
  var filePath = root + '\\' + relativePath.replace(/\//g, '\\');
  if (!fs.existsSync(filePath)) return;
  var c = fs.readFileSync(filePath, 'utf8');
  
  // Remove existing nav
  c = c.replace(/<nav[\s\S]*?<\/nav>/, '');
  // Remove any existing sideMenu
  c = c.replace(/<div id="sideMenu"[\s\S]*?<\/div>/, '');
  // Remove navbar
  c = c.replace(/<div class="navbar"[\s\S]*?<\/div>/, '');
  
  // Insert new nav after <body> tag
  var bodyEnd = c.indexOf('>', c.indexOf('<body')) + 1;
  if (bodyEnd > 0) {
    c = c.substring(0, bodyEnd) + '\n' + navHTML + '\n' + c.substring(bodyEnd);
  }
  
  // Fix href for pages in /pages/ subdirectory vs root
  if (relativePath.indexOf('pages/') === 0 || relativePath.indexOf('pages\\') === 0) {
    c = c.replace('href="pages/maps.html"', 'href="maps.html"');
    c = c.replace('href="pages/weapons.html"', 'href="weapons.html"');
    c = c.replace('href="pages/strategy.html"', 'href="strategy.html"');
    c = c.replace('href="pages/gear.html"', 'href="gear.html"');
    c = c.replace('"../search.html"', '"../search.html"'); // keep for pages in /pages/
    c = c.replace('"../index.html"', '"../index.html"');   // keep for pages in /pages/
  } else {
    c = c.replace('"maps.html"', '"pages/maps.html"');
    c = c.replace('"weapons.html"', '"pages/weapons.html"');
    c = c.replace('"strategy.html"', '"pages/strategy.html"');
    c = c.replace('"gear.html"', '"pages/gear.html"');
    c = c.replace('"../search.html"', '"search.html"');
    c = c.replace('"../index.html"', '"index.html"');
  }
  
  // Process the FIRST script block
  var scriptIdx = c.indexOf('<script>');
  var scriptEnd = c.indexOf('</script>', scriptIdx + 8);
  
  if (scriptIdx >= 0 && scriptEnd > scriptIdx) {
    var originalContent = c.substring(scriptIdx + 8, scriptEnd);
    var cleaned = cleanScriptBlock(originalContent);
    // Add our navJS at the beginning of the script
    c = c.substring(0, scriptIdx + 8) + '\n' + navJS + '\n' + cleaned + '\n' + c.substring(scriptEnd);
  }
  
  fs.writeFileSync(filePath, c);
  var name = relativePath.replace('/', '\\');
  console.log(name + ': done');
}

var pages = [
  'index.html',
  'search.html',
  'pages/maps.html',
  'pages/weapons.html',
  'pages/strategy.html',
  'pages/gear.html',
  'pages/map-farm.html',
  'pages/map-beishan.html',
  'pages/map-valley.html',
  'pages/map-armory.html',
  'pages/map-airport.html',
  'pages/map-tvstation.html'
];

pages.forEach(applyToFile);

// Validate all scripts
console.log('\n=== Validation ===');
pages.forEach(function(p) {
  var fp = root + '\\' + p.replace(/\//g, '\\');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  if (!scripts) { console.log(p + ': no scripts'); return; }
  scripts.forEach(function(s) {
    try {
      new Function(s.replace('<script>','').replace('<\/script>',''));
    } catch(e) {
      console.log(p + ': SCRIPT ERROR - ' + e.message.substring(0, 80));
    }
  });
});

console.log('\nAll done!');
