const fs = require('fs');
var code = fs.readFileSync('F:\\暗区突围网站\\map_core_v2.js', 'utf8');
// 可能是 new Function 下某些全局变量的问题
// 但更可能是 eval 下的某些字符串字面量包含特殊字符
// 检查是否有 0x0c (form feed) 或回车等特殊字符
for(var i=0;i<code.length;i++) {
  var c = code.charCodeAt(i);
  if(c < 32 && c !== 10 && c !== 13 && c !== 9) {
    console.log('Special char at pos ' + i + ': 0x' + c.toString(16) + ' context: ' + JSON.stringify(code.substring(Math.max(0,i-20), i+20)));
  }
}
console.log('No special chars found');
// 检查所有字符串字面量
var inStr = false, inSingle = false;
var quotes = [];
for(var i=0;i<code.length;i++) {
  var ch = code[i];
  if(inStr) {
    if(ch === '\\') { i++; continue; }
    if((inSingle && ch === "'") || (!inSingle && ch === '"')) inStr = false;
  } else {
    if(ch === "'") { inStr = true; inSingle = true; quotes.push({pos:i,type:'single',line:code.substring(0,i).split('\n').length}); }
    if(ch === '"') { inStr = true; inSingle = false; quotes.push({pos:i,type:'double',line:code.substring(0,i).split('\n').length}); }
  }
}
// 检查字符串是否配对
console.log('Single quotes: ' + quotes.filter(q=>q.type==='single').length);
console.log('Double quotes: ' + quotes.filter(q=>q.type==='double').length);
