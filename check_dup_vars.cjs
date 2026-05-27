const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  var v2idx = script.indexOf('// ===== 地图核心交互 v2 =====');
  // Find what's between the first block and v2 inject
  // Look for original window.onload or initAuth
  var originalEnd = script.lastIndexOf('})();', v2idx);
  if (originalEnd < 0) originalEnd = script.lastIndexOf('})();');
  if (originalEnd >= 0) {
    console.log('Original IIFE ending at', originalEnd);
    console.log('Content between IIFE end and v2 inject:');
    console.log(script.substring(originalEnd+5, v2idx).substring(0, 400));
  }
  
  // Check first block: find var mode, var scale
  var vars = ['var scale','var panX','var panY','var isDragging','var mode','var pins'];
  vars.forEach(function(v) {
    var c1 = 0, c2 = 0;
    script.indexOf(v, 0) >= 0 ? c1++ : c1;
    script.indexOf(v, v2idx) >= 0 ? c2++ : c2;
    c1 = (script.match(new RegExp(v.replace(/([.+?^${}()|[\\]\\\\])/g,'\\\\$1'), 'g')) || []).length;
    var beforeV2 = (script.substring(0, v2idx).match(new RegExp(v.replace(/([.+?^${}()|[\\]\\\\])/g,'\\\\$1'), 'g')) || []).length;
    var afterV2 = (script.substring(v2idx).match(new RegExp(v.replace(/([.+?^${}()|[\\]\\\\])/g,'\\\\$1'), 'g')) || []).length;
    console.log(v + ':', beforeV2 + ' before, ' + afterV2 + ' in v2 inject');
  });
}
