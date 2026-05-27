var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\_mod01_basics.cjs','utf8');
var idx=c.indexOf('function supabase');
var end=c.indexOf('"];', idx)+3;
console.log(c.substring(idx, end));
