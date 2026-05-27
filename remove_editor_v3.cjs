const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Remove the editor section: the exact text block
const startMarker = '<div style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">';
let start = c.indexOf(startMarker);
if (start >= 0) {
  // Navigate back to the opening <div
  start = c.lastIndexOf('<div', start);
  // Find the closing </div> of this block
  let end = c.indexOf('</div>', start + 100);
  // Verify this is actually the editor section (not the comment section)
  const isEditor = c.substring(start, end + 6).includes('地图编辑器');
  if (isEditor) {
    c = c.slice(0, start) + c.slice(end + 6);
    // Clean up extra blank lines
    c = c.replace(/\n{3,}/g, '\n\n');
    console.log('Removed editor section');
  }
}

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('Has editor:', c.includes('地图编辑器'));
console.log('</strong>:', (c.match(/<\/strong>/g) || []).length);
console.log('Size:', c.length);
