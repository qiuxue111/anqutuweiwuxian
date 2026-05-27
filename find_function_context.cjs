const fs = require('fs');
var s = fs.readFileSync('F:\\temp_script_only.js', 'utf8');

// Find the problematic 'function' token
// Look for cases where 'function' appears in a string context
var lines = s.split('\n');
// Find all 'function' occurrences
var re = /function/g;
var match;
var results = [];
while ((match = re.exec(s)) !== null) {
  results.push(match.index);
}

console.log('Found', results.length, 'occurrences of "function"');

// Check if any function is inside a string
for (var i = 0; i < results.length; i++) {
  var idx = results[i];
  var before = s.substring(idx - 50, idx);
  var after = s.substring(idx, idx + 30);
  
  // Check if this is a property assignment like onClick: function()
  var isInLiteral = false;
  var quoteCount = 0;
  var inSingle = false, inDouble = false, inTemplate = false;
  // Simple check: count unescaped quotes before this position
  // This is expensive, so only check near the token
  console.log('function #' + i + ' at', idx, ':', JSON.stringify(before.substring(Math.max(0,before.length-30)) + '|FUNCTION|' + after.substring(0,20)));
}
