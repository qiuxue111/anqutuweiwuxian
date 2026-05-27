var fs=require('fs');
var files = [
  {loc: 'pages', name: 'gear.html'},
  {loc: 'pages', name: 'strategy.html'},
  {loc: 'pages', name: 'weapons.html'},
  {loc: 'pages', name: 'maps.html'},
  {loc: '', name: 'search.html'}
];

// Helper: replace with CRLF awareness
function replaceCrlf(text, oldStr, newStr){
  var oldCrlf = oldStr.replace(/\n/g, '\r\n');
  var r1 = text.replace(oldCrlf, newStr);
  if(r1 !== text) return r1;
  return text.replace(oldStr, newStr);
}

files.forEach(function(f){
  var fp = 'F:/暗区突围网站/' + f.loc + '/' + f.name;
  var c = fs.readFileSync(fp, 'utf8');
  
  // 0. Remove any duplicate getUserName/normalizeUser from earlier bad runs
  // (not needed since we did git checkout)
  
  // 1. Fix auth storage: use JSON.stringify(payload) instead of email string
  c = replaceCrlf(c,
    "localStorage.setItem('abi_user',email);",
    "localStorage.setItem('abi_user',JSON.stringify(payload));"
  );
  
  // 2. Fix auth cleanup: replaceState + href
  c = replaceCrlf(c,
    "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
    "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;"
  );
  
  // 3. Add getUserName + normalizeUser before loginGitHub
  var needGetUser = c.indexOf('function getUserName')<0;
  var needNorm = c.indexOf('function normalizeUser')<0;
  
  if(needGetUser || needNorm){
    var insert = '';
    if(needNorm){
      insert += "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";
    }
    if(needGetUser){
      insert += "function getUserName(){try{var u=JSON.parse(localStorage.getItem('abi_user'));return u&&(u.user_metadata&&u.user_metadata.preferred_username||u.email||'已登录');}catch(e){return localStorage.getItem('abi_user')||'已登录';}}\n";
    }
    c = replaceCrlf(c, "function loginGitHub(){", insert + "function loginGitHub(){");
  }
  
  // 4. Fix textContent: replace all textContent=lS.getItem('abi_user') with getUserName()
  c = c.replace(/\.textContent=localStorage\.getItem\('abi_user'\)\|\|'已登录';/g,
    ".textContent=getUserName();");
  
  // 5. Fix showUserCenter: use getUserName
  c = replaceCrlf(c,
    "alert('用户: '+u+'\\n(更多功能开发中)');",
    "alert('用户: '+getUserName()+'\\n(更多功能开发中)');"
  );
  
  // 6. Fix optional chaining (?.)
  c = c.replace(/user_metadata\?\.preferred_username/g, "user_metadata.preferred_username");
  
  // 7. Remove duplicate getUserName if any (from previous bad fixes)
  // Find "function getUserName" - if there are multiple, keep first
  var guCount = (c.match(/function getUserName/g)||[]).length;
  if(guCount > 1){
    // Remove duplicates: keep first, remove subsequent
    var first = c.indexOf('function getUserName');
    var afterFirst = c.indexOf('function getUserName', first + 5);
    while(afterFirst >= 0){
      var end = afterFirst + c.substring(afterFirst).indexOf('}') + 1;
      c = c.substring(0, afterFirst) + c.substring(end);
      afterFirst = c.indexOf('function getUserName', first + 5);
    }
  }
  // Same for normalizeUser
  var nuCount = (c.match(/function normalizeUser/g)||[]).length;
  if(nuCount > 1){
    var first = c.indexOf('function normalizeUser');
    var afterFirst = c.indexOf('function normalizeUser', first + 5);
    while(afterFirst >= 0){
      var end = afterFirst + c.substring(afterFirst).indexOf('}') + 1;
      c = c.substring(0, afterFirst) + c.substring(end);
      afterFirst = c.indexOf('function normalizeUser', first + 5);
    }
  }
  
  // 8. Fix db() function: use POST-conditional auth
  // Only for pages that have a db() function
  if(c.indexOf('function db(')>=0){
    // Replace the authorization line to use token variable for POST, anon for GET
    // First, check if it already has the new style
    if(c.indexOf("localStorage.getItem('abi_token')||SUPABASE_ANON")<0){
      // Original style: uses SUPABASE_ANON in Auth
      var oldAuth = "'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'";
      var newAuth = "'Authorization':'Bearer '+(method==='GET'?SUPABASE_ANON:(localStorage.getItem('abi_token')||SUPABASE_ANON)),'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'";
      c = replaceCrlf(c, oldAuth, newAuth);
    }
  }
  
  // 9. Fix loginGitHub redirect for subpages  
  var lgSt = c.indexOf('function loginGitHub()');
  if(lgSt>=0){
    var oldLoginBody = "function loginGitHub(){\n  var cb=window.location.origin+window.location.pathname;\n  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);\n  window.location.href=u;\n}";
    var newLoginBody = "function loginGitHub(){var p=window.location.pathname;var i=p.lastIndexOf('/pages/');var isMap=i>=0;var cb=window.location.origin+(isMap?p.substring(0,i+1)+'index.html':p.replace(/index\\.html$/,'')+'index.html');window.location.href='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);}";
    c = replaceCrlf(c, oldLoginBody, newLoginBody);
  }
  
  fs.writeFileSync(fp, c, 'utf8');
  
  // Verify
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{
      new Function(ms[0].replace(/<\/?script>/g,''));
      console.log(f.name+': OK');
    } catch(e){
      console.log(f.name+': FAIL - '+e.message.substring(0,60));
    }
  }
  
  // Summary
  console.log('  getUserName='+(c.indexOf('function getUserName')>=0)+
    ' normalizeUser='+(c.indexOf('function normalizeUser')>=0)+
    ' JSON='+(c.indexOf("JSON.stringify(payload)")>=0)+
    ' href='+(c.indexOf("location.href=window.location.pathname")>=0 || c.indexOf("location.href=location.pathname")>=0)+
    ' authDB='+(c.indexOf("method==='GET'?SUPABASE_ANON")>=0)+
    ' loginSave='+(c.indexOf("i=p.lastIndexOf")>=0));
  
  // Check balance
  var ms2=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms2&&ms2[0]){
    var s=ms2[0].replace(/<\/?script>/g,'');
    var ob=s.split('{').length-1, cb=s.split('}').length-1;
    var op=s.split('(').length-1, cp=s.split(')').length-1;
    if(ob!==cb) console.log('  BRACE FAIL: {'+ob+' }='+cb);
    if(op!==cp) console.log('  PAREN FAIL: ('+op+' )='+cp);
  }
});
