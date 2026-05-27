const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Remove all h3 section headers in map-detail sections
// Pattern: <h3>📍 重点区域</h3>
// Pattern: <h3>🚁 撤离点</h3>  
// Pattern: <h3>💡 PC 端攻略要点</h3>
// Pattern: <h3>💡 攻略要点</h3>

const headers = [
  '<h3>📍 重点区域</h3>\n',
  '<h3>🚁 撤离点</h3>\n',
  '<h3>💡 PC 端攻略要点</h3>\n',
  '<h3>💡 攻略要点</h3>\n',
];

headers.forEach(h => {
  const count = (c.match(new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
  if (count > 0) {
    c = c.replace(new RegExp(h.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '');
    console.log(`Removed "${h.slice(0, 10)}..." x${count}`);
  }
});

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Done');
