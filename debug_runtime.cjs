const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  // Check how many <script> blocks actually exist
  var scripts = s.match(/<script>/g);
  console.log('script open tags:', scripts ? scripts.length : 0);
  var closes = s.match(/<\/script>/g);
  console.log('script close tags:', closes ? closes.length : 0);
  
  // Find every function definition and their duplicates
  var funcs = {};
  script.match(/function \w+/g).forEach(function(f) {
    funcs[f] = (funcs[f] || 0) + 1;
  });
  console.log('\nDuplicate functions:');
  Object.keys(funcs).filter(function(f) { return funcs[f] > 1; }).forEach(function(f) {
    console.log('  ' + f + ': ' + funcs[f] + ' times');
  });
  
  // Check the last definition of key functions
  ['toggleMode', 'renderMarkers', 'showPicker', 'placePin', 'jumpToFromUrl', 'zoom'].forEach(function(fn) {
    var idx = script.lastIndexOf('function ' + fn);
    if (idx >= 0) {
      console.log('\n' + fn + ' (last def at ' + idx + '):');
      console.log(script.substring(idx, idx+300));
    }
  });
  
  // Check the first renderMarkers (the one in the old auth code that uses scale not scaleM)
  var firstRM = script.indexOf('function renderMarkers');
  var lastRM = script.lastIndexOf('function renderMarkers');
  if (firstRM !== lastRM) {
    console.log('\n=== FIRST renderMarkers (uses old var names) ===');
    console.log(script.substring(firstRM, firstRM+400));
    console.log('\n=== LAST renderMarkers (uses new var names) ===');
    console.log(script.substring(lastRM, lastRM+400));
  }
}
console.log('\n------ HTML structure check ------');
// Check if there are other <script> blocks outside
var idx = 0, count = 0;
while (true) {
  var next = s.indexOf('<script', idx);
  if (next < 0) break;
  var closeTag = s.indexOf('>', next);
  var tagContent = s.substring(next, closeTag + 1);
  console.log('Script tag', (++count) + ':', tagContent);
  var endTag = s.indexOf('</script>', closeTag);
  if (endTag < 0) break;
  idx = endTag + 9;
}
