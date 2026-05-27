var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
var idx=c.indexOf('function placePin');
console.log(c.substring(idx, idx+400));
