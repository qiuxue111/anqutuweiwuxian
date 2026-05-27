var fs=require('fs');
var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=fs.readFileSync(fp,'utf8');
  var start=c.indexOf('.indexOf(\'access_token\')');
  if(start<0){console.log(m+': NOT FOUND');return;}
  var end=c.indexOf('}}catch(e)', start);
  end=c.indexOf('}', end+1)+1;
  
  var oldBlock=c.substring(start, end);
  var newBlock='(location.hash.indexOf(\'access_token\')>=0||location.search.indexOf(\'access_token\')>=0)){try{var raw=(location.hash||location.search).replace(/^[#?]/\',\'\'),p={};raw.split(\'&\').forEach(function(s){var kv=s.split(\'=\');p[kv[0]]=decodeURIComponent(kv[1]||\'\');});if(p.access_token){localStorage.setItem(\'abi_token\',p.access_token);if(p.user_metadata){try{localStorage.setItem(\'abi_user\',JSON.stringify(JSON.parse(atob(p.access_token.split(\'.\')[1].replace(/-/g,\'+\').replace(/_/g,\'/\')))));}catch(e){localStorage.setItem(\'abi_user\',p.user_metadata);}}window.location.hash=\'\';history.replaceState(null,\'\',location.pathname);location.reload();}}catch(e){}}';
  c=c.replace(oldBlock, newBlock);
  // Add checkReviewBtn call after auth handling
  var checkPos=c.indexOf('checkReviewBtn()');
  if(checkPos<0){
    // Add it in the existing init block
    var scPos=c.lastIndexOf('</script>');
    c=c.substring(0, scPos) + 'setTimeout(function(){checkReviewBtn();},500);\n' + c.substring(scPos);
  }
  fs.writeFileSync(fp,c);
  console.log(m+': OK ('+oldBlock.length+' -> '+newBlock.length+')');
});
console.log('DONE');
