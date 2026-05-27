var fs=require('fs');

// Submenu for pages/ subdirectory
var subMenuPages = '<div id="bubbleMenu"><a href="../index.html">@#home#@</a><a href="maps.html">@#map#@</a><a href="weapons.html">@#weapon#@</a><a href="strategy.html">@#chat#@</a><a href="gear.html">@#gear#@</a><a href="../search.html">@#search#@</a><div class="sep"></div><a href="#" onclick="showUserCenter()">@#profile#@</a><a href="#" onclick="logout()">@#logout#@</a></div>';

var subMenuRoot = '<div id="bubbleMenu"><a href="index.html">@#home#@</a><a href="pages/maps.html">@#map#@</a><a href="pages/weapons.html">@#weapon#@</a><a href="pages/strategy.html">@#chat#@</a><a href="pages/gear.html">@#gear#@</a><a href="search.html">@#search#@</a><div class="sep"></div><a href="#" onclick="showUserCenter()">@#profile#@</a><a href="#" onclick="logout()">@#logout#@</a></div>';

var userAreaHTML = '<div id="userArea"><span id="loginDot" style="display:none;width:8px;height:8px;border-radius:50%;background:#2ecc71;margin-right:2px;"></span><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>';

var menuBtnHTML = '<button id="menuBtn" onclick="toggleMenu()">☰</button>';

function replaceCrlf(text, oldStr, newStr){
  var r = text.replace(oldStr.replace(/\n/g,'\r\n'), newStr);
  if(r !== text) return r;
  return text.replace(oldStr, newStr);
}

var subPages = ['maps.html','gear.html','strategy.html','weapons.html'];
subPages.forEach(function(f){
  var fp = 'F:/暗区突围网站/pages/' + f;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Remove nav, old userArea, old sideMenu/bubbleMenu
  c = c.replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '');
  c = c.replace(/<div\s+id="userArea"[^>]*>[\s\S]*?<\/div>/g, '');
  c = c.replace(/<div\s+id="sideMenu"[^>]*>[\s\S]*?<\/div>/g, '');
  c = c.replace(/<div\s+id="bubbleMenu"[^>]*>[\s\S]*?<\/div>/g, '');
  
  // Insert after <body>
  c = c.replace('<body>', '<body>\n' + menuBtnHTML + '\n' + userAreaHTML + '\n' + subMenuPages);
  
  // Auth fixes
  c = replaceCrlf(c, "localStorage.setItem('abi_user',email);", "localStorage.setItem('abi_user',JSON.stringify(payload));");
  c = replaceCrlf(c, "history.replaceState(null,'',window.location.pathname);\n        location.reload();", "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;");
  
  // Add normalizeUser + getUserName
  var needNU = c.indexOf('function normalizeUser') < 0;
  var needGU = c.indexOf('function getUserName') < 0;
  if(needNU || needGU){
    var insert = '';
    if(needNU) insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    if(needGU) insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    c = replaceCrlf(c, "function loginGitHub(){", insert + "function loginGitHub(){");
  }
  
  c = c.replace(/\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g, ".textContent=getUserName();");
  
  c = replaceCrlf(c, "var cb=window.location.origin+window.location.pathname;", "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');");
  
  c = replaceCrlf(c, "alert('用户: '+u+'\\n(更多功能开发中)');", "alert('用户: '+getUserName()+'\\n(更多功能开发中)');");
  
  fs.writeFileSync(fp, c, 'utf8');
  
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(f+': OK');}
    catch(e){console.log(f+': FAIL - '+e.message.substring(0,60));}
  }
  console.log('  bubbleMenu='+(c.indexOf('bubbleMenu')>=0)+' menuBtn='+(c.indexOf('menuBtn')>=0));
});

// search.html
(function(){
  var fp = 'F:/暗区突围网站/search.html';
  var c = fs.readFileSync(fp, 'utf8');
  
  c = c.replace(/<nav[^>]*>[\s\S]*?<\/nav>/g, '');
  c = c.replace(/<div\s+id="userArea"[^>]*>[\s\S]*?<\/div>/g, '');
  c = c.replace(/<div\s+id="sideMenu"[^>]*>[\s\S]*?<\/div>/g, '');
  c = c.replace(/<div\s+id="bubbleMenu"[^>]*>[\s\S]*?<\/div>/g, '');
  c = c.replace('<body>', '<body>\n' + menuBtnHTML + '\n' + userAreaHTML + '\n' + subMenuRoot);
  
  c = replaceCrlf(c, "localStorage.setItem('abi_user',email);", "localStorage.setItem('abi_user',JSON.stringify(payload));");
  c = replaceCrlf(c, "history.replaceState(null,'',window.location.pathname);\n        location.reload();", "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;");
  
  var needNU = c.indexOf('function normalizeUser') < 0;
  var needGU = c.indexOf('function getUserName') < 0;
  if(needNU || needGU){
    var insert = '';
    if(needNU) insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    if(needGU) insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    c = replaceCrlf(c, "function loginGitHub(){", insert + "function loginGitHub(){");
  }
  
  c = c.replace(/\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g, ".textContent=getUserName();");
  c = replaceCrlf(c, "var cb=window.location.origin+window.location.pathname;", "var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var cb=window.location.origin+(i>=0?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');");
  c = replaceCrlf(c, "alert('用户: '+u+'\\n(更多功能开发中)');", "alert('用户: '+getUserName()+'\\n(更多功能开发中)');");
  
  fs.writeFileSync(fp, c, 'utf8');
  
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log('search.html: OK');}
    catch(e){console.log('search.html: FAIL - '+e.message.substring(0,60));}
  }
  console.log('  bubbleMenu='+(c.indexOf('bubbleMenu')>=0)+' menuBtn='+(c.indexOf('menuBtn')>=0));
})();

console.log('\nDONE');
