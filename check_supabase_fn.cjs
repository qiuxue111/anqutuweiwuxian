const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\weapons.html', 'utf8');
const idx = c.indexOf('function supabase');
const end = c.indexOf('function loginGitHub', idx);
console.log(c.substring(idx, end));
