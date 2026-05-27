var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var idx=c.indexOf('id="sb"');
console.log('id="sb" at: '+idx);
console.log('Context: '+c.substring(Math.max(0,idx-20), idx+100));
// 看看所有按钮
var i=0; var btns=[];
while((i=c.indexOf('<button',i))>=0){ var e=c.indexOf('>',i); btns.push(c.substring(i,e+1)); i++;}
btns.forEach(function(b,i){ console.log(i+': '+b.substring(0,100)); });
