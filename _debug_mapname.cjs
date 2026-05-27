var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');
console.log('MAP_ENG in source:',c.indexOf('MAP_ENG')>=0?'YES':'NO');
// check all modules against a clean map
var clean=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ms=clean.match(/<script>([\s\S]*?)<\/script>/);
var raw=ms[1];
var idx=raw.indexOf('mapNameEng');
console.log('In HTML:', raw.substring(idx, idx+50));
