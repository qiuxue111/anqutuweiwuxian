var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ms=c.match(/<script>([\s\S]*?)<\/script>/);
var raw=ms[1];
var idx=raw.indexOf('supabase(');
// find the last supabase call (in placePin)
var lastSup=raw.lastIndexOf('supabase(');
console.log(raw.substring(lastSup, lastSup+200));
