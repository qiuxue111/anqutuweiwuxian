const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Actually check for the exact string
const idx = c.indexOf('videos-beishan');
console.log(JSON.stringify(c.substring(idx, idx + 250)));

// Check 🗺?
console.log('\nContains 🗺?:', c.includes('\uD83D\uDDFA?'));
console.log('Contains 🗺 :', c.includes('\uD83D\uDDFA '));
