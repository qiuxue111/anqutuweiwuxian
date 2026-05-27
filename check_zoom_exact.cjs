const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  // Find the zoom function in the v2 inject
  var idx = script.indexOf('function zoom(f,cx,cy)');
  console.log('Zoom function:');
  console.log(script.substring(idx, idx+700));
  
  // Also check wheel handler  
  var wheelIdx = script.indexOf("addEventListener('wheel'");
  console.log('\nWheel handler:');
  console.log(script.substring(wheelIdx, wheelIdx+400));
}
