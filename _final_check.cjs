var fs=require('fs');
var files=['index.html','pages/map-farm.html','pages/review.html'];
files.forEach(function(f){
  var c=fs.readFileSync('F:/暗区突围网站/'+f,'utf8');
  var cnt=0,pos=0;
  while(pos<c.length){
    var i=c.indexOf('</',pos);
    if(i<0)break;
    if(c.substring(i,i+9)==='</script>') cnt++;
    pos=i+2;
  }
  console.log(f+':');
  console.log('  Regular </script>: '+cnt);
  console.log('  Regular <script>: '+(c.split('<script>').length-1));
  console.log('  Has <!DOCTYPE>: '+c.includes('<!DOCTYPE html>'));
  console.log('  Has <html>: '+c.includes('<html'));
  console.log('  Has </html>: '+c.includes('</html>'));
  console.log('  Has <head>: '+c.includes('<head>'));
  console.log('  Has </body>: '+c.includes('</body>'));
});
