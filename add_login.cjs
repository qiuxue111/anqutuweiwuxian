const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 在 supabase 函数后插入 loginGitHub
var loginFn = `
function loginGitHub(){
  var redirect = window.location.origin + window.location.pathname;
  var url = 'https://github.com/login/oauth/authorize?client_id=Ov23liI8CLAtMEYL2fOc&redirect_uri=' + encodeURIComponent(redirect) + '&scope=read:user';
  window.location.href = url;
}

`;

var idx = c.indexOf('function zoom');
// 在 supabase 之后、zoom 之前插入
var supIdx = c.indexOf('function supabase');
var zoomIdx = c.indexOf('function zoom');
c = c.substring(0, zoomIdx) + loginFn + c.substring(zoomIdx);
fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Added loginGitHub fn OK');
