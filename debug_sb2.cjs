var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var script=c.match(/<script>([\s\S]*?)<\/script>/);
var code=script[1];
// 检查 showPicker
var i=code.indexOf('function showPicker');
console.log('showPicker:', i>=0?'found:'+code.substring(i, i+300):'NOT FOUND');
// 检查 sb.onclick
var j=code.indexOf('sb.onclick');
console.log('sb.onclick:', j>=0?'found:'+code.substring(j, j+200):'NOT FOUND');
// 检查 sb getElementById
var k=code.indexOf('getElementById(\"sb\")');
console.log('getElementById sb:', k>=0?'found':'NOT FOUND');
