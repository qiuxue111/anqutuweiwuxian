var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var code=c.match(/<script>([\s\S]*?)<\/script>/)[1];
var j=code.indexOf('sb=document');
console.log('Found at:', j);
if(j>=0) console.log('Context:', code.substring(j, j+60));
// 看看附近有没有 sb=
var ji=code.lastIndexOf(');var', j);
console.log('Before:', code.substring(ji, j+60));
