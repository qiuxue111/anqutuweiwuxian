const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Count occurrences
const loginCount = c.split('<button id="loginBtn"').length - 1;
const adminCount = c.split('<button id="videoAdminBtn"').length - 1;
console.log('loginBtn HTML:', loginCount, 'videoAdminBtn HTML:', adminCount);
console.log('loginBtn in JS:', c.split('document.getElementById').filter(x => x.includes('loginBtn')).length);
console.log('videoAdminBtn in JS:', c.split('document.getElementById').filter(x => x.includes('videoAdminBtn')).length);
