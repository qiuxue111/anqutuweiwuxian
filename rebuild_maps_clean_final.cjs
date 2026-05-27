const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

console.log('Starting size:', c.length);
console.log('Has editor:', c.includes('地图编辑器'));
console.log('</strong>:', (c.match(/<\/strong>/g) || []).length);

// Step 1: Fix broken ?/tag> patterns (<strong>类?/strong> -> <strong>类</strong>)
c = c.replace(/\?<\//g, '</');
c = c.replace(/\?\/strong>/g, '</strong>');
c = c.replace(/\?\/span>/g, '</span>');
c = c.replace(/\?\/li>/g, '</li>');
c = c.replace(/\?\/div>/g, '</div>');
c = c.replace(/\?\/h3>/g, '</h3>');
c = c.replace(/\?\/a>/g, '</a>');
c = c.replace(/\?\/p>/g, '</p>');
c = c.replace(/\?\/h2>/g, '</h2>');
c = c.replace(/\?\/h1>/g, '</h1>');
c = c.replace(/\?\/title>/g, '</title>');
console.log('\nAfter tag fix:');
console.log('</strong>:', (c.match(/<\/strong>/g) || []).length);

// Step 2: Remove editor section  
const editorStart = '<div style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">';
let es = c.indexOf(editorStart);
if (es >= 0) {
  // Find the matching </div> - count from there
  const edivStart = c.lastIndexOf('<div', es);
  let depth = 0;
  let pos = edivStart;
  for (let i = pos; i < c.length; i++) {
    if (c[i] === '<') {
      if (c.substring(i, i+5) === '<div ') { depth++; }
      else if (c.substring(i, i+6) === '<div>') { depth++; }
      else if (c.substring(i, i+6) === '</div>') {
        depth--;
        if (depth === 0) {
          c = c.substring(0, pos) + c.substring(i + 6);
          console.log('\nRemoved editor section');
          break;
        }
      }
    }
  }
}

// Step 3: Fix stray button text that appears between armory </div> and farm comment
if (c.includes('"display:inline-flex') && !c.includes('<a style="display:inline-flex')) {
  // There might be stray style text outside of <a> tags
  // Find the specific stray: after armory's </div> before farm
  const armEnd = c.indexOf('    </div>\n\n    <!-- 农场 -->');
  if (armEnd >= 0) {
    // Check what comes right before this
    const preFarm = c.substring(armEnd - 300, armEnd);
    console.log('\nBefore farm:', preFarm.substring(preFarm.indexOf('军械')));
  }
}

// Step 4: Add buttons back for valley, airport, tvstation (they may have been lost)
const btn = (href) => `          <div style="margin-top:1rem;">\n        <a href="map-${href}.html" style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>`;

c = c.replace(
  '<li>PC 版草丛渲染距离更远，伏地魔更难发现</li>\n        </ul>\n      </div>\n    </div>',
  `<li>PC 版草丛渲染距离更远，伏地魔更难发现</li>\n        </ul>\n      </div>\n      ${btn('valley')}`
);

c = c.replace(
  '<li>码头方向经常刷撤离点，提前规划路线</li>\n        </ul>\n      </div>\n    </div>',
  `<li>码头方向经常刷撤离点，提前规划路线</li>\n        </ul>\n      </div>\n      ${btn('airport')}`
);

c = c.replace(
  '<li>转角多容易遭遇，推荐腰射流配置</li>\n        </ul>\n      </div>\n    </div>',
  `<li>转角多容易遭遇，推荐腰射流配置</li>\n        </ul>\n      </div>\n      ${btn('tvstation')}`
);

// Step 5: Ensure no stray style text - clean all pure text containing display:inline-flex
c = c.replace(/\n[ \t]*(?!<)style="display:inline-flex[^"]*"[^<]*<\/a>\n[ \t]*<\/div>\n[ \t]*<\/div>\n/g, '\n');

// Step 6: Fix content ? (like ?高价 -> ? stays, they're from original CSV)
// Don't touch these

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

console.log('\n=== Verification ===');
console.log('Size:', c.length);
console.log('Has editor:', c.includes('地图编辑器'));
console.log('</strong>:', (c.match(/<\/strong>/g) || []).length);
const strayCount = c.split('display:inline-flex').length - 1;
console.log('display:inline-flex total:', strayCount);

// Count buttons per map
['beishan','valley','armory','airport','tvstation','farm','editor'].forEach(k => {
  const cnt = (c.match(new RegExp('map-' + k + '\\.html', 'g')) || []).length;
  console.log(`  map-${k}.html: ${cnt}`);
});
