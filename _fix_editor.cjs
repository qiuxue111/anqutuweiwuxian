var fs=require('fs');
var fp='F:/暗区突围网站/pages/map-editor.html';
var c=fs.readFileSync(fp,'utf8');

c=c.replace(
  "localStorage.setItem('abi_user',user);",
  "localStorage.setItem('abi_user',JSON.stringify(payload));"
);

c=c.replace(
  "history.replaceState(null,'',window.location.pathname);\n        location.reload();",
  "history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;"
);

fs.writeFileSync(fp,c,'utf8');
console.log('map-editor.html: FIXED');

// Verify
var ms=c.match(/<script>[\s\S]*?<\/script>/g);
var ok=true;
(ms||[]).forEach(function(m,i){
  try{new Function(m.replace(/<\/?script>/g,''));console.log('Script '+i+': OK');}
  catch(e){console.log('Script '+i+': FAIL - '+e.message);ok=false;}
});
