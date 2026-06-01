var fs = require('fs');
// 只对地图页面做这个替换（非地图页面已经替换过了）
var files = ['map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];
files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  var out = [];
  c.split('\n').forEach(function(l) {
    // 跳过 CSS 变量定义和 DEFAULTS
    if (l.indexOf(':root') >= 0 || l.indexOf('--accent:') >= 0 || l.indexOf('--bg-page:') >= 0 ||
        l.indexOf('--card-bg:') >= 0 || l.indexOf('--text-body:') >= 0 || l.indexOf('--card-border:') >= 0 || l.indexOf('--user-border:') >= 0 ||
        l.indexOf('DEFAULTS') >= 0 || l.indexOf('abi_palette') >= 0 || l.indexOf('applyAll') >= 0) {
      out.push(l);
      return;
    }
    // 替换所有 #ffc832 → var(--accent)
    l = l.replace(/#ffc832/gi, 'var(--accent)');
    // 替换 rgba(255,200,50, → rgba(var(--accent-rgb),
    l = l.replace(/rgba\(255,200,50,/gi, 'rgba(var(--accent-rgb),');
    out.push(l);
  });
  c = out.join('\n');
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': ' + c.length + ' bytes, has --accent: ' + (c.indexOf('--accent:') >= 0));
});
console.log('Done.');
