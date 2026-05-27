var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=require('fs').readFileSync(fp,'utf8');
  
  // Fix broken auth callback: replace the broken block with clean version
  var broken='if(window.location.hash&&window.location.hash(location.hash.indexOf(\'access_token\')>=0||location.search.indexOf(\'access_token\')>=0)){try{var raw=(location.hash||location.search).replace(/^[#?]/','\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);if(p.user_metadata){try{localStorage.setItem(\'abi_user\',JSON.stringify(JSON.parse(atob(p.access_token.split(\'.\')[1].replace(/-/g,\'+\').replace(/_/g,\'/\')))));}catch(e){localStorage.setItem(\'abi_user\',p.user_metadata);}}window.location.hash=\'\';history.replaceState(null,\'\',location.pathname);location.reload();}}catch(e){}}';
  var fixed='(window.location.hash.indexOf(\'access_token\')>=0||window.location.search.indexOf(\'access_token\')>=0)){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/\',\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);if(p.user_metadata){try{var b64=p.access_token.split(\'.\')[1];b64=b64.replace(/-/g,\'+\').replace(/_/g,\'/\');while(b64.length%4)b64+=\'=\';var j=JSON.parse(atob(b64));localStorage.setItem(\'abi_user\',JSON.stringify(j));}catch(e){localStorage.setItem(\'abi_user\',p.user_metadata);}}window.location.hash=\'\';window.location.search=\'\';if(window.history.replaceState)window.history.replaceState(null,\'\',window.location.pathname);window.location.reload();}}catch(e){}}';
  
  if(c.indexOf(broken)>=0){
    c=c.replace(broken, fixed);
    console.log(m+': REPLACED');
  } else {
    console.log(m+': broken block NOT FOUND, checking current state');
    // Check what the auth block looks like now
    var idx=c.indexOf('access_token');
    if(idx>=0) console.log('  current:', c.substring(idx-30, idx+60));
  }
  require('fs').writeFileSync(fp,c);
});
