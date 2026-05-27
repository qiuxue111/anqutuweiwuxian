const fs = require('fs');
['index.html','search.html','pages/maps.html','pages/weapons.html','pages/strategy.html','pages/gear.html','pages/map-editor.html'].forEach(f => {
  const fp = 'F:\\暗区突围网站\\' + f;
  if (!fs.existsSync(fp)) return;
  const c = fs.readFileSync(fp, 'utf8');
  const hasLogin = c.includes('function loginGitHub(');
  const hasOAuth = c.includes('access_token=');
  const hasSupabase = c.includes('function supabase(') || c.includes('function supa(');
  const validScript = (() => {
    const scripts = c.match(/<script>([\s\S]*?)<\/script>/g);
    if (!scripts) return true;
    for (const s of scripts) {
      try { new Function(s.replace('<script>','').replace('</script>','')); }
      catch(e) { console.log(`  ${f}: SCRIPT ERROR: ${e.message.substr(0,80)}`); return false; }
    }
    return true;
  })();
  console.log(`${f}: loginGitHub=${hasLogin}, OAuth=${hasOAuth}, supabase=${hasSupabase}, valid=${validScript}`);
});
