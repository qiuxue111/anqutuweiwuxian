const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Problem 1: farm has a duplicate stray button (style as text)
// Find the bad section: the inline-style button that appears as raw text
// It's between the armory closing div and farm section
const badBtn = 'style="display:inline-flex;align-items:center;gap:0.3rem;padding:0.5rem 1.2rem;background:#ffc832;color:#0a0a0f;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.9rem;">🗺 查看交互地图';
if (c.includes(badBtn)) {
  // This appears as raw text after armory's closing </a> - find and remove
  // It's the HTML-embedded style, not a live tag
  c = c.replace('          ' + badBtn + '\n', '');
  console.log('Removed stray button text');
}

// Problem 2: Remaining ? in content (from original source damage)
// These ? are the original characters that replaced < in older damage
// We need to only fix known-bad patterns, not all ?
// Actually these ? in content like "?高价" "?观景台" etc are from the original CSV/word source
// They're not HTML-breaking, just cosmetic

// But the farm's "🗺?查看交互地图" has a stray ? too
c = c.replace('🗺?查看交互地图', '🗺 查看交互地图');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Done');

// Check for the stray text issue
const stray = 'style="display:inline-flex';
const strayCount = (c.match(new RegExp(stray.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
console.log('Stray style attributes as text:', strayCount - 7); // 7 are inside actual <a> tags
