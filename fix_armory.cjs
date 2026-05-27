const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Add armory button - find the armory section closing </div> before <!-- 农场 -->
const btn = `      <div style="margin-top:1rem;">\n        <a href="map-armory.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 农场 -->`;

// Insert before the farm section
c = c.replace('\n    </div>\n\n    <!-- 农场 -->', btn);

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify all links
['farm','beishan','valley','armory','airport','tvstation','editor'].forEach(function(k) {
  var cnt = (c.match(new RegExp('map-' + k + '.html', 'g')) || []).length;
  console.log('  map-' + k + '.html:', cnt);
});
