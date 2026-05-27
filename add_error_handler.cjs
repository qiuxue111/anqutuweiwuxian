const fs = require('fs');
var code = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');
// 在最前面加全局错误捕获
var header = "window.onerror=function(m,s,l,c,err){var t='JS error: '+m+' line '+l+' col '+c;console.error(t);alert(t);return true;};\n\n";
code = header + code;
fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', code);
console.log('Added error handler OK');
