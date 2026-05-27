var fs=require('fs');
var fp='F:/暗区突围网站/search.html';
var c=fs.readFileSync(fp,'utf8');

// 1. Fix abi_user storage: use JSON.stringify(payload)
c=c.replace(
  "localStorage.setItem('abi_user',uname);",
  "localStorage.setItem('abi_user',JSON.stringify(payload));"
);

// 2. Fix auth cleanup: replaceState + href instead of reload
c=c.replace(
  "history.replaceState(null,'',window.location.pathname);\n          window.location.reload();",
  "history.replaceState(null,'',window.location.pathname+window.location.search);\n          window.location.href=window.location.pathname+window.location.search;"
);

// 3. Add normalizeUser + getUserName before loginGitHub
c=c.replace(
  "function loginGitHub(){",
  "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\nfunction getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.user_metadata&&u.user_metadata.user_name||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\nfunction loginGitHub(){"
);

// 4. Fix loginGitHub: use path-savvy redirect
c=c.replace(
  "var cb=window.location.origin+window.location.pathname;",
  "var p=window.location.pathname;var i=p.lastIndexOf('/');var isRoot=i===0&&p.indexOf('.html')<0;var cb=window.location.origin+(isRoot?'/index.html':p.replace(/index\\.html$/,'')+'index.html');"
);

// 5. Replace all textContent=localStorage with getUserName()
c=c.replace(/un\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g,
  "un.textContent=getUserName();");
c=c.replace(/un2\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g,
  "un2.textContent=getUserName();");

// 6. Add normalizeUser call in IIFE
c=c.replace(
  "(function(){\n  var h=window.location.hash;",
  "(function(){\n  normalizeUser();\n  var h=window.location.hash;"
);

// 7. Fix showUserCenter: use getUserName
c=c.replace(
  "alert('用户: '+u+'\\n(更多功能开发中)');",
  "alert('用户: '+(getUserName?getUserName():u)+'\\n(更多功能开发中)');"
);

fs.writeFileSync(fp,c,'utf8');

// Verify
c=fs.readFileSync(fp,'utf8');
var ms=c.match(/<script>[\s\S]*?<\/script>/g);
var ok=true;
(ms||[]).forEach(function(m,i){
  try{new Function(m.replace(/<\/?script>/g,''));}
  catch(e){console.log('Script '+i+': FAIL - '+e.message);ok=false;}
});
if(ok) console.log('search.html: ALL PARSE OK');

// Check no bare textContent
var bad=c.match(/textContent=localStorage\.getItem\('abi_user'\)/);
console.log('bare textContent:', bad?'WARN FOUND':'OK');
console.log('getUserName:', c.includes('getUserName'));
console.log('normalizeUser:', c.includes('normalizeUser'));
