var fs = require('fs');
var files = ['3x3','gear','help','maps','review','strategy','weapons','map-beishan','map-valley','map-farm','map-airport','map-armory','map-tvstation','map-editor','map-mobile'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  var out = [];
  c.split('\n').forEach(function(l) {
    // 跳过 CSS 变量定义
    if (l.indexOf(':root') >= 0 || l.indexOf('--accent:') >= 0 || l.indexOf('--bg-page:') >= 0 ||
        l.indexOf('--card-bg:') >= 0 || l.indexOf('--text-body:') >= 0 || l.indexOf('--card-border:') >= 0 ||
        l.indexOf('--user-border:') >= 0 || l.indexOf('--menu-bg:') >= 0 || l.indexOf('--btn-') >= 0 ||
        l.indexOf('DEFAULTS') >= 0 || l.indexOf('abi_palette') >= 0 || l.indexOf('applyAll') >= 0) {
      out.push(l); return;
    }
    // 替换所有硬编码颜色
    l = l.replace(/#12121a/gi, 'var(--card-bg)');
    l = l.replace(/#1a1a22/gi, 'var(--card-bg)');
    l = l.replace(/#252530/gi, 'var(--card-bg)');
    l = l.replace(/#1e1e2a/gi, 'var(--card-border)');
    l = l.replace(/#0a0a10/gi, 'var(--bg-page)');
    l = l.replace(/#1a1a28/gi, 'var(--card-bg)');
    l = l.replace(/#2a2a32/gi, 'var(--card-bg)');
    l = l.replace(/#333/gi, 'var(--card-bg)');
    l = l.replace(/#0a0a0f/gi, 'var(--bg-page)');
    l = l.replace(/background:rgba\(20,20,30,0\.7\)/gi, 'background:var(--card-bg)');
    l = l.replace(/background:rgba\(15,15,24,0\.92\)/gi, 'background:var(--menu-bg)');
    l = l.replace(/color:#ccc/gi, 'color:var(--text-body)');
    l = l.replace(/color:#888/gi, 'color:var(--text-body)');
    l = l.replace(/color:#ddd/gi, 'color:var(--text-body)');
    out.push(l);
  });
  c = out.join('\n');
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
