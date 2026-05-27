const fs = require('fs');
const loginCode = `function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}

`;

const files = [
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html',
];

files.forEach(fp => {
  let c = fs.readFileSync(fp, 'utf8');
  if (c.includes('function loginGitHub(')) {
    console.log(fp + ': already has loginGitHub');
    return;
  }
  // Insert loginGitHub after DOMContentLoaded or before the first script function
  // Find a good insertion point
  const insertPoints = [
    'document.addEventListener',
    '// OAuth callback',
    '(function(){',
  ];
  for (const point of insertPoints) {
    const idx = c.indexOf(point);
    if (idx > 0) {
      const before = c.substring(0, idx);
      const after = c.substring(idx);
      c = before + loginCode + after;
      fs.writeFileSync(fp, c);
      console.log(fp + ': added loginGitHub before "' + point.substring(0,20) + '"');
      break;
    }
  }
});

// Also fix search.html - it has no supabase function or OAuth handler
// Add OAuth handler too
const search = fs.readFileSync('F:\\暗区突围网站\\search.html', 'utf8');
if (!search.includes('access_token')) {
  const oauthCode = `
(function(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      localStorage.setItem('abi_token',t);
      localStorage.setItem('abi_user',p.get('email')||'');
      history.replaceState(null,'',window.location.pathname);
    }
  }
})();
`;
  const c2 = search.replace('</script>', '</script>' + oauthCode);
  fs.writeFileSync('F:\\暗区突围网站\\search.html', c2);
  console.log('search.html: added OAuth handler');
}

console.log('Done');
