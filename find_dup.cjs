const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Find both videoAdminBtn
let idx = c.indexOf('videoAdminBtn');
console.log('1st:', c.substring(Math.max(0, idx-10), idx+120));
idx = c.indexOf('videoAdminBtn', idx + 1);
console.log('2nd:', c.substring(Math.max(0, idx-10), idx+120));
// Find all loginBtn JS references
const jsRefs = [...c.matchAll(/document\.getElementById\('[^']*'\)/g)];
console.log('\ngetElementById refs:', jsRefs.map(m => m[0]).join(', '));
