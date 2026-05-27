var fs=require('fs');
var c=fs.readFileSync('F:/暗区突围网站/index.html','utf8');

var nuFunc = "function normalizeUser(){try{var u=localStorage.getItem('abi_user');if(!u)return;var p=JSON.parse(u);if(typeof p==='string'){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:p}}));}else if(!p.user_metadata){var name=p.preferred_username||p.email||'User';localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:name}}));}}catch(e){localStorage.setItem('abi_user',JSON.stringify({user_metadata:{preferred_username:u}}));}}\n";

if(c.indexOf('normalizeUser')>=0){
  console.log('index.html: already has normalizeUser');
} else {
  // Add before getUserName
  c=c.replace('function getUserName(){', nuFunc+'function getUserName(){');
  // Add call before IIFE
  c=c.replace("(function(){var token=localStorage.getItem('abi_token');", "normalizeUser();(function(){var token=localStorage.getItem('abi_token');");
  fs.writeFileSync('F:/暗区突围网站/index.html',c,'utf8');
  console.log('index.html: FIXED');
}

// Verify
c=fs.readFileSync('F:/暗区突围网站/index.html','utf8');
var ms=c.match(/<script>[\s\S]*?<\/script>/g);
var allOK=true;
(ms||[]).forEach(function(m,i){
  try{new Function(m.replace(/<\/?script>/g,''));}
  catch(e){console.log('Script '+i+': FAIL - '+e.message);allOK=false;}
});
if(allOK) console.log('All scripts PARSE OK');
