const fs = require('fs');
const maps = ['farm','beishan','valley','armory','airport','tvstation'];
const mapNames = {
  farm: '农场',
  beishan: '北山',
  valley: '山谷',
  armory: '前线要塞',
  airport: '机场',
  tvstation: '电视台'
};

maps.forEach(key => {
  let path = `F:\\暗区突围网站\\pages\\map-${key}.html`;
  let c = fs.readFileSync(path, 'utf8');
  let origLen = c.length;
  
  // 1. Add MAP_NAME variable after the existing variables
  // Find: var abi_${key}_pins in savePins function area
  // Actually find a good insertion point: after all global vars, before Supabase section
  
  // Add MAP_NAME declaration before "// --- Supabase cloud ---"
  c = c.replace(
    '// --- Supabase cloud ---',
    `var MAP_NAME = '${mapNames[key]}';\n// --- Supabase cloud ---`
  );
  
  // 2. Fix GET pins to filter by map_name
  c = c.replace(
    'supabase("pins","GET")',
    `supabase("pins","GET",null,"map_name=eq.${encodeURIComponent(mapNames[key])}")`
  );
  
  // 3. Fix GET map_comments to filter by map_name
  c = c.replace(
    'supabase("map_comments","GET")',
    `supabase("map_comments","GET",null,"map_name=eq.${encodeURIComponent(mapNames[key])}")`
  );
  
  // 4. Fix POST pending_pins to include map_name
  c = c.replace(
    'supabase("pending_pins","POST",sdata)',
    `supabase("pending_pins","POST",Object.assign({map_name:MAP_NAME},sdata))`
  );
  
  // 5. POST map_comments to include map_name
  // Need to find the exact line that posts map comments
  // Check if map_comments POST already exists
  if (c.includes('map_name:MAP_NAME')) {
    console.log(`${key}: map_name already in POST`);
  } else {
    let postCommentIdx = c.indexOf('supabase("map_comments","POST"');
    if (postCommentIdx >= 0) {
      c = c.replace(
        'supabase("map_comments","POST",{content:',
        `supabase("map_comments","POST",{map_name:MAP_NAME,content:`
      );
    }
  }
  
  fs.writeFileSync(path, c);
  console.log(`${key}: ${origLen} -> ${c.length} (${(c.length - origLen)} bytes)`);
  
  // Verify
  let mc = c.match(new RegExp(`MAP_NAME\\s*=\\s*'${mapNames[key]}'`));
  let pg = c.includes(`map_name=eq.${encodeURIComponent(mapNames[key])}`);
  let pp = c.includes('map_name:MAP_NAME');
  let pm = c.includes('map_name:MAP_NAME,content:');
  console.log(`  MAP_NAME: ${!!mc}, GET filter: ${pg}, POST map_name: ${pp || pm}`);
});
