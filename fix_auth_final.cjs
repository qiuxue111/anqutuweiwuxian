const fs = require('fs');
const root = 'F:\\暗区突围网站';

// Find ALL instances of the auth IIFE in index.html and replace with a robust version
function fixAuthInFile(fp) {
  var c = fs.readFileSync(fp, 'utf8');
  
  // Find the authCheck IIFE - look for pattern: (function(){ ... access_token ... })();
  // Try multiple patterns
  var patterns = [
    { start: '(function(){', end: '})();' },
    { start: '// 1) OAuth callback', end: '})();' },
    { start: '(function(){', end: '\n})();' },
  ];
  
  for (var pi = 0; pi < patterns.length; pi++) {
    var p = patterns[pi];
    var startIdx = c.indexOf(p.start);
    if (startIdx < 0) continue;
    
    // Find the matching end by scanning for '})();'
    var endIdx = c.indexOf(p.end, startIdx + 10);
    if (endIdx < 0) continue;
    endIdx += p.end.length;
    
    var block = c.substring(startIdx, endIdx);
    
    // Only replace if it has access_token
    if (block.indexOf('access_token') < 0) continue;
    
    var newBlock = `(function(){
  var h=window.location.hash;
  if(h&&h.indexOf('access_token=')>=0){
    var raw=h.replace('#','');
    // Parse access_token manually from the hash
    var idx=raw.indexOf('access_token=');
    if(idx>=0){
      var t=raw.substring(idx+13);
      var amp=t.indexOf('&');
      if(amp>=0)t=t.substring(0,amp);
      try{
        var b64=t.split('.')[1];
        if(b64){
          b64=b64.replace(/-/g,'+').replace(/_/g,'/');
          while(b64.length%4)b64+='=';
          var payload=JSON.parse(atob(b64));
          var uname=payload.preferred_username||(payload.user_metadata&&payload.user_metadata.preferred_username)||payload.email||'';
          localStorage.setItem('abi_token',t);
          localStorage.setItem('abi_user',uname);
          history.replaceState(null,'',window.location.pathname);
          window.location.reload();
          return;
        }
      }catch(e){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    var un=document.getElementById('userName');
    var lb=document.getElementById('loginBtn');
    if(un){un.style.display='inline';un.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(lb)lb.style.display='none';
  }
  // Safety check again after DOM ready
  function checkAgain(){
    var tok=localStorage.getItem('abi_token');
    var un2=document.getElementById('userName');
    var lb2=document.getElementById('loginBtn');
    if(tok&&un2){un2.style.display='inline';un2.textContent=localStorage.getItem('abi_user')||'已登录';}
    if(tok&&lb2)lb2.style.display='none';
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',checkAgain);}
  else{setTimeout(checkAgain,100);}
  setTimeout(checkAgain,1000);
})();`;
    
    c = c.substring(0, startIdx) + newBlock + c.substring(endIdx);
    console.log(fp + ': replaced');
    break;
  }
  
  fs.writeFileSync(fp, c);
}

var pages = [
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

pages.forEach(fixAuthInFile);
console.log('All done');
