var fs = require('fs');
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

var st = idx.indexOf('<style>');
var sc = idx.substring(st + 7, idx.indexOf('</style>'));
var rd = sc.indexOf(':root{');
var re = sc.indexOf('}', rd);
var cssVars = sc.substring(rd, re + 1);

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');

  // 1. 替换硬编码颜色
  c = c.split('\n').map(function(l) {
    if (l.indexOf(':root') >= 0 || l.indexOf('--accent:') >= 0 || 
        l.indexOf('--bg-page:') >= 0 || l.indexOf('--card-bg:') >= 0 ||
        l.indexOf('--text-body:') >= 0) return l;
    if (l.indexOf('DEFAULTS') >= 0 || l.indexOf('abi_palette') >= 0) return l;
    if (l.indexOf('applyAll') >= 0 || l.indexOf('--btn-') >= 0) return l;
    
    l = l.replace(/#12121a/gi, 'var(--card-bg)');
    l = l.replace(/#1a1a22/gi, 'var(--card-bg)');
    l = l.replace(/#252530/gi, 'var(--card-bg)');
    l = l.replace(/#1e1e2a/gi, 'var(--card-border)');
    l = l.replace(/#0a0a10/gi, 'var(--bg-page)');
    l = l.replace(/#1a1a28/gi, 'var(--card-bg)');
    l = l.replace(/#12121a/gi, 'var(--card-bg)');
    l = l.replace(/#1a1a22/gi, 'var(--card-bg)');
    // 地图特有的
    l = l.replace(/background:#0a0a0f/gi, 'background:var(--bg-page)');
    l = l.replace(/background: #0a0a0f/gi, 'background:var(--bg-page)');
    l = l.replace(/#333/gi, 'var(--card-bg)');
    
    return l;
  }).join('\n');
  c = c.replace(/#12121a/gi, 'var(--card-bg)'); // 二重保险

  // 2. 注入 CSS 变量
  c = c.replace('</style>', '\n' + cssVars + '\n</style>');

  // 3. 注入加载器（独立 script）
  var script = '<script>\n(function(){\n' +
    'var D={"--accent":"#ffc832","--bg-page":"#08080e","--text-body":"#ccc","--card-bg":"rgba(20,20,30,0.6)","--btn-blue-text":"#4a9eff","--btn-red-text":"#ff6b6b","--btn-green-text":"#51cf66","--btn-purple-text":"#cc5de8"};\n' +
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
