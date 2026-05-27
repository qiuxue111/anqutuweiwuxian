var fs=require('fs');
['maps.html','gear.html','strategy.html','weapons.html'].forEach(function(f){
  var c=fs.readFileSync('F:/暗区突围网站/pages/'+f,'utf8');
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(f+': OK');}
    catch(e){console.log(f+': FAIL',e.message);}
  }
});
