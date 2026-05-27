const fs = require('fs');
const root = 'F:\\暗区突围网站';
const pages = ['index','search','pages/maps','pages/weapons','pages/strategy','pages/gear',
  'pages/map-farm','pages/map-beishan','pages/map-valley','pages/map-armory','pages/map-airport','pages/map-tvstation'];
pages.forEach(function(p) {
  var fp = root + '\\' + p.replace(/\//g,'\\') + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  var ok = true;
  scripts.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { ok = false; console.log(p + ': ERROR - ' + e.message.substring(0,60)); }
  });
  if (ok) console.log(p + ': VALID');
});
