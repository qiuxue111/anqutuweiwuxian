const fs = require('fs');
const root = 'F:\\暗区突围网站';

// Add a green dot indicator next to userName
const pages = ['index.html', 'search.html', 'pages/maps.html', 'pages/weapons.html', 'pages/strategy.html', 'pages/gear.html',
  'pages/map-farm.html', 'pages/map-beishan.html', 'pages/map-valley.html', 'pages/map-armory.html', 'pages/map-airport.html', 'pages/map-tvstation.html'];

pages.forEach(function(fp) {
  fp = root + '\\' + fp.replace(/\//g, '\\');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Add a login status dot inside userArea
  var old = '<div id="userArea"><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>';
  var now = '<div id="userArea"><span id="loginDot" style="display:none;width:8px;height:8px;border-radius:50%;background:#2ecc71;margin-right:2px;"></span><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>';
  c = c.replace(old, now);
  
  // Also update the JS to show the dot when logged in
  c = c.replace('if(un){un.style.display="inline";un.textContent=localStorage.getItem("abi_user")||"已登录";}',
    'var dot=document.getElementById("loginDot");if(dot)dot.style.display="inline-block";if(un){un.style.display="inline";un.textContent=localStorage.getItem("abi_user")||"已登录";}');
  c = c.replace("if(un){un.style.display='inline';un.textContent=localStorage.getItem('abi_user')||'已登录';}",
    "var dot=document.getElementById('loginDot');if(dot)dot.style.display='inline-block';if(un){un.style.display='inline';un.textContent=localStorage.getItem('abi_user')||'已登录';}");
  
  // hide dot when logged out
  c = c.replace('if(un)un.style.display="none";',
    'var dot=document.getElementById("loginDot");if(dot)dot.style.display="none";if(un)un.style.display="none";');
  c = c.replace("if(un)un.style.display='none';",
    "var dot=document.getElementById('loginDot');if(dot)dot.style.display='none';if(un)un.style.display='none';");
  
  fs.writeFileSync(fp, c);
  console.log(fp + ': done');
});

console.log('All done');
