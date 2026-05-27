const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Step 1: Delete the stray block between </h1> and </div> closing of map-header
// Find the exact string
const h1Close = c.indexOf('</h1>');
const headerDivClose = c.indexOf('</div>', h1Close + 10);
const headerEnd = c.indexOf('</div>', headerDivClose + 10); // map-header closing

console.log('h1Close:', h1Close);
console.log('content between h1 and header close:');
const fragment = c.substring(h1Close + 5, headerEnd);
console.log(JSON.stringify(fragment));

// Remove the stray content - replace it with just </div>
const before = c.substring(0, h1Close + 5);
const after = c.substring(headerEnd);
const fixed = before + '\n    ' + after;
fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', fixed);
console.log('\nAfter fix size:', fixed.length);
