var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ms=c.match(/<script>([\s\S]*?)<\/script>/);
var raw=ms[1];
var idx=raw.indexOf('placePin');
console.log(raw.substring(idx, idx+600));
