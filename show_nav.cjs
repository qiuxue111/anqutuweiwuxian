const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Find all occurrences of loginBtn and videoAdminBtn in non-JS sections
// Strategy: find the navbar <nav> section, then look for duplicates
const navStart = c.lastIndexOf('<nav>');
const navEnd = c.indexOf('</nav>') + 6;
console.log('Nav:', navStart, '-', navEnd);

const navContent = c.substring(navStart, navEnd);
console.log('Nav content:');
console.log(navContent);
