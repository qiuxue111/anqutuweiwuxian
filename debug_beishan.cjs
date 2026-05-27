const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-beishan.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  try { new Function(script); console.log('OK'); }
  catch(e) { console.log('ERR:', e.message); console.log('Len:', script.length); }
}
