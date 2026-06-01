var fs = require('fs');
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 提取 CSS 变量
var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

var loaderJS = '(function(){var DEFAULTS={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)","--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};function applyAll(t){Object.keys(t).forEach(function(k){document.documentElement.style.setProperty(k,t[k]);});}try{var s=JSON.parse(localStorage.getItem("abi_palette"));if(s&&typeof s==="object"){applyAll(s);}}catch(e){}window.addEventListener("storage",function(e){if(e.key==="abi_palette"){try{var v=JSON.parse(e.newValue);if(v&&typeof v==="object")applyAll(v);}catch(ex){}}});})();';

// 额外 CSS：容器背景用 card-bg
var extraCSS = '\n/* 调色盘 - 容器背景 */\n.card, .panel, .container, .box, [class*="card"], [class*="panel"] {\n  background: var(--card-bg) !important;\n}\n';

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 1. 注入 CSS 变量 + 额外 CSS 到 </style> 前
  c = c.replace('</style>', '\n' + cssVars + extraCSS + '</style>');

  // 2. 替换 body 样式
  c = c.replace('body{background:#0a0a0f;color:#ddd;', 'body{background:var(--bg-page);color:var(--text-body);');

  // 3. 注入加载器 JS 到最后一个 </script> 前（必须是 <script> 标签内）
  var bodyIdx = c.lastIndexOf('</body>');
  var lastScr = c.lastIndexOf('</script>', bodyIdx);
  if (lastScr > 0) {
    c = c.substring(0, lastScr) + '\n' + loaderJS + '\n' + c.substring(lastScr);
  }

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK (' + c.length + ')');
});
