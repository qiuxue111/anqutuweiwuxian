const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');
// Show the hero section and feature cards
const heroStart = c.indexOf('hero-features');
if (heroStart >= 0) {
  const heroSection = c.substring(heroStart, c.indexOf('</div>', c.indexOf('hero-features')) + 30);
  console.log(heroSection);
}
// Also show hero title
const h1Idx = c.indexOf('<h1');
console.log('\nH1:', c.substring(h1Idx, c.indexOf('</h1>', h1Idx) + 5));
