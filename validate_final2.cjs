const fs = require('fs');
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(name) {
  var fp = 'F:\\暗区突围网站\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var m = c.match(/<script>([\s\S]*?)<\/script>/);
  if (!m) { console.log(name + ': no script match'); return; }
  try {
    new Function(m[1]);
    console.log(name + ': VALID');
  } catch(e) {
    console.log(name + ': ERROR - ' + e.message.substring(0, 80));
  }
});
