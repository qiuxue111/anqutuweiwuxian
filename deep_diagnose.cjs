const fs = require('fs');
var s = fs.readFileSync('F:\\temp_script_only.js', 'utf8');

// Check for unusual characters that could break parsing
var issues = [];
for (var i = 0; i < s.length; i++) {
  var c = s.charCodeAt(i);
  // Backtick is fine, look for control chars other than \n\r\t
  if (c < 32 && c !== 10 && c !== 13) {
    issues.push({pos: i, code: c, context: s.substring(Math.max(0,i-10), i+10)});
  }
  // Check for unescaped backslash at end of line (line continuation)
}
if (issues.length > 0) {
  console.log('Found unusual characters:');
  issues.forEach(function(iss) {
    console.log('  pos', iss.pos, 'code', iss.code, JSON.stringify(iss.context));
  });
} else {
  console.log('No unusual control characters found');
}

// Try to compile the script with vm
var vm = require('vm');
try {
  vm.compileFunction(s);
  console.log('SCRIPT IS VALID');
} catch(e) {
  console.log('Error:', e.message);
}
