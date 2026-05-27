const fs = require('fs');
const root = 'F:\\暗区突围网站';
const pages = ['index','search','pages/maps','pages/weapons','pages/strategy','pages/gear',
  'pages/map-farm','pages/map-beishan','pages/map-valley','pages/map-armory','pages/map-airport','pages/map-tvstation'];

pages.forEach(function(p) {
  var fp = root + '/' + p.replace(/\\/g,'/') + '.html'.replace(/\\/g,'/');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  console.log(p + ':');
  console.log('  navbar: ' + (c.indexOf('navbar') >= 0));
  console.log('  sideMenu: ' + (c.indexOf('sideMenu') >= 0));
  console.log('  loginGitHub: ' + (c.indexOf('function loginGitHub') >= 0));
  console.log('  initAuth: ' + (c.indexOf('initAuth') >= 0));
  console.log('  toggleMenu: ' + (c.indexOf('function toggleMenu') >= 0));
  console.log('  userName: ' + (c.indexOf('userName') >= 0));
  // Check supabase function still exists
  var hasSupabase = c.indexOf('function supabase(') >= 0 || c.indexOf('function supa(') >= 0;
  console.log('  supabase: ' + hasSupabase);
  // Script validation
  var scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
  var valid = true;
  if (scripts) scripts.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { valid = false; console.log('  SCRIPT ERROR: ' + e.message.substring(0,60)); }
  });
  if (valid) console.log('  scripts: OK');
});
