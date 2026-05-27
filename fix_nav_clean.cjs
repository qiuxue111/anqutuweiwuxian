const fs = require('fs');
const { execSync } = require('child_process');

// Restore clean version from commit 8e0bd27
const buf = execSync('git -C "F:\\暗区突围网站" show 8e0bd27:pages/maps.html', {encoding: 'buffer'});
let c = buf.toString('utf8');

// Find the navbar area and replace everything from <div class="logo"> to <ul class="nav-links"> with clean one
// First find the exact pattern
const logoStart = c.indexOf('<div class="logo">');
const navLinksStart = c.indexOf('<ul class="nav-links">');

if (logoStart < 0 || navLinksStart < 0) {
  console.log('Could not find markers');
  process.exit(1);
}

console.log('logo at', logoStart, 'nav-links at', navLinksStart);
console.log('Current navbar buttons:');
console.log(c.substring(logoStart, navLinksStart));

// Replace the section between </span>\n    (end of logo) and first nav <ul>
const afterLogo = c.indexOf('</span>', logoStart) + 8; // '</span>\n    '
c = c.substring(0, afterLogo) + '\n    ' + c.substring(navLinksStart);

// Now add the correct buttons back
c = c.replace('    <ul class="nav-links">',
  '    <button id="videoAdminBtn" onclick="toggleVideoPanel()" style="display:none;padding:0.2rem 0.5rem;background:#ffc832;color:#0a0a0f;border:none;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-right:0.5rem;">管理视频</button>\n' +
  '    <button id="loginBtn" onclick="loginGitHub()" style="display:none;padding:0.2rem 0.5rem;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-right:0.5rem;">登录</button>\n' +
  '    <ul class="nav-links">');

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('\nDone. Size:', c.length);

// Verify
const counts = {
  videoAdminBtnHTML: c.split('<button id="videoAdminBtn"').length - 1,
  loginBtnHTML: c.split('<button id="loginBtn" onclick').length - 1,
  loginBtnJS: c.split('document.getElementById(').filter(x => x.includes('loginBtn')).length,
};
console.log('Counts:', JSON.stringify(counts));
