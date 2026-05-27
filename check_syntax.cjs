const fs = require('fs');
var code = fs.readFileSync('F:\\暗区突围网站\\map_core_v2.js', 'utf8');
// 用正则替换掉所有 emoji 字符（可能会造成问题）
// 直接在浏览器里检查更快
// 我们看看文件是否完整
console.log('File length:', code.length);
console.log('Last 100 chars:', JSON.stringify(code.slice(-100)));

// 检查括号是否匹配
var openParen = (code.match(/\(/g)||[]).length;
var closeParen = (code.match(/\)/g)||[]).length;
var openBrace = (code.match(/\{/g)||[]).length;
var closeBrace = (code.match(/\}/g)||[]).length;
var openBracket = (code.match(/\[/g)||[]).length;
var closeBracket = (code.match(/\]/g)||[]).length;

console.log('(): ' + openParen + ' open, ' + closeParen + ' close, diff=' + (openParen-closeParen));
console.log('{}: ' + openBrace + ' open, ' + closeBrace + ' close, diff=' + (openBrace-closeBrace));
console.log('[]: ' + openBracket + ' open, ' + closeBracket + ' close, diff=' + (openBracket-closeBracket));
