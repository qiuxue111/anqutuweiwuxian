const fs = require('fs');

// Fix authCheck to reload after storing token
const files = [
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

files.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Fix authCheck: add location.reload() after storing token
  c = c.replace(
    `localStorage.setItem("abi_user",payload.email||payload.user_metadata?.email||"");`,
    `localStorage.setItem("abi_user",payload.email||payload.user_metadata?.email||"");location.reload();`
  );
  // Also fix single-quote version
  c = c.replace(
    `localStorage.setItem('abi_user',payload.email||payload.user_metadata?.email||'');`,
    `localStorage.setItem('abi_user',payload.email||payload.user_metadata?.email||'');location.reload();`
  );
  // Fix old handler version
  c = c.replace(
    `localStorage.setItem('abi_user',p.get('email')||payload.email||'');`,
    `localStorage.setItem('abi_user',p.get('email')||payload.email||'');location.reload();`
  );
  
  fs.writeFileSync(fp, c);
});

// Now fix nav bar for map pages - they have different nav styles
// Make them use the same navbar as main pages
const mapPages = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
mapPages.forEach(name => {
  const fp = `F:\\暗区突围网站\\pages\\${name}.html`;
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Find the nav section and replace with unified nav
  const navStart = c.indexOf('<nav>');
  const navEnd = c.indexOf('</nav>') + 6;
  
  if (navStart >= 0) {
    const unifiedNav = `<nav class="navbar">
  <div class="logo"><a href="../index.html" style="color:#ffc832;text-decoration:none;">暗区无限</a> <span>攻略站</span></div>
  <ul class="nav-links">
    <li><a href="maps.html">地图</a></li>
    <li><a href="weapons.html">帖子</a></li>
    <li><a href="strategy.html">闲聊</a></li>
    <li><a href="gear.html">攻略</a></li>
    <li><a href="../search.html">🔍</a></li>
  </ul>
  <button id="loginBtn" onclick="loginGitHub()" style="padding:0.2rem 0.5rem;background:#333;color:#ccc;border:1px solid #555;border-radius:4px;font-size:0.75rem;cursor:pointer;margin-left:auto;flex-shrink:0;">登录</button>
</nav>`;
    c = c.substring(0, navStart) + unifiedNav + c.substring(navEnd);
    fs.writeFileSync(fp, c);
    console.log(`${name}: nav unified`);
  }
});

console.log('All authCheck fixed + map navs unified');
