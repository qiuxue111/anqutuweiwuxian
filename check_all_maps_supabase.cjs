const fs = require('fs');
const maps = ['farm','beishan','valley','armory','airport','tvstation'];
maps.forEach(m => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${m}.html`, 'utf8');
  let supabase_pins = c.indexOf('supabase("pins"');
  let supabase_pend = c.indexOf('supabase("pending_pins"');
  console.log(`${m}: GET pins=${supabase_pins}, POST pending_pins=${supabase_pend}, has "map_name": ${c.includes('map_name')}`);
  console.log(`  GET pins: ${c.substring(supabase_pins, supabase_pins+100)}`);
  console.log(`  POST pending_pins: ${c.substring(supabase_pend, supabase_pend+100)}`);
  console.log('---');
});
