var fs=require('fs');
var pages=['maps.html','gear.html','strategy.html','weapons.html'];
var baseDir='F:/暗区突围网站/pages/';

pages.forEach(function(f){
  var fp=baseDir+f;
  var c=fs.readFileSync(fp,'utf8');
  
  // 1. Fix auth block: replace href
  c=c.replace("history.replaceState(null,'',window.location.pathname);\n          window.location.reload();",
              "history.replaceState(null,'',window.location.pathname+window.location.search);\n          window.location.href=window.location.pathname+window.location.search;");
  
  // 2. Fix abi_user storage: store JSON (same as index.html)
  c=c.replace(
    "localStorage.setItem('abi_user',uname);",
    "localStorage.setItem('abi_user',JSON.stringify(payload));"
  );
  
  // 3. Add normalizeUser + getUserName function, fix textContent
  c=c.replace(
    "function loginGitHub(){",
    "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\nfunction getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.user_metadata&&u.user_metadata.user_name||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\nfunction loginGitHub(){"
  );
  
  // 5. Insert normalizeUser() call right before the login check IIFE
  // Find the IIFE start
  c=c.replace(
    "(function(){var token=localStorage.getItem('abi_token');",
    "normalizeUser();(function(){var token=localStorage.getItem('abi_token');"
  );
  c=c.replace(/un\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g,
              "un.textContent=getUserName();");
  c=c.replace(/un2\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g,
              "un2.textContent=getUserName();");
  
  fs.writeFileSync(fp,c,'utf8');
  console.log(f+': FIXED ('+c.length+' bytes)');
});

// Verify
pages.forEach(function(f){
  var fp=baseDir+f;
  var c=fs.readFileSync(fp,'utf8');
  var hasGetUser=c.includes('getUserName');
  var hasJSON=c.includes("localStorage.setItem('abi_user',JSON.stringify(payload));");
  var hasLocationHref=c.includes("location.href=window.location.pathname+window.location.search;");
  var hasTextContent=c.includes('un.textContent=getUserName();');
  var scripts=c.split('<script>').length-1;
  var endScripts=c.split('</script>').length-1;
  console.log(f+': getUserName='+hasGetUser+' storeJSON='+hasJSON+' hrefClean='+hasLocationHref+' textContent='+hasTextContent+' scripts='+scripts+'/'+endScripts+(scripts===endScripts?' OK':' FAIL'));
});
