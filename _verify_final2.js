var fs = require('fs');
var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];
files.forEach(function(n) {
  var c = fs.readFileSync('F:/暗区突围网站/pages/' + n + '.html', 'utf-8');
  var b = (c.match(/\x7b/g) || []).length;
  var d = (c.match(/\x7d/g) || []).length;
  var ok = true;
  ok = ok && c.indexOf('var(--accent)') >= 0;
  ok = ok && c.indexOf('var(--bg-page)') >= 0;
  ok = ok && c.indexOf('var(--text-body)') >= 0;
  ok = ok && c.indexOf('var(--card-bg)') >= 0;
  ok = ok && c.indexOf('abi_palette') >= 0;
  ok = ok && c.indexOf('applyAll') >= 0;
  ok = ok && c.indexOf('#ffc832') < 0; // 不应该有硬编码主色
  ok = ok && c.indexOf('<!DOCTYPE') >= 0;
  console.log(n + ': ' + (b === d ? 'OK' : 'FAIL') + ' vars=' + ok);
});
