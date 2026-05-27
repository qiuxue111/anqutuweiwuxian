var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ms=c.match(/<script>([\s\S]*?)<\/script>/);
var raw=ms[1];
// find all < in script
var idx=0;
var count=0;
while((idx=raw.indexOf('<',idx))>=0 && count<5){
  console.log('Found < at pos',idx,':',raw.substring(Math.max(0,idx-40),idx+40));
  idx++;
  count++;
}
// Also check for &lt;
if(raw.indexOf('&lt;')>=0) console.log('FOUND &lt; in script!');
console.log('Total < count:', count);
// Try eval the first 2000 chars
try{
  new Function(raw.substring(0,2000));
  console.log('First 2000 chars OK');
}catch(e){
  console.log('First 2000 chars ERROR:', e.message.substring(0,100));
}
