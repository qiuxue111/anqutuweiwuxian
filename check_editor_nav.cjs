const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\map-editor.html', 'utf8');
const navStart = c.indexOf('<nav');
const navEnd = c.indexOf('</nav>') + 6;
console.log(c.substring(navStart, navEnd));
