const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 修复 renderMarkers 中的 onerror 引号问题
// 当前: onerror="this.style.display='none'"
// 改成: onerror="this.style.display=\\'none\\'"
// 在 JS 字符串中 \\' 就是转义的单引号

var oldLine = "onerror=\"this.style.display='none'\"";
var newLine = "onerror=\"this.style.display=\\'none\\'\"";

c = c.replace(oldLine, newLine);
if (c.indexOf(oldLine) >= 0) {
  console.log('Still has old pattern');
  // 也许没有 'none' 了，检查具体内容
  var idx = c.indexOf('onerror');
  if (idx >= 0) console.log('onerror at ' + idx + ': ' + c.substring(idx, idx+60));
} else {
  console.log('Fixed onerror quotes');
}

fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
