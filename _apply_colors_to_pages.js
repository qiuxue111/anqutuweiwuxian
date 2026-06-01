var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

// 从 index.html 读取调色盘的 CSS 变量名列表
var idx = fs.readFileSync('F:/暗区突围网站/index.html', 'utf-8');

// 颜色替换映射（从硬编码到 CSS 变量）
var replacements = [
  { from: ['#ffc832'], to: 'var(--accent)', excludeVars: ['--accent:', '--accent-rgb:'] },
  { from: ['rgba(255,200,50,'], to: 'rgba(var(--accent-rgb),', excludeVars: ['--accent-rgb:'] },
  { from: ['rgba(20,20,30,0.6)'], to: 'var(--card-bg)', excludeVars: ['--card-bg:'] },
  { from: ['rgba(255,255,255,0.05)'], to: 'var(--card-border)', excludeVars: ['--card-border:'] },
  { from: ['rgba(255,255,255,0.06)'], to: 'var(--user-border)', excludeVars: ['--user-border:'] },
  { from: ['rgba(15,15,24,0.92)'], to: 'var(--menu-bg)', excludeVars: ['--menu-bg:'] },
  { from: ['#4a9eff'], to: 'var(--btn-blue-text)', excludeVars: ['--btn-blue-text:'] },
  { from: ['#ff6b6b'], to: 'var(--btn-red-text)', excludeVars: ['--btn-red-text:'] },
  { from: ['#51cf66'], to: 'var(--btn-green-text)', excludeVars: ['--btn-green-text:'] },
  { from: ['#cc5de8'], to: 'var(--btn-purple-text)', excludeVars: ['--btn-purple-text:'] }
];

var targetFiles = [
  '3x3.html', 'gear.html', 'help.html',
  'map-airport.html', 'map-armory.html', 'map-beishan.html',
  'map-editor.html', 'map-farm.html', 'map-mobile.html',
  'map-tvstation.html', 'map-valley.html',
  'maps.html', 'review.html', 'strategy.html', 'weapons.html'
];

targetFiles.forEach(function(file) {
  var fp = path.join(pagesDir, file);
  if (!fs.existsSync(fp)) { console.log(file + ': not found'); return; }
  var c = fs.readFileSync(fp, 'utf-8');

  replacements.forEach(function(r) {
    r.from.forEach(function(f) {
      var lines = c.split('\n');
      lines = lines.map(function(line) {
        // 跳过 CSS 变量定义行
        for (var i = 0; i < r.excludeVars.length; i++) {
          if (line.indexOf(r.excludeVars[i]) >= 0) return line;
        }
        // 跳过调色盘 JS 里的默认值（v:'#ffc832' 之类）
        if (line.indexOf("v:'" + f.substring(1) + "'") >= 0) return line;
        if (line.indexOf('v:"' + f.substring(1) + '"') >= 0) return line;
        // 替换
        while (line.indexOf(f) >= 0) {
          line = line.replace(f, r.to);
        }
        return line;
      });
      c = lines.join('\n');
    });
  });

  // 替换 body 背景和文字色
  c = c.replace(/body\{background:#08080e;color:#ccc;/g, 'body{background:var(--bg-page);color:var(--text-body);');

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': colors applied (' + c.length + ' bytes)');
});

console.log('\nDone.');
