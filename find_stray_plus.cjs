const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Find all add-video-btn occurrences in HTML (not JS code)
let idx = 0, i = 0;
while ((idx = c.indexOf('add-video-btn', idx)) >= 0) {
  const context = c.substring(Math.max(0, idx - 80), idx + 60);
  // Only count if it's inside HTML, not in JS string
  const before = c.substring(0, idx);
  const inScript = before.lastIndexOf('<script') > before.lastIndexOf('</script>');
  if (!inScript) {
    console.log(`HTML occurrence #${++i} at ${idx}:`);
    console.log(context);
    console.log('---');
  }
  idx++;
}
console.log(`\nTotal HTML add-video-btn: ${i}`);
