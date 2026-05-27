var c=require('fs').readFileSync('F:\\暗区突围网站\\_bak_2026-05-27-11-23\\map-farm.html','utf8');
var i=c.indexOf('sb');
while(i>=0) {
  console.log('pos '+i+': '+c.substring(Math.max(0,i-10), Math.min(c.length,i+80)));
  i=c.indexOf('sb',i+1);
  if(i>5000) break;
}
