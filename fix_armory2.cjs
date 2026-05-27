const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// armory button: find armory section end
const btn = `      <div style="margin-top:1rem;">\n        <a href="map-armory.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>`;

// Find armory section: after "建议带夜视仪" and before "农场"
const patternStart = c.indexOf('建议带夜视仪，地下层光线极暗');
if (patternStart >= 0) {
  // Find the closing </div> after this pattern
  const closeDiv = c.indexOf('</div>', patternStart);
  // This is the section close. Insert button before this </div>
  c = c.slice(0, closeDiv) + btn + c.slice(closeDiv + 6);
  console.log('Added armory button');
}

// Also check: does beishan have button properly?
var bCnt = (c.match(/map-beishan\.html/g) || []).length;
console.log('beishan links:', bCnt);

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Final verification
['farm','beishan','valley','armory','airport','tvstation','editor'].forEach(k => {
  var cnt = (c.match(new RegExp('map-' + k + '\\.html', 'g')) || []).length;
  console.log('  map-' + k + '.html:', cnt);
});
