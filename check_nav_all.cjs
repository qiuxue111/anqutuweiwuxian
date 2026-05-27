const fs = require('path');
const pagesDir = 'F:\\暗区突围网站';
const files = [
  'index.html','pages/maps.html','pages/weapons.html','pages/strategy.html',
  'pages/gear.html','pages/help.html','pages/map-farm.html','pages/map-beishan.html',
  'pages/map-valley.html','pages/map-armory.html','pages/map-airport.html',
  'pages/map-tvstation.html','pages/review.html','search.html','pages/map-editor.html'
];

const check = require('child_process').execSync;
files.forEach(f => {
  const c = require('fs').readFileSync(require('path').join(pagesDir, f), 'utf8');
  const hasLogin = c.includes('id="loginBtn"');
  const hasSupabase = c.includes('supabase.js') || c.includes('supabasejs');
  const hasNav = c.includes('nav-links');
  console.log(f + ': login=' + hasLogin + ', supabase=' + hasSupabase + ', nav=' + hasNav);
});
