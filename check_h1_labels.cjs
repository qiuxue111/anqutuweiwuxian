const fs = require('fs');
['farm','beishan','valley','armory','airport','tvstation'].forEach(e => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${e}.html`, 'utf-8');
  const idx = c.indexOf('<h1');
  const end = c.indexOf('</h1>', idx);
  console.log(`${e}: ${c.substring(idx, end+5)}`);
  
  // 也看 floorLabels
  const flIdx = c.indexOf('var floorLabels');
  const end2 = c.indexOf('];', flIdx);
  console.log(`  floorLabels: ${c.substring(flIdx, end2+2)}`);
});
