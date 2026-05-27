const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];

var replaceCode = 'window.onload=function(){console.log("ONLOAD");initAuth();loadCloudPins();updateAuthUI();};';
var withCode = 'window.onload=function(){console.log("ONLOAD");var token=localStorage.getItem("abi_token");var un=document.getElementById("userName");var lb=document.getElementById("loginBtn");if(token){if(un){un.style.display="inline";un.textContent=localStorage.getItem("abi_user")||"已登录";}if(lb)lb.style.display="none";}loadCloudPins();updateAuthUI();};';

maps.forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  if (c.indexOf(replaceCode) >= 0) {
    c = c.replace(replaceCode, withCode);
    fs.writeFileSync(fp, c);
    console.log(name + ': fixed onload');
  } else {
    console.log(name + ': pattern not found');
  }
});

console.log('Done');
