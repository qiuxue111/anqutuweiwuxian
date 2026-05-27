const fs = require('fs');
var c = fs.readFileSync('F:\\暗区突围网站\\map_core_functions.js', 'utf8');

// 把所有 /scaleM 改为 *scaleM（图标随缩放同比变化）
// 但要小心不要改到其他地方（如 jumpToFromUrl 里的 /scaleM 是用于圆点动画的）
// 只改 renderMarkers 里的

// 方式：找到 renderMarkers 范围
var start = c.indexOf('function renderMarkers()');
var end = c.indexOf('\nfunction ', start + 1);
if (end < 0) end = c.length;

var before = c.substring(0, start);
var markersCode = c.substring(start, end);
var after = c.substring(end);

// 只在这个范围内替换 /scaleM 为 *scaleM
markersCode = markersCode.replace(/\/scaleM/g, '*scaleM');

c = before + markersCode + after;
fs.writeFileSync('F:\\暗区突围网站\\map_core_functions.js', c);
console.log('Changed icon sizing to *scaleM in renderMarkers');
