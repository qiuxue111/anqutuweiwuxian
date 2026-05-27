const fs = require('fs');

const loginSnippet = `
function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}
(function authCheck(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',payload.email||payload.user_metadata?.email||'');
        history.replaceState(null,'',window.location.pathname);
      }catch(err){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    document.querySelectorAll('#loginBtn').forEach(function(b){b.style.display='none'});
  }
})();
`;

// Fix main pages
[
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html'
].forEach(fp => {
  let c = fs.readFileSync(fp, 'utf8');
  // Remove any existing authCheck or loginGitHub
  const lines = c.split('\n');
  const newLines = [];
  let skipAuthCheck = false;
  let skipAuthEnd = 0;
  
  lines.forEach((line, i) => {
    if (line.includes('function loginGitHub')) { skipAuthEnd = 3; }
    if (line.includes('(function authCheck')) { skipAuthEnd = 8; }
    if (line.includes('(function(){') && line.includes('access_token')) { skipAuthEnd = 12; }
    
    if (skipAuthEnd > 0) { skipAuthEnd--; return; }
    newLines.push(line);
  });
  
  c = newLines.join('\n');
  
  // Insert standardized login before esc function or DOMContentLoaded
  const idx = c.indexOf('function esc') >= 0 ? c.indexOf('function esc') : c.indexOf('document.addEventListener');
  if (idx > 0) {
    c = c.substring(0, idx) + loginSnippet + '\n' + c.substring(idx);
  }
  
  // Remove supabase.js ref
  c = c.replace(/<script src="(\.\.\/)?supabase\.js"><\/script>\n?/g, '');
  
  fs.writeFileSync(fp, c);
  console.log(fp + ': OK');
});

// Fix map pages - replace their login()
const mapPages = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
mapPages.forEach(name => {
  const fp = 'F:\\暗区突围网站\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Replace onclick="login()" with onclick="loginGitHub()"
  c = c.replace('onclick="login()"', 'onclick="loginGitHub()"');
  
  // Replace/remove the old login() function
  const hasLoginGitHub = c.includes('function loginGitHub(');
  if (!hasLoginGitHub) {
    // Replace login() function with loginGitHub
    c = c.replace(/function login\([\s\S]*?\n\}/, `function loginGitHub(){
  var cb=window.location.origin+window.location.pathname;
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
  return false;}`);
  }
  
  // Add authCheck if not present
  if (!c.includes('authCheck')) {
    const authSnippet = `
(function authCheck(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',payload.email||payload.user_metadata?.email||'');
        history.replaceState(null,'',window.location.pathname);
      }catch(err){}
    }
  }
})();
`;
    c = c.replace('<script>', '<script>' + authSnippet);
  }
  
  // Remove supabase.js ref
  c = c.replace(/<script src="(\.\.\/)?supabase\.js"><\/script>\n?/g, '');
  
  fs.writeFileSync(fp, c);
  console.log(name + ': OK');
});

console.log('All done');
