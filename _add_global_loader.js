var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

// 从 index.html 提取 CSS 变量和调色盘核心逻辑
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');
var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

// 提取 DEFAULTS 对象和 COLORS 数组（用于 LABELS）
var palJS = idx.substring(idx.lastIndexOf('(function(){'), idx.indexOf('})();', idx.lastIndexOf('(function(){')) + 5);

// 提取 DEFAULTS 和关键函数
var defaultsMatch = palJS.match(/var DEFAULTS=\{[\s\S]*?\};/);
var defaultsStr = defaultsMatch ? defaultsMatch[0] : '';

// 轻量加载器 JS（不含 UI，只读取 localStorage 并应用）
var loaderJS = '(function(){\n' +
'var DEFAULTS=' + defaultsStr.replace('var DEFAULTS=', '') + '\n' +
'function getVal(k){try{var p=JSON.parse(localStorage.getItem("abi_palette"));if(p&&p[k]!==undefined)return p[k];}catch(e){}return DEFAULTS[k];}\n' +
'function applyAll(t){Object.keys(t).forEach(function(k){document.documentElement.style.setProperty(k,t[k]);});}\n' +
'// 应用已保存的配色\n' +
'try{var saved=JSON.parse(localStorage.getItem("abi_palette"));if(saved&&typeof saved==="object"){applyAll(saved);}}catch(e){}\n' +
'// 监听 localStorage 变化（其他标签页修改时自动同步）\n' +
'window.addEventListener("storage",function(e){if(e.key==="abi_palette"){try{var v=JSON.parse(e.newValue);if(v&&typeof v==="object")applyAll(v);}catch(ex){}}});\n' +
'})();';

var targetFiles = [
  '3x3.html', 'gear.html', 'help.html',
  'map-airport.html', 'map-armory.html', 'map-beishan.html',
  'map-editor.html', 'map-farm.html', 'map-mobile.html',
  'map-tvstation.html', 'map-valley.html',
  'maps.html', 'review.html', 'strategy.html', 'weapons.html'
];

targetFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  var c = fs.readFileSync(fp, 'utf-8');

  // 注入 CSS 变量（如没有）
  if (c.indexOf(':root{') < 0) {
    c = c.replace('</style>', '\n' + cssVars + '\n</style>');
  }

  // 注入轻量加载器 JS
  var lastScr = c.lastIndexOf('</script>');
  if (lastScr > 0) {
    c = c.substring(0, lastScr) + '\n' + loaderJS + '\n' + c.substring(lastScr);
  }

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': OK (' + c.length + ')');
});

console.log('\nDone.');
