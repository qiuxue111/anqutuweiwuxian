const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\index.html', 'utf8');
console.log('userName:', c.indexOf('userName'));
console.log('loginBtn:', c.indexOf('loginBtn'));
console.log('userName element:', c.indexOf('id="userName"'));
console.log('loginBtn element:', c.indexOf('id="loginBtn"'));
