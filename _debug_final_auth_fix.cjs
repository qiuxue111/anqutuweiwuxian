var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=require('fs').readFileSync(fp,'utf8');
  // Find the entire broken auth block and replace
  var start=c.indexOf('if(window.location.hash.indexOf(\'access_token\')');
  if(start<0) start=c.indexOf('(window.location.hash.indexOf(\'access_token\')');
  if(start<0) start=c.indexOf('location.hash.indexOf(\'access_token\')');
  if(start<0){console.log(m+': AUTH NOT FOUND');return;}
  // Find the }} catch pattern that follows
  var end=c.indexOf('}}catch(e)', start);
  end=c.indexOf(';', c.indexOf('}}catch(e)', end+5)+5)+1; // skip past console.error
  if(end<5){console.log(m+': end not found');return;}
  var oldBlock=c.substring(start, end);
  // Simple clean auth block
  var newBlock="(window.location.hash.indexOf('access_token')>=0||window.location.search.indexOf('access_token')>=0)){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/,''),p={};raw.split('&').forEach(function(s){var kv=s.split('=');p[kv[0]]=decodeURIComponent(kv[1]||'');});if(p.access_token){localStorage.setItem('abi_token',p.access_token);localStorage.setItem('abi_user',p.user_metadata||'User');history.replaceState(null,'',window.location.pathname);window.location.reload();}}catch(e){}}";
  c=c.replace(oldBlock, newBlock);
  require('fs').writeFileSync(fp,c);
  console.log(m+': FIXED');
});
