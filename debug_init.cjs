var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var code=c.match(/<script>([\s\S]*?)<\/script>/)[1];
var idx=code.lastIndexOf('(function init');
console.log(code.substring(idx, idx+200));
