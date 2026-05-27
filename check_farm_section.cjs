const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const idx = c.indexOf('id="farm"');
if (idx < 0) console.log('FARM NOT FOUND');
else {
  console.log('Farm section:');
  console.log(c.substring(idx - 100, idx + 600));
}
