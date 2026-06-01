var fs = require('fs');
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

// 处理所有地图页面 + 非地图页面
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile','3x3','gear','help','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 只替换 CSS 中的颜色（color: 和 background:），跳过变量定义
  c = c.split('\n').map(function(l) {
    if (l.indexOf(':root') >= 0 || l.indexOf('--accent:') >= 0 || 
        l.indexOf('--bg-page:') >= 0 || l.indexOf('--card-bg:') >= 0 ||
        l.indexOf('--text-body:') >= 0 || l.indexOf('--card-border:') >= 0 ||
        l.indexOf('--user-border:') >= 0 || l.indexOf('--menu-bg:') >= 0 ||
        l.indexOf('--btn-') >= 0 || l.indexOf('DEFAULTS') >= 0 ||
        l.indexOf('abi_palette') >= 0 || l.indexOf('applyAll') >= 0) {
      return l;
    }
    // 只在以 color: 或 background: 或 border-color: 开头的地方替换
    // 更安全的做法：只替换 .xxx{ 内的颜色
    // 使用正则：在花括号内的 #ffc832
    if (/\{[^}]*color:#ffc832[^}]*\}/.test(l) || /\{[^}]*background:#ffc832[^}]*\}/.test(l) || /\{[^}]*border-color:#ffc832[^}]*\}/.test(l)) {
      l = l.replace(/#ffc832/gi, 'var(--accent)');
    }
    // 替换 #ccc #ddd #888 文字色
    if (/\{[^}]*color:#ccc[^}]*\}/.test(l)) l = l.replace(/color:#ccc/gi, 'color:var(--text-body)');
    if (/\{[^}]*color:#ddd[^}]*\}/.test(l)) l = l.replace(/color:#ddd/gi, 'color:var(--text-body)');
    if (/\{[^}]*color:#888[^}]*\}/.test(l)) l = l.replace(/color:#888/gi, 'color:var(--text-body)');
    // 替换 #12121a #1a1a22 背景
    if (/\{[^}]*background:#12121a[^}]*\}/.test(l)) l = l.replace(/background:#12121a/gi, 'background:var(--card-bg)');
    if (/\{[^}]*background:#1a1a22[^}]*\}/.test(l)) l = l.replace(/background:#1a1a22/gi, 'background:var(--card-bg)');
    if (/\{[^}]*background:#252530[^}]*\}/.test(l)) l = l.replace(/background:#252530/gi, 'background:var(--card-bg)');
    if (/\{[^}]*background:#0a0a0f[^}]*\}/.test(l)) l = l.replace(/background:#0a0a0f/gi, 'background:var(--bg-page)');
    return l;
  }).join('\n');

  // 注入 CSS 变量
  c = c.replace('</style>', '\n' + cssVars + '\n</style>');

  // 注入加载器
  var script = '<script>\n(function(){\n' +
    'var D={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)",' +
    '"--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};\n' +
    'var p=D;try{var s=JSON.parse(localStorage.getItem("abi_palette"));if(s&&typeof s==="object")p=s;}catch(e){}\n' +
    'var at=p["--accent"],bg=p["--bg-page"],tx=p["--text-body"],cd=p["--card-bg"];\n' +
    'var ar=parseInt(at.slice(1,3),16)+","+parseInt(at.slice(3,5),16)+","+parseInt(at.slice(5,7),16);\n' +
    'document.documentElement.style.setProperty("--bg-page",bg);\n' +
    'document.documentElement.style.setProperty("--text-body",tx);\n' +
    'document.documentElement.style.setProperty("--accent",at);\n' +
    'document.documentElement.style.setProperty("--accent-rgb",ar);\n' +
    'document.documentElement.style.setProperty("--card-bg",cd);\n' +
    'document.documentElement.style.setProperty("--card-border","rgba(255,255,255,0.05)");\n' +
    'document.documentElement.style.setProperty("--user-border","rgba(255,255,255,0.06)");\n' +
    'document.documentElement.style.setProperty("--btn-blue-text",p["--btn-blue-text"]);\n' +
    'document.documentElement.style.setProperty("--btn-red-text",p["--btn-red-text"]);\n' +
    'document.documentElement.style.setProperty("--btn-green-text",p["--btn-green-text"]);\n' +
    'document.documentElement.style.setProperty("--btn-purple-text",p["--btn-purple-text"]);\n' +
    'document.body.style.background=bg;\n' +
    'document.body.style.color=tx;\n' +
    '})();\n</script>\n';

  c = c.replace('</body>', script + '</body>');

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
