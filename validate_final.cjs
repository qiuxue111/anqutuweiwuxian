const fs = require('fs');
const pages = ['index','search','pages/maps','pages/weapons','pages/strategy','pages/gear','pages/map-farm','pages/map-beishan','pages/map-valley','pages/map-armory','pages/map-airport','pages/map-tvstation'];

var ok = true;
pages.forEach(function(p) {
  var fp = 'F:\\暗区突围网站\\' + p.replace(/\//g,'\\') + '.html';
  try {
    var c = fs.readFileSync(fp, 'utf8');
    var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
    if (scripts) scripts.forEach(function(s) {
      try { new Function(s.replace('<script>','').replace('<\/script>','')); }
      catch(e) { console.log(p + ': ERROR - ' + e.message.substring(0,60)); ok = false; }
    });
  } catch(e) { console.log(p + ': FILE ERROR'); }
});

if (ok) console.log('All pages VALID');
