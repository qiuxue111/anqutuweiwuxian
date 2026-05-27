const fs = require('fs');
const root = 'F:\\暗区突围网站';

function fixAuthCheck(filePath) {
  let c = fs.readFileSync(filePath, 'utf8');
  
  // Replace the entire auth IIFE with a robust version
  const oldIIFE = `(function(){
  var h=window.location.hash;
  if(h&&h.indexOf('access_token=')>=0){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        localStorage.setItem('abi_token',t);
        var uname=payload.preferred_username||payload.user_metadata?.preferred_username||payload.email||'';
        localStorage.setItem('abi_user',uname);
        history.replaceState(null,'',window.location.pathname);
        location.reload();
      }catch(e){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(un){un.style.display='';un.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(lb)lb.style.display='none';
  }
})();`;

  const newIIFE = `(function(){
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
  var token=localStorage.getItem('abi_token');
  if(token){
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(un){un.style.display='';un.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(lb)lb.style.display='none';
  }
})();`;

  if (c.indexOf(oldIIFE) >= 0) {
    c = c.replace(oldIIFE, newIIFE);
    console.log(filePath + ': replaced auth IIFE');
  } else {
    // Try to find any IIFE with access_token pattern
    const start = c.indexOf('(function(){');
    if (start >= 0) {
      const end = c.indexOf('})();', start) + 5;
      const iife = c.substring(start, end);
      if (iife.indexOf('access_token') >= 0) {
        c = c.substring(0, start) + newIIFE + c.substring(end);
        console.log(filePath + ': replaced auth IIFE (fallback)');
      }
    }
  }
  
  fs.writeFileSync(filePath, c);
}

const pages = [
  root + '\\index.html',
  root + '\\search.html',
  root + '\\pages\\maps.html',
  root + '\\pages\\weapons.html',
  root + '\\pages\\strategy.html',
  root + '\\pages\\gear.html',
  root + '\\pages\\map-farm.html',
  root + '\\pages\\map-beishan.html',
  root + '\\pages\\map-valley.html',
  root + '\\pages\\map-armory.html',
  root + '\\pages\\map-airport.html',
  root + '\\pages\\map-tvstation.html',
];

pages.forEach(fixAuthCheck);
console.log('All done');
