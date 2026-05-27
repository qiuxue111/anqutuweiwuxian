const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Fix buttons that lost the 🗺 emoji (have just a space before "查看)
c = c.replace(/"font-size:0.9rem;"> 查看交互地图/g, '"font-size:0.9rem;">🗺 查看交互地图');

// Fix indentation: buttons should be at same level as section close
// Current: <ul>...</ul>\n      </div>\n                <div...
// Should:  <ul>...</ul>\n      </div>\n      <div...
c = c.replace(/\n                <div style="margin-top:1rem;">/g, '\n      <div style="margin-top:1rem;">');

// Verify farm button has correct emoji
const farmSection = c.substring(c.lastIndexOf('map-farm.html')-30, c.lastIndexOf('map-farm.html')+60);
console.log('Farm button example:', farmSection);

// Check all 查看交互地图 buttons have 🗺
const allButtons = c.match(/"font-size:0.9rem;">[^<]+<\/a>/g) || [];
allButtons.forEach((b, i) => {
  const hasEmoji = b.includes('🗺');
  console.log(`Button ${i+1}: ${hasEmoji ? 'OK' : 'MISSING EMOJI'} -> "${b}"`);
});

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone');
