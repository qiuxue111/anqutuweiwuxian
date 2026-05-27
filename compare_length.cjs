const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var s1 = m[1];
  try { new Function(s1); console.log('Farm VALID, len=' + s1.length); }
  catch(e) { console.log('Farm ERROR:', e.message); }
}

var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-beishan.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var s2 = m[1];
  try { new Function(s2); console.log('Beishan VALID'); }
  catch(e) { console.log('Beishan ERROR:', e.message); }
  
  // Compare lengths
  console.log('Beishan Script length:', s2.length);
  console.log('Farm Script length:', require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8').match(/<script>([\s\S]*?)<\/script>/)[1].length);
}
