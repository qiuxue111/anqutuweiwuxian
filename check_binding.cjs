const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  // Check if mdBtn has onclick
  var idx = script.indexOf('mdBtn');
  if (idx >= 0) console.log('mdBtn refs:', script.substring(Math.max(0,idx-80), idx+300));
  
  // Check the second inject (core v2)
  var idx2 = script.lastIndexOf('// ===== 地图核心交互 v2 =====');
  if (idx2 >= 0) {
    console.log('\n\n=== Second inject area ===');
    console.log(script.substring(idx2, idx2+1000));
  }
  
  // Count occurrences of toggleMode
  var count = 0, pos = -1;
  while ((pos = script.indexOf('toggleMode', pos+1)) >= 0) count++;
  console.log('\ntoggleMode appears', count, 'times');
  
  // Check if mdBtn onclick is bound in HTML
  var htmlIdx = s.indexOf('mdBtn');
  if (htmlIdx >= 0) console.log('\nHTML mdBtn context:', s.substring(Math.max(0,htmlIdx-100), htmlIdx+80));
}
