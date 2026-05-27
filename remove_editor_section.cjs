const fs = require('fs');
const p = 'F:\\暗区突围网站\\pages\\maps.html';
let c = fs.readFileSync(p, 'utf8');

// Fix remaining "?/strong>" - this is likely a damaged </strong> pattern
c = c.replace('?/', '/');

// Remove the editor section
// Remove from '<div style="margin-top:2rem;text-align:center;padding:1.5rem;'
// Until the next section (comment area)
const editorStart = c.indexOf('想要自己标注物资点？');
if (editorStart >= 0) {
  // Find the opening div and closing div
  const openDiv = c.lastIndexOf('<div style="margin-top:2rem;text-align:center;', editorStart);
  const closeDiv = c.indexOf('</div>', editorStart);
  // The next section starts with <!-- 评论区 -->
  const nextSection = c.indexOf('<!-- 评论区', closeDiv);
  
  if (openDiv >= 0 && nextSection >= 0) {
    const start = openDiv;
    const end = nextSection;
    c = c.slice(0, start) + c.slice(end);
    console.log('Removed editor section');
  }
}

// Also check for any remaining broken patterns
const orig = c;
c = c.replace(/style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;">.*?<\/div>\n\s+/s, '');

fs.writeFileSync(p, c);
console.log('Size:', orig.length, '->', c.length);
console.log('FFFD:', (c.match(/\ufffd/g) || []).length);
