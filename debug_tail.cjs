var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var code=c.match(/<script>([\s\S]*?)<\/script>/)[1];
// 逐行检查最后一部分（init IIFE）
var lines=code.split('\n');
var lastLines=lines.slice(-60);
console.log('=== LAST 60 LINES ===');
lastLines.forEach(function(l, i) {
  console.log((lines.length-60+i+1)+': '+l.substring(0,200));
});
