const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
const idx = c.indexOf('id="farm"');
if (idx < 0) { console.log('NOT FOUND'); process.exit(1); }

// Count div depth
let depth = 0;
let pos = idx;
while (pos < c.length && depth >= 0) {
  const openDiv = c.indexOf('<div', pos);
  const closeDiv = c.indexOf('</div>', pos);
  if (openDiv < 0 && closeDiv < 0) break;
  if (closeDiv < 0 || (openDiv >= 0 && openDiv < closeDiv)) {
    depth++;
    pos = c.indexOf('>', openDiv) + 1;
  } else {
    depth--;
    if (depth < 0) {
      console.log(`UNEXPECTED close at pos=${closeDiv}: "${c.substring(closeDiv-20, closeDiv+30)}"`);
      // Show what's after this
      console.log('After:', c.substring(closeDiv+6, closeDiv+6+400));
    }
    pos = closeDiv + 6;
  }
}
console.log('Final depth:', depth);

// Also show the comment section after farm
const commentSection = c.indexOf('<!-- 评论区', idx + 100);
console.log('Comment section starts at:', commentSection);
console.log('Gap between farm end and comment:', c.substring(idx + 500, Math.min(idx + 900, commentSection + 100)));
