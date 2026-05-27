const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
// Check mv container's CSS position
var idx = s.indexOf('#mv');
if (idx >= 0) console.log('mv CSS:', s.substring(Math.max(0,idx-100), idx+200));
// Check map-wrap CSS
idx = s.indexOf('.map-wrap');
if (idx >= 0) console.log('map-wrap CSS:', s.substring(idx, idx+300));
