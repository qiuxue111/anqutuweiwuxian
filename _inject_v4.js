var fs = require('fs');
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

var loaderJS = '(function(){var DEFAULTS={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)","--card-border":"rgba(255,255,255,0.05)","--user-border":"rgba(255,255,255,0.06)","--menu-bg":"rgba(15,15,24,0.92)","--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};function applyAll(t){Object.keys(t).forEach(function(k){document.documentElement.style.setProperty(k,t[k]);});}try{var s=JSON.parse(localStorage.getItem("abi_palette"));if(s&&typeof s==="object"){applyAll(s);}}catch(e){}window.addEventListener("storage",function(e){if(e.key==="abi_palette"){try{var v=JSON.parse(e.newValue);if(v&&typeof v==="object")applyAll(v);}catch(ex){}}});})();';

// 不覆盖了，直接替换全部 #12121a 等颜色为 var(--card-bg)
var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 替换所有硬编码颜色为 CSS 变量
  // 注意：先在 CSS 变量定义中保留这些值（在 :root 里）
  // 然后在 HTML/CSS 里用 var() 替换
  c = c.split('\n').map(function(l) {
    // 跳过 CSS 变量定义行
    if (l.indexOf(':root') >= 0 || l.indexOf('--accent:') >= 0 || l.indexOf('--bg-page:') >= 0 || l.indexOf('--card-bg:') >= 0) return l;
    if (l.indexOf('DEFAULTS') >= 0 || l.indexOf('abi_palette') >= 0) return l;
    // 跳过调色盘 JS
    if (l.indexOf('applyAll') >= 0 || l.indexOf('"abi_palette"') >= 0) return l;
    if (l.indexOf("'abi_palette'") >= 0) return l;
    
    // 替换背景色
    // #12121a → var(--card-bg)
    l = l.replace(/#12121a/gi, 'var(--card-bg)');
    l = l.replace(/#1a1a22/gi, 'var(--card-bg)');
    l = l.replace(/#252530/gi, 'var(--card-bg)');
    l = l.replace(/#1e1e2a/gi, 'var(--card-border)');
    l = l.replace(/#0a0a10/gi, 'var(--bg-page)');
    l = l.replace(/#1a1a28/gi, 'var(--card-bg)');
    l = l.replace(/#3a3a1a/gi, 'var(--card-bg)');
    l = l.replace(/#1a3a1a/gi, 'var(--card-bg)');
    l = l.replace(/#3a1a1a/gi, 'var(--card-bg)');
    l = l.replace(/#2a2a32/gi, 'var(--card-bg)');
    
    // 替换文字色
    l = l.replace(/#6f6/gi, 'var(--btn-green-text)');
    l = l.replace(/#f66/gi, 'var(--btn-red-text)');
    l = l.replace(/#ddd/gi, 'var(--text-body)');
    
    return l;
  }).join('\n');

  c = c.replace('</style>', '\n' + cssVars + '</style>');

  var bodyIdx = c.lastIndexOf('</body>');
  var lastScr = c.lastIndexOf('</script>', bodyIdx);
  if (lastScr > 0) {
    c = c.substring(0, lastScr) + '\n' + loaderJS + '\n' + c.substring(lastScr);
  }

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
