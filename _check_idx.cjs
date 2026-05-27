var fs=require('fs');
var c=fs.readFileSync('F:/暗区突围网站/index.html','utf8');
var ms=c.match(/<script>[\s\S]*?<\/script>/g);
console.log('Script blocks:', ms.length);
if(ms.length>=2){
  var s1=ms[0].replace(/<\/?script>/g,'');
  var s2=ms[1].replace(/<\/?script>/g,'');
  console.log('Script0:', s1.length, 'chars', '{}:', s1.split('{').length-1, '=', s1.split('}').length-1);
  console.log('Script1:', s2.length, 'chars', '{}:', s2.split('{').length-1, '=', s2.split('}').length-1);
  
  // Check for dangling script content after last </script>
  var lastScript=c.lastIndexOf('</script>');
  var after=c.substring(lastScript+9);
  console.log('After last </script>:', after.substring(0,100).replace(/\n/g,'\\n'));
  
  // Check if there's a trailing errant code
  if(after.trim().length > 0){
    console.log('DANGLING CODE!');
  }
  
  try{new Function(s1);console.log('Script0: PARSE OK');}
  catch(e){console.log('Script0: PARSE FAIL -', e.message);}
  
  try{new Function(s2);console.log('Script1: PARSE OK');}
  catch(e){console.log('Script1: PARSE FAIL -', e.message);}
}
