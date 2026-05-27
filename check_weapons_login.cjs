const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\weapons.html', 'utf8');
const idx = c.indexOf('function loginGitHub');
const end = c.indexOf('document.addEventListener', idx);
console.log(c.substring(idx, end));
