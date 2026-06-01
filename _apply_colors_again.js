var fs = require('fs');
var path = require('path');
var pagesDir = 'F:/暗区突围网站/pages';

var replacements = [
  { from: ['#ffc832'], to: 'var(--accent)', exclude: ['--accent:', '--accent-rgb:'] },
  { from: ['rgba(255,200,50,'], to: 'rgba(var(--accent-rgb),', exclude: ['--accent-rgb:'] },
  { from: ['rgba(20,20,30,0.6)'], to: 'var(--card-bg)', exclude: ['--card-bg:'] },
  { from: ['rgba(255,255,255,0.05)'], to: 'var(--card-border)', exclude: ['--card-border:'] },
  { from: ['rgba(255,255,255,0.06)'], to: 'var(--user-border)', exclude: ['--user-border:'] },
  { from: ['rgba(15,15,24,0.92)'], to: 'var(--menu-bg)', exclude: ['--menu-bg:'] },
  { from: ['#4a9eff'], to: 'var(--btn-blue-text)', exclude: ['--btn-blue-text:'] },
  { from: ['#ff6b6b'], to: 'var(--btn-red-text)', exclude: ['--btn-red-text:'] },
  { from: ['#51cf66'], to: 'var(--btn-green-text)', exclude: ['--btn-green-text:'] },
  { from: ['#cc5de8'], to: 'var(--btn-purple-text)', exclude: ['--btn-purple-text:'] }
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
  var c = fs.readFileSync(fp, 'utf-8');

  replacements.forEach(function(r) {
    r.from.forEach(function(f) {
      var lines = c.split('\n');
      lines = lines.map(function(line) {
        // 跳过 CSS 变量定义行
        for (var i = 0; i < r.exclude.length; i++) {
          if (line.indexOf(r.exclude[i]) >= 0) return line;
        }
        // 跳过 JS 中的默认值定义
        var safe = f.substring(f.indexOf('#') >= 0 ? 1 : 0);
        if (line.indexOf('"#' + safe + '"') >= 0 || line.indexOf("'" + safe + "'") >= 0) {
          // 只在对象值中跳过，不在字符串中
          if (line.indexOf(':') >= 0 && line.indexOf("'" + safe + "'") >= 0) return line;
        }
        while (line.indexOf(f) >= 0) {
          line = line.replace(f, r.to);
        }
        return line;
      });
      c = lines.join('\n');
    });
  });

  // body 背景和文字色
  c = c.replace(/body\{background:#08080e;color:#ccc;/g, 'body{background:var(--bg-page);color:var(--text-body);');

  fs.writeFileSync(fp, c, 'utf-8');
  console.log(file + ': colors applied');
});

console.log('Done.');
