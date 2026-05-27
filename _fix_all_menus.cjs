var fs=require('fs');

// Unified menu HTML (bubbleMenu style with home, review, etc.)
var newMenu = '<div id="bubbleMenu"><a href="index.html" style="color:#ffc832;">🏠 首页</a><a href="pages/maps.html">🗺 地图选图</a><a href="pages/weapons.html">🔧 改枪</a><a href="pages/strategy.html">💬 聊天</a><a href="pages/gear.html">📖 攻略</a><a href="search.html">🔍 搜索</a><div class="sep"></div><a id="reviewBtn" href="pages/review.html" style="display:none;">✅ 审核中心</a><a href="#" onclick="showUserCenter()">👤 用户中心</a><a href="#" onclick="logout()">🚪 退出登录</a></div>';

// Same menu but for pages/search.html (different relative paths: from root)
var newMenuRoot = '<div id="bubbleMenu"><a href="index.html" style="color:#ffc832;">🏠 首页</a><a href="pages/maps.html">🗺 地图选图</a><a href="pages/weapons.html">🔧 改枪</a><a href="pages/strategy.html">💬 聊天</a><a href="pages/gear.html">📖 攻略</a><a href="search.html">🔍 搜索</a><div class="sep"></div><a id="reviewBtn" href="pages/review.html" style="display:none;">✅ 审核中心</a><a href="#" onclick="showUserCenter()">👤 用户中心</a><a href="#" onclick="logout()">🚪 退出登录</a></div>';

// Pages files: maps.html, gear.html, strategy.html, weapons.html
// They're in /pages/ so paths start with ../ for index/search
var newMenuPages = '<div id="bubbleMenu"><a href="../index.html">🏠 首页</a><a href="maps.html" style="color:#ffc832;">🗺 地图选图</a><a href="weapons.html">🔧 改枪</a><a href="strategy.html">💬 聊天</a><a href="gear.html">📖 攻略</a><a href="../search.html">🔍 搜索</a><div class="sep"></div><a id="reviewBtn" href="review.html" style="display:none;">✅ 审核中心</a><a href="#" onclick="showUserCenter()">👤 用户中心</a><a href="#" onclick="logout()">🚪 退出登录</a></div>';

var newUserArea = '<div id="userArea"><span id="loginDot" style="display:none;width:8px;height:8px;border-radius:50%;background:#2ecc71;margin-right:2px;"></span><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>';

// Helper: CRLF-aware replace
function replaceCrlf(text, oldStr, newStr){
  var r = text.replace(oldStr.replace(/\n/g,'\r\n'), newStr);
  if(r !== text) return r;
  return text.replace(oldStr, newStr);
}

// ===== 1. Fix page-level files (gear, strategy, weapons) =====
var pageFiles = [
  {name: 'gear.html', homePage: '../index.html', reviewPage: 'review.html'},
  {name: 'strategy.html', homePage: '../index.html', reviewPage: 'review.html'},
  {name: 'weapons.html', homePage: '../index.html', reviewPage: 'review.html'}
];

pageFiles.forEach(function(pf){
  var fp = 'F:/暗区突围网站/pages/' + pf.name;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Replace sideMenu with bubbleMenu
  var sideMenuRegex = /<div\s+id="sideMenu"[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
  c = c.replace(sideMenuRegex, newMenuPages);
  
  // Replace userArea
  var userAreaOld = /<div\s+id="userArea"[^>]*>[\s\S]*?<\/div>/;
  c = c.replace(userAreaOld, newUserArea);
  
  // Remove old menuBtn inside userArea if exists
  // (the menuBtn is already in the new content)
  
  // Fix auth: JSON.stringify(payload) + href cleanup
  c = replaceCrlf(c,
    "localStorage.setItem('abi_user',email);",
    "localStorage.setItem('abi_user',JSON.stringify(payload));");
  c = replaceCrlf(c,
    "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
    "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;");
  
  // Add normalizeUser + getUserName
  var needNU = c.indexOf('function normalizeUser') < 0;
  var needGU = c.indexOf('function getUserName') < 0;
  if(needNU || needGU){
    var insert = '';
    if(needNU) insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    if(needGU) insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    c = replaceCrlf(c, "function loginGitHub(){", insert + "function loginGitHub(){");
  }
  
  // Fix textContent
  c = c.replace(/\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g, ".textContent=getUserName();");
  
  // Fix loginGitHub redirect
  c = replaceCrlf(c,
    "var cb=window.location.origin+window.location.pathname;",
    "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');");
  
  // Fix showUserCenter
  c = replaceCrlf(c,
    "alert('用户: '+u+'\\n(更多功能开发中)');",
    "alert('用户: '+getUserName()+'\\n(更多功能开发中)');");
  c = replaceCrlf(c,
    "var info='[用户中心]\\n用户名: '+u+'\\n(更多功能开发中)';",
    "var info='[用户中心]\\n用户名: '+getUserName()+'\\n(更多功能开发中)';");
  c = replaceCrlf(c,
    "alert(info);",
    "alert(info);");
  
  // Fix toggleMenu to work with bubbleMenu
  c = replaceCrlf(c,
    "var m=document.getElementById('sideMenu');",
    "var m=document.getElementById('bubbleMenu');");
  
  fs.writeFileSync(fp, c, 'utf8');
  
  // Verify
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(pf.name+': OK');}
    catch(e){console.log(pf.name+': FAIL - '+e.message.substring(0,60));}
  }
  
  // Check key features
  console.log('  menu=bubbleMenu='+(c.indexOf('bubbleMenu')>=0)+' home='+(c.indexOf('首页')>=0)+
    ' review='+(c.indexOf('reviewBtn')>=0)+' getUserName='+(c.indexOf('function getUserName')>=0));
});

// ===== 2. Fix maps.html =====
(function fixMaps(){
  var fp = 'F:/暗区突围网站/pages/maps.html';
  var c = fs.readFileSync(fp, 'utf8');
  
  var sideMenuRegex = /<div\s+id="sideMenu"[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
  c = c.replace(sideMenuRegex, newMenuPages);
  
  var userAreaOld = /<div\s+id="userArea"[^>]*>[\s\S]*?<\/div>/;
  c = c.replace(userAreaOld, newUserArea);
  
  // Auth fixes
  c = replaceCrlf(c,
    "localStorage.setItem('abi_user',email);",
    "localStorage.setItem('abi_user',JSON.stringify(payload));");
  c = replaceCrlf(c,
    "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
    "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;");
  
  var needNU = c.indexOf('function normalizeUser') < 0;
  var needGU = c.indexOf('function getUserName') < 0;
  if(needNU || needGU){
    var insert = '';
    if(needNU) insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    if(needGU) insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    c = replaceCrlf(c, "function loginGitHub(){", insert + "function loginGitHub(){");
  }
  
  c = c.replace(/\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g, ".textContent=getUserName();");
  
  c = replaceCrlf(c,
    "var cb=window.location.origin+window.location.pathname;",
    "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');");
  
  c = replaceCrlf(c,
    "var m=document.getElementById('sideMenu');",
    "var m=document.getElementById('bubbleMenu');");
  
  fs.writeFileSync(fp, c, 'utf8');
  
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log('maps.html: OK');}
    catch(e){console.log('maps.html: FAIL - '+e.message.substring(0,60));}
  }
  console.log('  menu=bubbleMenu='+(c.indexOf('bubbleMenu')>=0)+' home='+(c.indexOf('首页')>=0));
})();

// ===== 3. Fix search.html (in root) =====
(function fixSearch(){
  var fp = 'F:/暗区突围网站/search.html';
  var c = fs.readFileSync(fp, 'utf8');
  
  var sideMenuRegex = /<div\s+id="sideMenu"[^>]*>[\s\S]*?<\/div>\s*<\/div>/;
  c = c.replace(sideMenuRegex, newMenuRoot);
  
  var userAreaOld = /<div\s+id="userArea"[^>]*>[\s\S]*?<\/div>/;
  c = c.replace(userAreaOld, newUserArea);
  
  // Auth fixes
  c = replaceCrlf(c,
    "localStorage.setItem('abi_user',email);",
    "localStorage.setItem('abi_user',JSON.stringify(payload));");
  c = replaceCrlf(c,
    "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
    "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;");
  
  var needNU = c.indexOf('function normalizeUser') < 0;
  var needGU = c.indexOf('function getUserName') < 0;
  if(needNU || needGU){
    var insert = '';
    if(needNU) insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    if(needGU) insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    c = replaceCrlf(c, "function loginGitHub(){", insert + "function loginGitHub(){");
  }
  
  c = c.replace(/\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g, ".textContent=getUserName();");
  
  c = replaceCrlf(c,
    "var cb=window.location.origin+window.location.pathname;",
    "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');");
  
  c = replaceCrlf(c,
    "var m=document.getElementById('sideMenu');",
    "var m=document.getElementById('bubbleMenu');");
  
  // Fix showUserCenter for search.html (different format)
  c = replaceCrlf(c,
    "alert('用户: '+u+'\\n(更多功能开发中)');",
    "alert('用户: '+getUserName()+'\\n(更多功能开发中)');");
  
  fs.writeFileSync(fp, c, 'utf8');
  
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log('search.html: OK');}
    catch(e){console.log('search.html: FAIL - '+e.message.substring(0,60));}
  }
  console.log('  menu=bubbleMenu='+(c.indexOf('bubbleMenu')>=0)+' home='+(c.indexOf('首页')>=0));
})();

console.log('\nDONE');
