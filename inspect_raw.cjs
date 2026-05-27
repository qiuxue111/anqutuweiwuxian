const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Show the EXACT raw bytes from the stray beishan area to understand the problem
const h1Idx = c.indexOf('</h1>\n');
console.log('After </h1>:');
console.log(JSON.stringify(c.substring(h1Idx, h1Idx + 300)));

// Also check what's right before the first map-detail in base HTML
const allDetailsBefore = c.indexOf('videos-beishan');
if (allDetailsBefore >= 0) {
  console.log('\nFirst occurrence of videos-beishan:');
  console.log(c.substring(Math.max(0, allDetailsBefore - 100), allDetailsBefore + 200));
}
