const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const lines = c.split('\n');
// Line 84
console.log('Line 84:', lines[83].substring(0, 200));
// Line 217 area
console.log('Line 217:', lines[216].substring(0, 200));
console.log('Line 216:', lines[215].substring(0, 200));
console.log('Line 218:', lines[217].substring(0, 200));

// Search for loginGitHub in the page - check what onclick points to
const btnIdx = c.indexOf('loginBtn');
console.log('\nloginBtn area:', c.substring(btnIdx, btnIdx + 150));
