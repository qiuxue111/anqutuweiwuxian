const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 找到 ut() 函数
var idx = c.indexOf('function ut(');
var braceStart = c.indexOf('{', idx);
var depth = 1;
var i = braceStart + 1;
while (depth > 0 && i < c.length) {
  if (c[i] === '{') depth++;
  if (c[i] === '}') depth--;
  i++;
}
// i 现在是 } 后面一个字符
var insertAt = i - 1; // 放在 } 之前
var insert = "if(typeof renderMarkers==='function'){try{renderMarkers();}catch(e){}}";
c = c.substring(0, insertAt) + insert + c.substring(insertAt);

fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Added renderMarkers in ut()');
