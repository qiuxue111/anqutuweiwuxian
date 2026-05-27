const fs = require('fs');
const root = 'F:\\暗区突围网站\\v2';

// Inject bubble menu + auth into existing map pages
['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'].forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Remove old nav
  c = c.replace(/<nav[\s\S]*?<\/nav>/, '');
  // Remove old userArea, sideMenu, etc
  c = c.replace(/<div id="sideMenu"[\s\S]*?<\/div>/, '');
  c = c.replace(/<div class="navbar"[\s\S]*?<\/div>/, '');
  c = c.replace(/<div id="userArea"[\s\S]*?<\/div>/, '');
  c = c.replace(/<button id="loginBtn"[\s\S]*?<\/button>/, '');
  c = c.replace(/<button id="menuBtn"[\s\S]*?<\/button>/, '');
  c = c.replace(/<span id="userName"[\s\S]*?<\/span>/, '');
  
  // Insert new floating menu + user area AFTER <body>
  var bodyEnd = c.indexOf('>', c.indexOf('<body')) + 1;
  var newHeader = `
<style>
#menuBtn{position:fixed;top:12px;left:12px;z-index:9999;width:38px;height:38px;border-radius:10px;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);border:1px solid rgba(255,255,255,0.08);color:#ccc;font-size:1.3rem;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.2s;}
#menuBtn:hover{background:rgba(255,200,50,0.15);color:#ffc832;}
#bubbleMenu{display:none;position:fixed;top:56px;left:12px;z-index:9998;background:rgba(15,15,24,0.92);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,0.06);border-radius:14px;padding:8px;min-width:180px;box-shadow:0 8px 40px rgba(0,0,0,0.6);z-index:9999;}
#bubbleMenu a{display:flex;align-items:center;gap:10px;padding:10px 14px;color:#ccc;border-radius:8px;font-size:0.95rem;transition:all 0.15s;text-decoration:none;}
#bubbleMenu a:hover{background:rgba(255,200,50,0.08);color:#ffc832;}
#bubbleMenu .sep{height:1px;background:rgba(255,255,255,0.06);margin:4px 8px;}
#userArea{position:fixed;top:12px;right:12px;z-index:9999;display:flex;align-items:center;gap:8px;}
#userName{color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);display:none;}
#loginBtn{padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;transition:all 0.2s;}
#loginBtn:hover{background:rgba(255,200,50,0.25);}
</style>
<button id="menuBtn" onclick="toggleMenu()">☰</button>
<div id="userArea">
  <span id="userName"></span>
  <button id="loginBtn" onclick="loginGitHub()">登录</button>
</div>
<div id="bubbleMenu">
  <a href="../index.html">🏠 首页</a>
  <a href="maps.html">🗺 地图选图</a>
  <a href="weapons.html">🔧 改枪</a>
  <a href="strategy.html">💬 聊天</a>
  <a href="gear.html">📖 攻略</a>
  <a href="../search.html">🔍 搜索</a>
  <div class="sep"></div>
  <a href="#" onclick="showUserCenter();return false;">👤 用户中心</a>
  <a href="#" onclick="logout();return false;">🚪 退出登录</a>
</div>`;
  
  c = c.substring(0, bodyEnd) + newHeader + c.substring(bodyEnd);
  
  // Add global functions to first script
  // Find existing supabase/supa function and insert our auth code before it
  var scriptIdx = c.indexOf('<script>');
  var scriptEnd = c.indexOf('</script>', scriptIdx + 8);
  
  if (scriptIdx >= 0 && scriptEnd > scriptIdx) {
    var originalScript = c.substring(scriptIdx + 8, scriptEnd);
    // Remove old login-related duplicate functions
    originalScript = originalScript.replace(/function loginGitHub[\s\S]*?\n\}/g, '');
    originalScript = originalScript.replace(/function toggleMenu[\s\S]*?\n\}/g, '');
    originalScript = originalScript.replace(/function logout[\s\S]*?\n\}/g, '');
    originalScript = originalScript.replace(/function showUserCenter[\s\S]*?\n\}/g, '');
    // AuthCheck IIFEs will be replaced by the new one; duplicates are fine since loginGitHub/etc get removed
    
    var newScript = `
function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}
(function(){
  var h=window.location.hash;
  if(h&&h.indexOf('access_token=')>=0){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        var uname=payload.preferred_username||payload.user_metadata?.preferred_username||payload.email||'';
        localStorage.setItem('abi_user',uname);
        history.replaceState(null,'',window.location.pathname);
        location.reload();
      }catch(e){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(un){un.style.display='';un.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(lb)lb.style.display='none';
  }
})();
function toggleMenu(){
  var m=document.getElementById('bubbleMenu');
  if(!m)return;
  m.style.display=m.style.display==='none'?'block':'none';
  if(m.style.display==='block'){
    setTimeout(function(){
      document.addEventListener('click', function closeMenu(e){
        if(!m.contains(e.target) && e.target.id!=='menuBtn'){
          m.style.display='none';
          document.removeEventListener('click', closeMenu);
        }
      });
    }, 10);
  }
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
  alert('用户: '+u+'\\n(更多功能开发中)');
}
` + originalScript;
    
    c = c.substring(0, scriptIdx + 8) + '\n' + newScript + '\n' + c.substring(scriptEnd);
  }
  
  fs.writeFileSync(fp, c);
  console.log(name + ': updated');
});

// Validate
['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'].forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  if (scripts) scripts.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { console.log(name + ': ERROR - ' + e.message.substring(0,80)); }
  });
});

console.log('Done');
