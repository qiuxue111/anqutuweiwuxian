const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

const btn = (href) => `          <div style="margin-top:1rem;">\n        <a href="map-${href}.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;"> 查看交互地图</a>\n      </div>\n    </div>`;

// 1. 山谷: after "更难发现</li>" which is before section close
c = c.replace(
  '<li>PC 版草丛渲染距离更远，伏地魔更难发现</li>\n        </ul>\n      </div>\n    </div>',
  `<li>PC 版草丛渲染距离更远，伏地魔更难发现</li>\n        </ul>\n      </div>\n      ${btn('valley')}`
);

// 2. 军械库: after "建议带夜视仪，地下层光线极暗</li>"
c = c.replace(
  '<li>建议带夜视仪，地下层光线极暗</li>\n        </ul>\n      </div>\n          <div style="margin-top:1rem;">\n        <a href="map-armory.html"',
  `<li>建议带夜视仪，地下层光线极暗</li>\n        </ul>\n      </div>\n      ${btn('armory')}`
);
// armory button already exists, fine

// 3. 机场: after "码头方向经常刷撤离点，提前规划路线</li>"
c = c.replace(
  '<li>码头方向经常刷撤离点，提前规划路线</li>\n        </ul>\n      </div>\n    </div>',
  `<li>码头方向经常刷撤离点，提前规划路线</li>\n        </ul>\n      </div>\n      ${btn('airport')}`
);

// 4. 电视台: after "推荐腰射流配置</li>"
c = c.replace(
  '<li>转角多容易遭遇，推荐腰射流配置</li>\n        </ul>\n      </div>\n    </div>',
  `<li>转角多容易遭遇，推荐腰射流配置</li>\n        </ul>\n      </div>\n      ${btn('tvstation')}`
);

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify
['beishan','valley','armory','airport','tvstation','farm','editor'].forEach(k => {
  const cnt = (c.match(new RegExp('map-' + k + '\\.html', 'g')) || []).length;
  console.log(`  map-${k}.html: ${cnt}`);
});
