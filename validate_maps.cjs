const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];

maps.forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  var ok = true;
  scripts.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { ok = false; console.log(name + ': SCRIPT ERROR - ' + e.message.substring(0,60)); }
  });
  console.log(name + ': has zoom=' + c.includes('function zoom(') + ' zoomTo=' + c.includes('function zoomTo(') + ' updateTransform=' + c.includes('function updateTransform') + ' renderMarkers=' + c.includes('function renderMarkers') + ' SUPABASE_ANON_KEY=' + c.includes('SUPABASE_ANON_KEY'));
});

console.log('Done');
