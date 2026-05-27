var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  // Find auth callback block: from ".indexOf('access_token') to the first }}catch
  var start=c.indexOf('".indexOf(\'access_token\')');
  if(start<0){console.log(m+': NOT FOUND');return;}
  // Find the end of this IIFE wrapper (the } catch {...} } pattern)
  var end=c.indexOf('}}catch(e){console.error(\'', start);
  if(end<0){console.log(m+': end NOT FOUND');return;}
  end+=2; // include the }} 
  var oldBlock=c.substring(start, end); // .indexOf('access_token')...}}
  var newBlock='(location.hash.indexOf(\'access_token\')>=0||location.search.indexOf(\'access_token\')>=0)){try{var raw=(location.hash||location.search).replace(/^[#?]/,\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);if(p.user_metadata){try{localStorage.setItem(\'abi_user\',JSON.stringify(JSON.parse(atob(p.access_token.split(\'.\')[1].replace(/-/g,\'+\').replace(/_/g,\'/\')))));}catch(e){localStorage.setItem(\'abi_user\',p.user_metadata);}}window.location.hash=\'\';history.replaceState(null,\'\',location.pathname);location.reload();}}catch(e){}}';
  c=c.replace(oldBlock, newBlock);
  fs.writeFileSync(fp,c);
  console.log(m+': OK');
});
console.log('DONE');
