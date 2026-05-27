var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  // First dedup: find first occurrence and last occurrence of the same auth block
  var dedup='if(window.location.hash.indexOf(\'access_token\')>=0||window.location.search.indexOf(\'access_token\')>=0){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/,\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);localStorage.setItem(\'abi_user\',JSON.stringify(p));history.replaceState(null,\'\',window.location.pathname);window.location.reload();}}catch(e){}}';
  var dedup2='(window.location.hash.indexOf(\'access_token\')>=0||window.location.search.indexOf(\'access_token\')>=0)){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/,\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);localStorage.setItem(\'abi_user\',p.user_metadata||\'User\');history.replaceState(null,\'\',window.location.pathname);window.location.reload();}}catch(e){}}';
  var first=c.indexOf(dedup);
  var sameClose=c.indexOf('}}catch(e){}}', first+dedup.length);
  if(sameClose>0){
    // There's a second copy, remove it
    c=c.substring(0, first+dedup.length) + c.substring(sameClose+2);
    console.log(m+': REMOVED SECOND COPY');
  }
  // Also remove dedup2 remnants
  if(dedup2.length>0){
    var idx2=c.indexOf(dedup2);
    if(idx2>=0){
      c=c.replace(dedup2, '');
      console.log(m+': CLEANED dedup2');
    }
  }
  fs.writeFileSync(fp,c);
});
console.log('DONE');
