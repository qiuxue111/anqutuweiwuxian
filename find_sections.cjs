const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find all sections with their exact boundaries
['峡谷', '军械', '机场', '电视台'].forEach(q => {
  const idx = c.indexOf(q);
  if (idx >= 0) {
    const pre = c.lastIndexOf('<!--', idx);
    const post = c.indexOf('-->', idx);
    const sectionEnd = c.indexOf('    </div>', idx);
    console.log(`\n--- ${q} ---`);
    console.log(`Comment: ${c.substring(pre, post+3)}`);
    console.log(`Section end: ${c.substring(sectionEnd - 40, sectionEnd + 40)}`);
  }
});

console.log('\n--- 山谷 patterns ---');
['山谷', 'valley', '更难发现'].forEach(q => {
  const idx = c.indexOf(q);
  if (idx >= 0) {
    console.log(`"${q}" at ${idx}: ${c.substring(Math.max(0,idx-20), idx+30)}`);
  }
});
