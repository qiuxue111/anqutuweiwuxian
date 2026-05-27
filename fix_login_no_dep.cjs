const fs = require('fs');

['weapons', 'strategy', 'gear'].forEach(file => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, 'utf8');

  // Replace loginGitHub function - use direct OAuth URL instead of supabasejs
  const newLogin = `function loginGitHub(){
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(window.location.origin+'/anqutuweiwuxian/pages/${file}.html');
  window.location.href=u;}`;

  c = c.replace(/function loginGitHub[\s\S]*?\}/, newLogin);

  // Also handle OAuth redirect - parse access_token from URL hash
  const oauthHandler = `
  // OAuth callback handler
  var h=window.location.hash||window.location.search;
  if(h.includes('access_token=')){
    var params=new URLSearchParams(h.replace('#','').replace('?',''));
    var t=params.get('access_token');
    if(t){localStorage.setItem('abi_token',t);localStorage.setItem('abi_user',params.get('email')||params.get('user_name')||'');window.location.hash='';window.location.search='';}
  }`;

  c = c.replace('function init(){', oauthHandler + '\nfunction init(){');

  fs.writeFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, c);
  console.log(`${file}: login fixed`);
});

// Also fix index.html and maps.html
['..\\index.html', 'maps.html'].forEach(f => {
  const fp = f.startsWith('..') ? `F:\\暗区突围网站\\${f.replace('..\\','')}` : `F:\\暗区突围网站\\pages\\${f}`;
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  // Same replace
  c = c.replace(/function loginGitHub[\s\S]*?\}/, `function loginGitHub(){
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(window.location.origin+'/anqutuweiwuxian/'+(f.startsWith('pages')?'pages/':'')+(f.endsWith('.html')?f:'index.html'));
  window.location.href=u;}`);
  fs.writeFileSync(fp, c);
  console.log(`${f}: login fixed`);
});

console.log('Done');
