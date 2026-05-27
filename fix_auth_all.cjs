const fs = require('fs');
const files = [
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html',
  'F:\\暗区突围网站\\pages\\maps.html',
  'F:\\暗区突围网站\\pages\\weapons.html',
  'F:\\暗区突围网站\\pages\\strategy.html',
  'F:\\暗区突围网站\\pages\\gear.html',
  'F:\\暗区突围网站\\pages\\map-editor.html',
];

files.forEach(fp => {
  if (!fs.existsSync(fp)) return console.log(fp + ': not found');
  let c = fs.readFileSync(fp, 'utf8');

  // Fix loginGitHub - use redirect_to correctly
  c = c.replace(/function loginGitHub[\s\S]*?\}/, `function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;}`);

  // Ensure OAuth callback handler exists before init
  // Find the init function and prepend auth handler
  const initRegex = /function init\s*\(\s*\)/;
  if (initRegex.test(c)) {
    const oauthHandler = `
// OAuth callback: grab token from URL hash
(function(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    var e=p.get('expires_in');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',p.get('email')||payload.email||payload.user_metadata?.email||'');
        // Clean URL
        history.replaceState(null,'',window.location.pathname);
      }catch(err){}
    }
  }
})();
`;
    c = c.replace(initRegex, oauthHandler + '\nfunction init');
  } else {
    console.log(fp + ': no init() function found, adding handler at bottom');
    // Add at bottom of script
    const oauthHandler = `
(function(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',p.get('email')||payload.email||'');
        history.replaceState(null,'',window.location.pathname);
      }catch(err){}
    }
  }
})();
`;
    c = c.replace('</script>', oauthHandler + '\n</script>');
  }

  fs.writeFileSync(fp, c);
  console.log(fp + ': OK');
});
