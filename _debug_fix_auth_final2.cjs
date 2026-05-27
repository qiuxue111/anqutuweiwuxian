var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=require('fs').readFileSync(fp,'utf8');
  // Find and replace the broken auth block (missing if keyword)
  var start=c.indexOf('(window.location.hash.indexOf(\'access_token\')');
  if(start<0){console.log(m+': AUTH NOT FOUND');return;}
  var end=c.indexOf('}}catch(e){}}');
  if(end<0){console.log(m+': end NOT FOUND');return;}
  end='}}catch(e){}}'.length+2;
  var oldBlock=c.substring(start, end);
  var newBlock='if(window.location.hash.indexOf(\'access_token\')>=0||window.location.search.indexOf(\'access_token\')>=0){try{var raw=(window.location.hash||window.location.search).replace(/^[#?]/,\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);localStorage.setItem(\'abi_user\',JSON.stringify(p));history.replaceState(null,\'\',window.location.pathname);window.location.reload();}}catch(e){}}';
  c=c.replace(oldBlock, newBlock);
  require('fs').writeFileSync(fp,c);
  console.log(m+': DONE');
});
