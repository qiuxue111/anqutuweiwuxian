const fs = require('fs');
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(n) {
  const c = fs.readFileSync('F:\\暗区突围网站\\v2\\pages\\'+n+'.html', 'utf8');
  const scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  let ok = true;
  scripts.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { ok = false; console.log(n+': SCRIPT ERROR - '+e.message.substring(0,60)); }
  });
  if (ok) console.log(n+': OK, supa='+c.includes('function supabase')+', bubble='+c.includes('bubbleMenu'));
});
