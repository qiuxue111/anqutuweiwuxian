const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find and remove the editor section precisely
// Pattern: the entire <div style="margin-top:2rem;text-align:center;padding:1.5rem;..." block
const editorDiv = c.indexOf('style="margin-top:2rem;text-align:center;padding:1.5rem;background:#12121a;border:1px solid #1e1e2a;border-radius:12px;"');
if (editorDiv >= 0) {
  // Find the opening div
  const start = c.lastIndexOf('<div', editorDiv);
  // Find the matching closing </div> for this section
  const endDiv = c.indexOf('</div>', editorDiv + 100);
  
  if (start >= 0 && endDiv >= 0) {
    // The content to remove includes the <div ...>...</div> and the newline before next section
    const removed = c.substring(start, endDiv + 6);
    console.log('Removing:', removed.substring(0, 100) + '...');
    
    c = c.slice(0, start) + c.slice(endDiv + 6);
    
    // Remove any extra blank lines
    c = c.replace(/\n\n\n+/g, '\n\n');
    
    fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
    console.log('Done. Size:', c.length);
    console.log('Has 编辑器:', c.includes('地图编辑器'));
    console.log('FFFD:', (c.match(/\ufffd/g) || []).length);
    console.log('</strong> count:', (c.match(/<\/strong>/g) || []).length);
  }
}
