var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=require('fs').readFileSync(fp,'utf8');
  // Replace old auth callback with unified version
  var oldAuth='window.location.hash.indexOf(\'access_token\')>=0){try{var p={};window.location.hash.slice(1).split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);localStorage.setItem(\'abi_user\',p.user_metadata&&p.user_metadata.user_name||\'User\');var exp=parseInt(p.expires_in)||3600;localStorage.setItem(\'abi_expires\',Date.now()+exp*1000);window.location.hash=\'\';}}catch(e){console.error(\'Auth callback err\',e);}}';
  var newAuth='(location.hash.indexOf(\'access_token\')>=0||location.search.indexOf(\'access_token\')>=0)){try{var raw=(location.hash||location.search).replace(/^[#?]/,\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);if(p.user_metadata){localStorage.setItem(\'abi_user\',p.user_metadata);window.location.hash=\'\';history.replaceState(null,\'\',location.pathname);location.reload();}}}catch(e){}}';
  // Also add immediate handling at top of body
  var checkStart='if(window.location.hash.indexOf(\''; // The existing code starts with this pattern
  // Actually simpler: just replace the whole block
  var oldBlock='(window.location.hash.indexOf(\'access_token\')>=0){try{var p={};window.location.hash.slice(1).split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);localStorage.setItem(\'abi_user\',p.user_metadata&&p.user_metadata.user_name||\'User\');var exp=parseInt(p.expires_in)||3600;localStorage.setItem(\'abi_expires\',Date.now()+exp*1000);window.location.hash=\'\';}}catch(e){console.error(\'Auth callback err\',e);}}';
  var newBlock='(location.hash.indexOf(\'access_token\')>=0||location.search.indexOf(\'access_token\')>=0)){try{var raw=(location.hash||location.search).replace(/^[#?]/,\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);if(p.user_metadata){localStorage.setItem(\'abi_user\',p.user_metadata);}window.location.hash=\'\';history.replaceState(null,\'\',location.pathname);location.reload();}}catch(e){}}';
  if(c.indexOf(oldBlock)>=0){
    c=c.replace(oldBlock, newBlock);
    require('fs').writeFileSync(fp,c);
    console.log(m+': auth callback updated');
  } else {
    console.log(m+': old auth block NOT FOUND');
    // Try finding it differently
    var idx=c.indexOf('access_token');
    console.log('  -> found at', idx);
    console.log('  -> context:', c.substring(idx, idx+60));
  }
});
