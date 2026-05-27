const fs = require('fs');
const m = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const names = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];

// 先在 HTML 里每个 map 的 controls 区域加一个 sb 按钮
m.forEach(function(f, i) {
  var c = fs.readFileSync('F:\\暗区突围网站\\pages\\'+f+'.html', 'utf8');
  
  // 在 mdBtn 后面加一个 sb 按钮
  var btnHtml = '\n    <button id="sb" class="sel-btn">\u5c42\u7ea7</button>';
  
  // 在 mdBtn 或 ab 附近找插入点
  var idx = c.indexOf('id="mdBtn"');
  if (idx < 0) idx = c.indexOf('id="ab"');
  
  if (idx >= 0) {
    // 找到这个按钮所在行的末尾
    var lineEnd = c.indexOf('\n', idx);
    if (lineEnd > idx) {
      c = c.substring(0, lineEnd + 1) + btnHtml + '\n' + c.substring(lineEnd + 1);
    }
  }
  
  fs.writeFileSync('F:\\暗区突围网站\\pages\\'+f+'.html', c);
  console.log(f+': added sb button');
});

// 再重新 run rebuild_clean.cjs 注入脚本
