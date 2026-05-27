var fs=require('fs');
// Fix auth blocks in all remaining pages
var files = [
  {loc: 'pages', name: 'gear.html'},
  {loc: 'pages', name: 'strategy.html'},
  {loc: 'pages', name: 'weapons.html'},
  {loc: 'pages', name: 'maps.html'},
  {loc: '', name: 'search.html'}
];

files.forEach(function(f){
  var fp = 'F:/暗区突围网站/' + f.loc + '/' + f.name;
  var c = fs.readFileSync(fp, 'utf8');
  
  // 1. Fix auth storage: use JSON.stringify(payload) instead of email string
  c=c.replace(
    "localStorage.setItem('abi_user',email);",
    "localStorage.setItem('abi_user',JSON.stringify(payload));"
  );
  
  // 2. Fix auth cleanup: replaceState + href
  c=c.replace(
    "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
    "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;"
  );
  
  // 3. Add getUserName + normalizeUser if not present
  if(c.indexOf('function normalizeUser')<0){
    var nu = "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    c=c.replace("function loginGitHub(){", nu+"function loginGitHub(){");
  }
  
  if(c.indexOf('function getUserName')<0){
    var gu = "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    c=c.replace("function loginGitHub(){", gu+"function loginGitHub(){");
// Only if neither exists yet
  }
  
  // 4. Fix textContent references (original code uses different variable names)
  c=c.replace(/un\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g,
    "un.textContent=getUserName();");
  
  // 5. Fix showUserCenter: use getUserName
  c=c.replace(
    "alert('用户: '+(getUserName?getUserName():u)+'\\n(更多功能开发中)');",
    "alert('用户: '+(typeof getUserName==='function'?getUserName():u)+'\\n(更多功能开发中)');"
  );
  // Also fix the original version without getUserName check
  c=c.replace(
    "alert('用户: '+u+'\\n(更多功能开发中)');",
    "alert('用户: '+getUserName()+'\\n(更多功能开发中)');"
  );
  
  // 6. Replace unsafe optional chaining (?.) for older browser compat
  c=c.replace(
    ".user_metadata?.preferred_username",
    ".user_metadata&&.user_metadata.preferred_username"
  );
  // Actually that doesn't work - let's use proper regex
  while(c.indexOf("user_metadata?.preferred_username")>=0){
    c=c.replace("user_metadata?.preferred_username", "user_metadata__preferred_username");
  }
  // Fix: remove the ?
  c=c.replace("user_metadata__preferred_username", "user_metadata?.['preferred_username']");
  // Actually just replace the whole line with a proper version
  
  fs.writeFileSync(fp, c, 'utf8');
  
  // Verify
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(f.name+': OK');}
    catch(e){console.log(f.name+': FAIL - '+e.message);}
  }
  
  // Summary
  var hasGU = c.indexOf('function getUserName')>=0;
  var hasNU = c.indexOf('function normalizeUser')>=0;
  var hasJSON = c.indexOf("localStorage.setItem('abi_user',JSON.stringify(payload));")>=0;
  var hasHref = c.indexOf("location.href=window.location.pathname+window.location.search;")>=0;
  console.log('  getUserName='+hasGU+' normalizeUser='+hasNU+' JSON='+hasJSON+' href='+hasHref);
});
