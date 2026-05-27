var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ms=c.match(/<script>([\s\S]*?)<\/script>/);
var raw=ms[1];
// Find all supabase calls
var idx=0;
var count=0;
while(true){
  idx=raw.indexOf('supabase(', idx);
  if(idx<0) break;
  count++;
  var snippet=raw.substring(idx, idx+160);
  console.log('supabase call #'+count+': '+snippet);
  idx+=1;
}
