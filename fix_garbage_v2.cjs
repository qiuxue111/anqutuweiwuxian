const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Remove the stray button text (not inside a tag)
// Pattern: after armory's proper closing </div>, there's stale text
const stray = '    </div> style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图</a>\n      </div>\n    </div>';

if (c.includes(stray)) {
  c = c.replace(stray, '');
  console.log('Removed stray text');
}

// Also check for any extra </div></div> between armory and farm
// Count div depth between armory </div> and farm section start
const armoryClose = '    </div>\n\n    <!-- 农场';
// There might be duplicate. Check what comes after armory
const armoryIdx = c.lastIndexOf('id="armory"');
const afterArmory = c.substring(armoryIdx, armoryIdx + 1500);
console.log('After armory:');
console.log(afterArmory.substring(300, 500));

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);

// Verify: display:inline-flex count
const count = c.split('display:inline-flex').length - 1;
console.log('\ndisplay:inline-flex count:', count);

// All should be inside <a> tags now
