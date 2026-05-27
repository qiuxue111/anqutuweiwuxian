const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Find the 🗺? line
const idx = c.indexOf('\uD83D\uDDFA?');
console.log('Line around 🗺?:');
const lineStart = c.lastIndexOf('\n', idx) + 1;
const lineEnd = c.indexOf('\n', idx);
console.log(JSON.stringify(c.substring(lineStart, lineEnd)));
