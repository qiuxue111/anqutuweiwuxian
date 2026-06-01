var fs = require('fs');

var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');
var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

// 加载器 JS - 应用配色后注入 CSS 覆盖规则
var loaderJS = '(function(){var DEFAULTS={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)","--card-border":"rgba(255,255,255,0.05)","--user-border":"rgba(255,255,255,0.06)","--menu-bg":"rgba(15,15,24,0.92)","--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};function applyAll(t){Object.keys(t).forEach(function(k){document.documentElement.style.setProperty(k,t[k]);});var s=document.createElement("style");s.id="abi-override";s.textContent=".abi-card,.abi-panel,.abi-box,div[class*=\"map-\"],div[class*=\"post-\"],.navbar,main,aside,footer,section,article,.map-detail,.map-section,.extract-item{background:var(--card-bg)!important;}";document.head.appendChild(s);}try{var s=JSON.parse(localStorage.getItem("abi_palette"));if(s&&typeof s==="object"){applyAll(s);}}catch(e){}window.addEventListener("storage",function(e){if(e.key==="abi_palette"){try{var v=JSON.parse(e.newValue);if(v&&typeof v==="object")applyAll(v);}catch(ex){}}});})();';

// 额外 CSS
var extraCSS = '\n/* 调色盘 - 背景覆盖 */\n' +
'.map-header, .map-detail, .map-section, .extract-item,\n' +
'.navbar, .post-card, .video-card, [class*="map-"],\n' +
'main, section, article, aside, footer {\n' +
'  background: var(--card-bg) !important;\n' +
'}\n';

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  c = c.replace('</style>', '\n' + cssVars + extraCSS + '</style>');

  var bodyIdx = c.lastIndexOf('</body>');
  var lastScr = c.lastIndexOf('</script>', bodyIdx);
  if (lastScr > 0) {
    c = c.substring(0, lastScr) + '\n' + loaderJS + '\n' + c.substring(lastScr);
  }

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
