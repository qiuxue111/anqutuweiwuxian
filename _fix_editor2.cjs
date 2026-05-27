var fs=require('fs');
var fp='F:/暗区突围网站/pages/map-editor.html';
var c=fs.readFileSync(fp,'utf8');

// Fix the bottom auth block (there are 2 auth blocks)
var bottomAuth = "(function(){\n  var h=window.location.hash;\n  if(h&&h.includes('access_token=')){\n    var p=new URLSearchParams(h.replace('#',''));\n    var t=p.get('access_token');\n    if(t){\n      try{\n        var payload=JSON.parse(atob(t.split('.')[1]));\n        localStorage.setItem('abi_token',t);\n        localStorage.setItem('abi_user',p.get('email')||payload.email||'');location.reload();\n        history.replaceState(null,'',window.location.pathname);\n      }catch(err){}\n    }\n  }\n})();";

var bottomFixed = "(function(){\n  var h=window.location.hash;\n  if(h&&h.includes('access_token=')){\n    var p=new URLSearchParams(h.replace('#',''));\n    var t=p.get('access_token');\n    if(t){\n      try{\n        var payload=JSON.parse(atob(t.split('.')[1]));\n        localStorage.setItem('abi_token',t);\n        localStorage.setItem('abi_user',JSON.stringify(payload));\n        history.replaceState(null,'',window.location.pathname+window.location.search);\n        window.location.href=window.location.pathname+window.location.search;\n      }catch(err){}\n    }\n  }\n})();";

if(c.indexOf(bottomAuth)>=0){
  c=c.replace(bottomAuth, bottomFixed);
  fs.writeFileSync(fp,c,'utf8');
  console.log('map-editor.html: bottom auth FIXED');
} else {
  console.log('map-editor.html: bottom auth not found matching pattern');
  // Print what's there after the main script
  var scriptEnd = c.lastIndexOf('</script>');
  var afterScript = c.substring(scriptEnd);
  console.log('After last </script>:', afterScript.substring(0,300));
}

// Verify overall
c=fs.readFileSync(fp,'utf8');
var scripts=c.match(/<script>[\s\S]*?<\/script>/g);
console.log('Total scripts:', scripts.length);
var allOK=true;
scripts.forEach(function(m,i){
  try{new Function(m.replace(/<\/?script>/g,''));}
  catch(e){console.log('Script '+i+': FAIL - '+e.message);allOK=false;}
});
if(allOK) console.log('ALL SCRIPTS PARSE OK');
