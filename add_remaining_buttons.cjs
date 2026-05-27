const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Add valley button: after "PC 版草丛渲染距离更远，伏地魔更难发现"
// Find the closing </div> of valley section
const valleyBtn = '          <div style="margin-top:1rem;">\n        <a href="map-valley.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;"> 查看交互地图</a>\n      </div>\n    </div>';

let idx = c.indexOf('PC 版草丛渲染距离更远，伏地魔更难发现');
if (idx >= 0) {
  // Find the closing div of valley section
  const closeDiv = c.indexOf('</div>\n    </div>\n\n    <!-- 军械库', idx);
  if (closeDiv >= 0) {
    // Insert valleyBtn before the first </div>
    const firstClose = c.lastIndexOf('</div>', closeDiv - 1);
    c = c.slice(0, firstClose) + valleyBtn + c.slice(firstClose);
    console.log('Added valley button');
  }
}

// Add airport button: after "码头方向经常刷撤离点，提前规划路线"  
idx = c.indexOf('码头方向经常刷撤离点，提前规划路线');
if (idx >= 0) {
  const closeDiv = c.indexOf('</div>\n    </div>\n\n    <!-- 电视台', idx);
  if (closeDiv >= 0) {
    const firstClose = c.lastIndexOf('</div>', closeDiv - 1);
    c = c.slice(0, firstClose) + '\n          <div style="margin-top:1rem;">\n        <a href="map-airport.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;"> 查看交互地图</a>\n      </div>\n    </div>' + c.slice(firstClose);
    console.log('Added airport button');
  }
}

// Add tvstation button: after "转角多容易遭遇，推荐腰射流配置"
idx = c.indexOf('转角多容易遭遇，推荐腰射流配置');
if (idx >= 0) {
  const closeDiv = c.indexOf('</div>\n    </div>\n\n    <div style="margin-top:2rem;', idx);
  if (closeDiv >= 0) {
    const firstClose = c.lastIndexOf('</div>', closeDiv - 1);
    c = c.slice(0, firstClose) + '\n          <div style="margin-top:1rem;">\n        <a href="map-tvstation.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;"> 查看交互地图</a>\n      </div>\n    </div>' + c.slice(firstClose);
    console.log('Added tvstation button');
  }
}

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify
['beishan','valley','armory','airport','tvstation','farm','editor'].forEach(k => {
  const cnt = (c.match(new RegExp('map-' + k + '\\.html', 'g')) || []).length;
  console.log(`  map-${k}.html: ${cnt}`);
});
