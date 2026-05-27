const fs = require('fs');
const root = 'F:\\暗区突围网站';

const pages = [
  'index.html', 'search.html', 'pages/maps.html',
  'pages/weapons.html', 'pages/strategy.html', 'pages/gear.html',
  'pages/map-farm.html', 'pages/map-beishan.html', 'pages/map-valley.html',
  'pages/map-armory.html', 'pages/map-airport.html', 'pages/map-tvstation.html'
];

pages.forEach(function(filePath) {
  var fp = root + '\\' + filePath.replace(/\//g, '\\');
  if (!fs.existsSync(fp)) return;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Find the auth IIFE that contains window.location.reload and replace it
  var start = c.indexOf('(function(){');
  if (start < 0) return;
  var end = c.indexOf('})();', start) + 5;
  var oldIIFE = c.substring(start, end);
  
  if (oldIIFE.indexOf('access_token') < 0) return;
  
  var newIIFE = `(function(){
  // 1) OAuth callback: save token from URL hash
  var h=window.location.hash;
  if(h&&h.indexOf('access_token=')>=0){
    var raw=h.replace('#','');
    var parts=raw.split('&');
    var t='';
    for(var i=0;i<parts.length;i++){
      if(parts[i].indexOf('access_token=')===0){t=parts[i].substring('access_token='.length);break;}
    }
    if(t){
      try{
        var b64=t.split('.')[1];
        b64=b64.replace(/-/g,'+').replace(/_/g,'/');
        while(b64.length%4)b64+='=';
        var payload=JSON.parse(atob(b64));
        var uname=payload.preferred_username||(payload.user_metadata&&payload.user_metadata.preferred_username)||payload.email||'';
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',uname);
        history.replaceState(null,'',window.location.pathname);
        window.location.reload();
        return;
      }catch(e){}
    }
  }
  // 2) On DOM ready: check login state and update UI
  function applyLoginState(){
    var token=localStorage.getItem('abi_token');
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(token&&un){
      un.style.display='';
      un.textContent=localStorage.getItem('abi_user')||'已登录';
    }
    if(token&&lb){
      lb.style.display='none';
    }
    if(!token&&lb){
      lb.style.display='';
    }
    if(!token&&un){
      un.style.display='none';
    }
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',applyLoginState);
  }else{
    applyLoginState();
  }
})();`;
  
  c = c.substring(0, start) + newIIFE + c.substring(end);
  fs.writeFileSync(fp, c);
  console.log(filePath + ': fixed');
});

console.log('Done');
