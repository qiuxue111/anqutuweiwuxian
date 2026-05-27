var fs=require('fs');
var c=fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
var ms=c.match(/<script>([\s\S]*?)<\/script>/);
var raw=ms[1];
if(raw.indexOf('<')>=0){
  console.log('FOUND < in script:');
  var idx=raw.indexOf('<');
  console.log(raw.substring(Math.max(0,idx-50),idx+50));
} else if(raw.indexOf('&')>=0){
  console.log('FOUND & in script:');
  var idx=raw.indexOf('&');
  console.log(raw.substring(Math.max(0,idx-50),idx+50));
} else {
  console.log('OK - no HTML entities');
}
// also check raw for any broken char
console.log('First 200 chars:',raw.substring(0,200));
