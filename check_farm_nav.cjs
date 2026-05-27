const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
// Check navbar structure
const navStart = c.indexOf('<nav');
const navEnd = c.indexOf('</nav>') + 6;
if (navStart >= 0) {
  console.log('farm nav:');
  console.log(c.substring(navStart, navEnd));
} else {
  console.log('farm: no <nav> found');
  // Search for any nav-like structure
  const nIdx = c.indexOf('navbar');
  if (nIdx >= 0) console.log('navbar at', nIdx, ':', c.substring(nIdx, nIdx + 100));
}
