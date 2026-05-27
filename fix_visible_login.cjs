const fs = require('fs');
const root = 'F:\\暗区突围网站';

const pages = ['index.html', 'search.html', 'pages/maps.html', 'pages/weapons.html', 'pages/strategy.html', 'pages/gear.html',
  'pages/map-farm.html', 'pages/map-beishan.html', 'pages/map-valley.html', 'pages/map-armory.html', 'pages/map-airport.html', 'pages/map-tvstation.html'];

pages.forEach(function(fp) {
  fp = root + '\\' + fp.replace(/\//g, '\\');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Replace userArea HTML - put login button and userName inline
  var old = '<div id="userArea">\n  <span id="userName"></span>\n  <button id="loginBtn" onclick="loginGitHub()">登录</button>\n</div>';
  var newer = '<div id="userArea"><span id="userName" style="display:none;color:#ffc832;font-size:0.85rem;background:rgba(20,20,30,0.7);backdrop-filter:blur(6px);padding:6px 12px;border-radius:8px;border:1px solid rgba(255,255,255,0.06);"></span><button id="loginBtn" onclick="loginGitHub()" style="padding:6px 14px;background:rgba(255,200,50,0.12);color:#ffc832;border:1px solid rgba(255,200,50,0.15);border-radius:8px;font-size:0.85rem;cursor:pointer;">登录</button></div>';
  c = c.replace(old, newer);
  
  // Also update the JS that handles login state
  c = c.replace(`if(token){
      if(un){un.style.display='';un.textContent=localStorage.getItem('abi_user')||'已登录';}
      if(lb)lb.style.display='none';
    }else{
      if(un)un.style.display='none';
      if(lb)lb.style.display='';
    }`, `if(token){
      if(un){un.style.display='inline';un.textContent=localStorage.getItem('abi_user')||'已登录';}
      if(lb)lb.style.display='none';
    }else{
      if(un)un.style.display='none';
      if(lb)lb.style.display='inline-block';
    }`);
  
  fs.writeFileSync(fp, c);
  console.log(fp + ': fixed');
});

console.log('Done');
