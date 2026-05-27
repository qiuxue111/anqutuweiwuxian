const fs = require('fs');
const path = require('path');

const pagesDir = 'F:\\暗区突围网站';
const htmlFiles = [
  'index.html',
  'pages/maps.html',
  'pages/weapons.html',
  'pages/strategy.html',
  'pages/gear.html',
  'pages/help.html',
  'pages/map-farm.html',
  'pages/map-beishan.html',
  'pages/map-valley.html',
  'pages/map-armory.html',
  'pages/map-airport.html',
  'pages/map-tvstation.html',
  'pages/review.html',
  'search.html',
  'pages/map-editor.html'
];

const supabaseJS = '<script src="supabase.js"></script>';
const supabaseHTML = '<script src="../supabase.js"></script>';

htmlFiles.forEach(f => {
  const fullPath = path.join(pagesDir, f);
  if (!fs.existsSync(fullPath)) {
    console.log(f + ': NOT FOUND');
    return;
  }
  
  let c = fs.readFileSync(fullPath, 'utf8');
  const isRoot = !f.startsWith('pages/');
  let modified = false;

  // 1. Ensure supabase.js is loaded (only if not already, skip maps.html since it has its own)
  if (!f.includes('maps.')) {
    if (!c.includes('supabase.js') && !c.includes('supabasejs')) {
      const jsPath = isRoot ? 'supabase.js' : '../supabase.js';
      c = c.replace('</body>', '<script src="' + jsPath + '"></script>\n</body>');
      console.log(f + ': added supabase.js');
      modified = true;
    }
  }

  // 2. Standardize login button in navbar - find the <nav> section and add login button
  // Find existing login button or add one
  const hasLogin = c.includes('id="loginBtn"');
  const navLinksIdx = c.indexOf('nav-links');

  if (navLinksIdx >= 0 && !hasLogin) {
    // Add login button before nav links
    const loginBtn = 
      '    <button id="loginBtn" onclick="loginGitHub()" style="padding:0.2rem 0.5rem;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-left:auto;margin-right:0.3rem;">登录</button>\n';
    
    // Find the position right before <ul class="nav-links">
    // But after the logo
    const logoEnd = c.indexOf('</a>', c.indexOf('logo'));
    const rest = c.substring(logoEnd, navLinksIdx);
    const afterLogo = logoEnd + rest.indexOf('\n') + 1;
    
    c = c.substring(0, afterLogo) + loginBtn + '    ' + c.substring(afterLogo);
    modified = true;
    console.log(f + ': added login button');
  }

  if (modified) {
    fs.writeFileSync(fullPath, c);
  }
});

console.log('\nDone');
