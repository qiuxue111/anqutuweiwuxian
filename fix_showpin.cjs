const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 修复 showPinDetail 中的字符串拼接错误
var oldStr = "document.getElementById('pdTitle').innerHTML=(ic?'<img src=\"'+ic+'\" ' style=\"width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px\"> ':'')+p.name;";
var newStr = "document.getElementById('pdTitle').innerHTML=(ic?'<img src=\"'+ic+'\" style=\"width:28px;height:28px;border-radius:4px;object-fit:cover;vertical-align:middle;margin-right:6px\"> ':'')+p.name;";

c = c.replace(oldStr, newStr);
if (c.indexOf(oldStr) >= 0) {
  console.log('ERROR: replacement failed, text still found');
  process.exit(1);
}

fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Fixed showPinDetail string');
