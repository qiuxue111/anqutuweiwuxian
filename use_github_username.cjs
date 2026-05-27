const fs = require('fs');
const root = 'F:\\暗区突围网站';
const pages = ['index.html','search.html','pages/maps.html','pages/weapons.html','pages/strategy.html','pages/gear.html',
  'pages/map-farm.html','pages/map-beishan.html','pages/map-valley.html','pages/map-armory.html','pages/map-airport.html','pages/map-tvstation.html'];

pages.forEach(function(p) {
  var fp = root + '\\' + p.replace(/\//g, '\\');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Change email assignment to prefer preferred_username (GitHub username)
  c = c.replace(
    "var email=payload.email||p.get('email')||'';",
    "var email=payload.preferred_username||payload.user_metadata?.preferred_username||payload.email||p.get('email')||'';"
  );
  
  // Also fix the nested version in authCheck
  c = c.replace(
    "var email=payload.preferred_username||p.get('email')||'';",
    "var email=payload.preferred_username||payload.user_metadata?.preferred_username||payload.email||p.get('email')||'';"
  );
  
  fs.writeFileSync(fp, c);
  console.log(p + ': updated');
});

console.log('Done');
