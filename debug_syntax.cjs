const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = c.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  try { new Function(script); console.log('VALID'); }
  catch(e) {
    console.log('Error:', e.message);
    // Find the position in the string - look around the error line
  }
  // Count opening/closing braces
  var opens = (script.match(/\{/g) || []).length;
  var closes = (script.match(/\}/g) || []).length;
  console.log('Braces: open=' + opens + ' close=' + closes + ' diff=' + (opens - closes));
  
  // Show the last 500 chars of script
  console.log('Last 500 chars:');
  console.log(script.substring(script.length - 500));
}
