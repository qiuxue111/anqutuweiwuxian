var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod03_picker.cjs','utf8');
var idx=c.indexOf('supabase(');
// find the supabase call near placePin
var snippet=c.substring(c.indexOf('function placePin'), c.indexOf('function placePin')+800);
console.log(snippet);
