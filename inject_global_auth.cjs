const fs = require('fs');

const authPrefix = `
// Global auth handler - runs before anything else
(function(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        var email=payload.email||p.get('email')||'';
        localStorage.setItem('abi_user',email);
        history.replaceState(null,'',window.location.pathname);
        // Reload to trigger init with token
        location.reload();
      }catch(err){}
    }
  }
})();

// Check login state on every page load
(function checkLogin(){
  var token=localStorage.getItem('abi_token');
  if(!token) return;
  // Hide all login buttons
  document.querySelectorAll('#loginBtn').forEach(function(b){b.style.display='none'});
})();
`;

const pages = [
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html',
  'F:\\暗区突围网站\\pages\\maps.html',
  'F:\\暗区突围网站\\pages\\weapons.html',
  'F:\\暗区突围网站\\pages\\strategy.html',
  'F:\\暗区突围网站\\pages\\gear.html',
  'F:\\暗区突围网站\\pages\\map-farm.html',
  'F:\\暗区突围网站\\pages\\map-beishan.html',
  'F:\\暗区突围网站\\pages\\map-valley.html',
  'F:\\暗区突围网站\\pages\\map-armory.html',
  'F:\\暗区突围网站\\pages\\map-airport.html',
  'F:\\暗区突围网站\\pages\\map-tvstation.html',
  'F:\\暗区突围网站\\pages\\map-editor.html',
];

pages.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Remove ALL existing authCheck/auth handler IIFEs
  c = c.replace(/\(function authCheck[\s\S]*?\n\})\(\);/g, '');
  c = c.replace(/\(function checkLogin[\s\S]*?\n\})\(\);/g, '');
  // Remove old IIFEs that deal with access_token
  c = c.replace(/\(function\(\)\{[\s\S]*?access_token[\s\S]*?\n\})\(\);/g, '');
  // Remove old standalone authCheck variable
  c = c.replace(/\n\/\/ Check for OAuth[\s\S]*?\n\})\(\);/g, '');
  c = c.replace(/\n\/\/ OAuth callback[\s\S]*?\n\})\(\);/g, '');
  
  // Insert authPrefix right after <script>
  c = c.replace('<script>', '<script>' + authPrefix);
  
  // Fix: Remove duplicate loginGitHub if exists
  // We'll clean up after insertion
  const loginCount = c.split('function loginGitHub(').length - 1;
  if (loginCount > 1) {
    // Remove the second one
    const firstIdx = c.indexOf('function loginGitHub(');
    const secondIdx = c.indexOf('function loginGitHub(', firstIdx + 10);
    if (secondIdx > 0) {
      const fnEnd = c.indexOf('\n', c.indexOf('}', secondIdx)) + 1;
      c = c.substring(0, secondIdx) + c.substring(fnEnd);
    }
  }
  
  fs.writeFileSync(fp, c);
  console.log(fp.split('\\').pop() + ': OK');
});

console.log('\nValidating...');

// Validate all pages
pages.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const c = fs.readFileSync(fp, 'utf8');
  const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
  let ok = true;
  scripts.forEach(s => {
    try { new Function(s.replace('<script>','').replace('</script>','')); }
    catch(e) { console.log(fp.split('\\').pop() + ': ERROR - ' + e.message.substring(0,80)); ok = false; }
  });
  if (ok) console.log(fp.split('\\').pop() + ': VALID');
});

console.log('\nAll done');
