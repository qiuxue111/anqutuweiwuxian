const fs = require('fs');
['beishan','armory','airport','tvstation'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf("supabase('pending_pins'");
  const post = c.substring(idx, idx + 400);
  console.log(`${eng}:`, JSON.stringify(post.substring(0, 200)));
});
