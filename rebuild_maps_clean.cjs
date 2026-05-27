const fs = require('fs');
const { execSync } = require('child_process');

const repoDir = 'F:\\暗区突围网站';

// Get clean base from 83c97c8
const base = execSync(`git -C "${repoDir}" show 83c97c8:pages/maps.html`);
console.log('Base size:', base.length);

// Check encoding
const s = base.toString('utf8');
console.log('FFFD in base:', (s.match(/\ufffd/g) || []).length);
// No FFFD in base, good

// Now recreate the changes from HEAD but with proper writing
// Instead of diff-patching, we rebuild maps.html from scratch using the base
// and then manually apply the structural changes

// Get the HEAD version to compare what content we need
const head = execSync(`git -C "${repoDir}" show HEAD:pages/maps.html`).toString('utf8');
console.log('HEAD size:', head.length);
console.log('FFFD in HEAD:', (head.match(/\ufffd/g) || []).length);

// Since HEAD version is identical to working tree, and both have 116 FFFD
// it means the corruption is IN the git history starting from 32e69d5
// We need to write a fresh version properly

// Let's write the base version and then add the interactive map buttons
// Base version has:
// - 北山, 山谷, 军械库, 农场, 港口, 电视台 entries (without view map buttons)
// We need to add buttons for all except farm (has one already)

// Strategy: start from base, insert buttons, rename port->airport, keep everything clean
let result = base.toString('utf8');

// Insert beishan button: after "夜战模式记得调低亮度设置</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 山谷"
const beishanBtn = `          <div style="margin-top:1rem;">\n        <a href="map-beishan.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 山谷 (ABI 专属) -->`;

result = result.replace(
  '夜战模式记得调低亮度设置</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 山谷 (ABI 专属) -->',
  `夜战模式记得调低亮度设置</li>\n        </ul>\n      </div>\n      ${beishanBtn}`
);

// Insert valley button: after "PC 版草丛渲染距离更远，伏地魔更难发"
result = result.replace(
  'PC 版草丛渲染距离更远，伏地魔更难发</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 军械库',
  `PC 版草丛渲染距离更远，伏地魔更难发</li>\n        </ul>\n      </div>\n          <div style="margin-top:1rem;">\n        <a href="map-valley.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 军械库`
);

// Insert armory button: after "建议带夜视仪，地下层光线极暗"
result = result.replace(
  '建议带夜视仪，地下层光线极暗</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 农场 -->',
  `建议带夜视仪，地下层光线极暗</li>\n        </ul>\n      </div>\n          <div style="margin-top:1rem;">\n        <a href="map-armory.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 农场 -->`
);

// Insert airport button: after "码头方向经常刷撤离点"
result = result.replace(
  '码头方向经常刷撤离点，提前规划路</li>\n        </ul>\n      </div>\n    </div>\n\n    <!-- 电视台',
  `码头方向经常刷撤离点，提前规划路</li>\n        </ul>\n      </div>\n          <div style="margin-top:1rem;">\n        <a href="map-airport.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <!-- 电视台`
);

// Insert tvstation button: after "转角多容易遭遇，推荐腰射流配"
result = result.replace(
  '转角多容易遭遇，推荐腰射流配</li>\n        </ul>\n      </div>\n    </div>\n\n    <div style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">',
  `转角多容易遭遇，推荐腰射流配</li>\n        </ul>\n      </div>\n          <div style="margin-top:1rem;">\n        <a href="map-tvstation.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>\n\n    <div style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">`
);

// Rename 港口 to 机场
result = result.replace('<!-- 港口 -->', '<!-- 机场 -->');
result = result.replace('<h2>港口 <span class="badge badge-med">中等</span></h2>', '<h2>机场 <span class="badge badge-med">中等</span></h2>');
result = result.replace('id="port"', 'id="airport"');

// Write clean version
fs.writeFileSync(repoDir + '\\pages\\maps.html', result, 'utf8');
console.log('Written:', result.length, 'bytes');

// Verify
console.log('FFFD:', (result.match(/\ufffd/g) || []).length);
console.log('Has 攻略站:', result.includes('攻略站'));
console.log('Has 技术:', result.includes('技术'));
['beishan','valley','armory','airport','tvstation','farm','editor'].forEach(k => {
  var cnt = (result.match(new RegExp('map-' + k + '\\.html', 'g')) || []).length;
  console.log(`  map-${k}.html: ${cnt}`);
});
