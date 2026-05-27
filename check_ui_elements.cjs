const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
// Find all buttons and relevant UI elements
var lines = s.split('\n');
for (var i = 0; i < lines.length; i++) {
  if (lines[i].includes('mdBtn') || lines[i].includes('id="md"') || lines[i].includes('zp') || lines[i].includes('zm') || 
      lines[i].includes('zl') || lines[i].includes('zr') || lines[i].includes('ch') || lines[i].includes('mode')) {
    console.log('Line', (i+1) + ':', lines[i].trim().substring(0, 120));
  }
  if (lines[i].includes('zoom-in') || lines[i].includes('zoom-out') || lines[i].includes('mdBtn')) {
    console.log('Line', (i+1) + ':', lines[i].trim().substring(0, 120));
  }
}
console.log('\n--- Looking for mode/zoom buttons ---');
for (var i = 0; i < lines.length; i++) {
  if (lines[i].includes('browse') || lines[i].includes('place') || lines[i].includes('放置') || lines[i].includes('浏览') || lines[i].includes('贡献')) {
    console.log('Line', (i+1) + ':', lines[i].trim().substring(0, 120));
  }
}
