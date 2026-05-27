const fs = require('fs');
const files = [
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html',
  'F:\\暗区突围网站\\pages\\maps.html',
  'F:\\暗区突围网站\\pages\\weapons.html',
  'F:\\暗区突围网站\\pages\\strategy.html',
  'F:\\暗区突围网站\\pages\\gear.html',
  'F:\\暗区突围网站\\pages\\map-farm.html',
  'F:\\暗区突围网站\\pages\\map-beishan.html',
  'F:\\暗区突围网站\\pages\\map-valley.html',
  'F:\\暗区突围网站\\pages\\map-armory.html',
  'F:\\暗区突围网站\\pages\\map-airport.html',
  'F:\\暗区突围网站\\pages\\map-tvstation.html',
];

files.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const c = fs.readFileSync(fp, 'utf8');
  const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
  let allOk = true;
  scripts.forEach(s => {
    try { new Function(s.replace('<script>','').replace('</script>','')); }
    catch(e) { console.log(fp + ': ERROR - ' + e.message.substring(0,80)); allOk = false; }
  });
  if (allOk) console.log(fp + ': OK');
});
