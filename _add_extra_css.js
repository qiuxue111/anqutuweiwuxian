var fs = require('fs');

var extraCSS = '\n' +
'/* 调色盘容器颜色覆盖 */\n' +
'.container, .card, .panel, .section, .box, .post-card, .map-card, .video-card,\n' +
'.strategy-card, .weapon-card, .gear-card, .help-card, .review-card {\n' +
'  background: var(--card-bg) !important;\n' +
'}\n' +
'[class*="card"], [class*="panel"], [class*="container"] {\n' +
'  background: var(--card-bg) !important;\n' +
'}\n';

var files = ['3x3','gear','help','map-airport','map-armory','map-beishan','map-editor','map-farm','map-mobile','map-tvstation','map-valley','maps','review','strategy','weapons'];

files.forEach(function(n) {
  var fp = 'F:/暗区突围网站/pages/' + n + '.html';
  var c = fs.readFileSync(fp, 'utf-8');
  
  // 在 </style> 前注入额外样式
  c = c.replace('</style>', extraCSS + '</style>');
  
  fs.writeFileSync(fp, c, 'utf-8');
  console.log(n + ': OK');
});

console.log('\nDone.');
