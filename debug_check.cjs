var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var i=c.indexOf('id="ab"');
console.log('ab: '+c.substring(Math.max(0,i-20), i+120));
var j=c.indexOf('id="sb"');
console.log('sb: '+c.substring(Math.max(0,j-20), j+120));
