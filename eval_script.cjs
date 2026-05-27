const fs = require('fs');
var s = fs.readFileSync('F:\\temp_script_only.js', 'utf8');
try {
  new Function(s);
  console.log('VALID');
} catch(e) {
  console.log('ERROR:', e.message);
  // Find the error position by checking line by line
  var lines = s.split('\n');
  var acc = '';
  for (var i = 0; i < lines.length; i++) {
    acc += lines[i] + '\n';
    try {
      new Function(acc);
    } catch(e) {
      console.log('Line', (i+1) + ':', e.message.substring(0, 80));
      console.log('  Content:', lines[i].substring(0, 100));
      break;
    }
  }
}
