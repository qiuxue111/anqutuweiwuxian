var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var idx=c.indexOf('id="pd"');
console.log(c.substring(idx, idx+500));
