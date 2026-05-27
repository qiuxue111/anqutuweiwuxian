var fs=require('fs');
var c=fs.readFileSync('F:/暗区突围网站/pages/review.html','utf8');
var ms=c.match(/<script>[\s\S]*?<\/script>/g);
console.log('Script blocks:', ms.length);
ms.forEach(function(m,i){
  var s=m.replace(/<\/?script>/g,'');
  try{new Function(s);console.log('Script '+i+': PARSE OK ('+s.length+' chars)');}
  catch(e){console.log('Script '+i+': FAIL -',e.message);}
});
