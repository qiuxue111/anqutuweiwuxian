const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = c.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  // Find the likely error location - around 'function'
  // Try to eval line by line near issues
  var lines = script.split('\n');
  var errLine = -1;
  for (var i = 0; i < lines.length; i++) {
    try { new Function(lines.slice(0, i+1).join('\n')); } catch(e) {
      errLine = i;
      console.log('Error at line', i+1, ':', lines[i].substring(0,80));
      console.log('  ->', e.message);
      break;
    }
  }
  if (errLine < 0) console.log('Full script is valid');
  
  if (errLine > 0) {
    // Show context
    for (var j = Math.max(0, errLine-3); j <= Math.min(lines.length-1, errLine+2); j++) {
      console.log((j+1) + ': ' + lines[j].substring(0,100));
    }
  }
}
