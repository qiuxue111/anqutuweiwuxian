const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  // Find first variable declarations (before the v2 inject)
  var v2idx = script.indexOf('// ===== 地图核心交互 v2 =====');
  console.log('Before v2 inject:');
  console.log(script.substring(v2idx-200, v2idx));
}
