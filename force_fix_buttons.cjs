const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Fix all buttons that say just " 查看交互地图" (without emoji)
// Pattern: 0.9rem;"> 查看交互地图</a>
c = c.replace(/"font-size:0\.9rem;"> 查看交互地图<\/a>/g, '"font-size:0.9rem;">🗺 查看交互地图</a>');

// Fix any remaining with ?🗺 (emoji + question mark)
c = c.replace(/"font-size:0\.9rem;">🗺\?/g, '"font-size:0.9rem;">🗺 ');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify
const buttons = c.match(/"font-size:0\.9rem;">[^<]+<\/a>/g);
if (buttons) {
  buttons.forEach((b, i) => {
    const hasEmoji = b.includes('🗺');
    console.log(`Button ${i+1}: ${hasEmoji ? '✅' : '❌'} ${b}`);
  });
}
