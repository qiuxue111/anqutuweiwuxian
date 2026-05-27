const fs = require('fs');

// Standard login function and OAuth handler for ALL pages
const loginSnippet = `
function loginGitHub(){
  var cb=window.location.origin+'/anqutuweiwuxian'+window.location.pathname.replace(/^\\/anqutuweiwuxian/,'');
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
}

// Check for OAuth token on load
(function authCheck(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',t ? (payload.email||payload.user_metadata?.email||'') : '');
        history.replaceState(null,'',window.location.pathname);
        // Only reload if not already on the right page
        if(!localStorage.getItem('abi_user')) location.reload();
      }catch(err){}
    }
  }
  // Show login state in UI
  var token=localStorage.getItem('abi_token');
  if(token){
    document.querySelectorAll('[id^=loginBtn]').forEach(function(b){b.style.display='none'});
    document.querySelectorAll('[id^=videoAdminBtn]').forEach(function(b){b.style.display=''});
  }
})();
`;

// Apply to all main pages
const mainPages = [
  { path: 'F:\\暗区突围网站\\index.html', scriptBefore: 'function esc' },
  { path: 'F:\\暗区突围网站\\search.html', scriptBefore: 'document.addEventListener' },
];

mainPages.forEach(({path, scriptBefore}) => {
  let c = fs.readFileSync(path, 'utf8');
  // Remove any existing loginGitHub
  c = c.replace(/function loginGitHub[\s\S]*?\n\}/g, '');
  // Remove existing authCheck IIFE
  c = c.replace(/\(function authCheck[\s\S]*?\n\})\(\);/g, '');
  c = c.replace(/\(function\(\)[\s\S]*?access_token[\s\S]*?\n\})\(\);/g, '');
  
  // Insert the standardized login snippet before the script content
  const idx = c.indexOf(scriptBefore);
  if (idx > 0) {
    const before = c.substring(0, idx);
    const after = c.substring(idx);
    c = before + loginSnippet + '\n' + after;
  }
  fs.writeFileSync(path, c);
  console.log(path + ': updated');
});

// For map pages (farm/beishan etc) - they have the authArea login
// We need to replace their login function too
const mapPages = [
  'map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'
];

mapPages.forEach(name => {
  const fp = `F:\\暗区突围网站\\pages\\${name}.html`;
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Replace the authArea login handler  
  if (c.includes('authArea')) {
    // The map pages have: <span onclick="login()" ...>GitHub 登录</span>
    // We need login() -> localStorage compatible
    c = c.replace(`<span onclick="login()" style="cursor:pointer;color:#ffc832;font-size:13px;background:#2a2a10;padding:4px 12px;border-radius:4px;border:1px solid #ffc83244">GitHub 登录</span>`, 
      `<button onclick="loginGitHub()" style="cursor:pointer;color:#ffc832;font-size:13px;background:#2a2a10;padding:4px 12px;border-radius:4px;border:1px solid #ffc83244">登录</button>`);
    
    // Check if they already have a loginGitHub function or login()
    if (!c.includes('function loginGitHub')) {
      // Replace their login() function with loginGitHub
      c = c.replace(/function login\(\)[\s\S]*?\n\}/, 
        `function loginGitHub(){
  var cb=window.location.origin+'/anqutuweiwuxian'+window.location.pathname.replace(/^\\/anqutuweiwuxian/,'');
  var u='https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to='+encodeURIComponent(cb);
  window.location.href=u;
  return false;
}`);
    }
    
    // Add authCheck IIFE before the first script tag
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
  var token=localStorage.getItem('abi_token');
  if(token&&document.getElementById('userStatus')){
    document.getElementById('userStatus').textContent=localStorage.getItem('abi_user')||'已登录';
  }
})();
`;
      c = c.replace('<script src="../supabase.js">', '');
      c = c.replace('<script>', '<script>' + authSnippet);
    }
    
    fs.writeFileSync(fp, c);
    console.log(name + ': updated');
  }
});

// Remove supabase.js script refs from ALL pages
const allPages = ['F:\\暗区突围网站\\index.html','F:\\暗区突围网站\\search.html','F:\\暗区突围网站\\pages\\maps.html','F:\\暗区突围网站\\pages\\map-editor.html'];
allPages.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  c = c.replace(/<script src="(\.\.\/)?supabase\.js"><\/script>\n?/g, '');
  fs.writeFileSync(fp, c);
});

console.log('All done');
