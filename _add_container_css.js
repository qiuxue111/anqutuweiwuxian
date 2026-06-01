var fs = require('fs');
var extraCSS = '\n/* 调色盘容器颜色 */\n' +
'.card, .panel, .container, .section, .box,\n' +
'.post-card, .map-card, .video-card, .strategy-card,\n' +
'.weapon-card, .gear-card, .help-card, .review-card {\n' +
'  background: var(--card-bg) !important;\n' +
'}\n';

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  c = c.replace('</style>', extraCSS + '</style>');
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});
