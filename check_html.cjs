const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');

// Show the userArea HTML
const idx = c.indexOf('id="userArea"');
if (idx >= 0) {
  console.log('=== userArea HTML ===');
  console.log(c.substring(idx, idx + 300));
} else {
  console.log('NO userArea element found!');
  // search for the userArea style
  const idx2 = c.indexOf('userArea');
  console.log('userArea ref at:', idx2);
  console.log(c.substring(Math.max(0, idx2-50), idx2 + 50));
}

// Show what's between <body> and <script>
const bodyEnd = c.indexOf('>', c.indexOf('<body')) + 1;
const scriptStart = c.indexOf('<script>');
console.log('\n=== HTML between body and script ===');
console.log(c.substring(bodyEnd, scriptStart));
