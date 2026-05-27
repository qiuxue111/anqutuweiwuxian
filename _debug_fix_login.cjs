var maps=['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
maps.forEach(function(m){
  var fp='F:\\暗区突围网站\\pages\\'+m+'.html';
  var c=require('fs').readFileSync(fp,'utf8');
  // Replace loginGitHub to redirect to index.html
  var old='loginGitHub(){window.location.href=\'https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to=\'+encodeURIComponent(window.location.origin+window.location.pathname);}';
  var nu='loginGitHub(){window.location.href=\'https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to=\'+encodeURIComponent(window.location.origin+\'/anqutuweiwuxian/index.html\');}';
  // But for localhost, use current path
  var nuv2='loginGitHub(){var isLocal=window.location.hostname===\'localhost\'||window.location.hostname===\'127.0.0.1\';var u=\'https://hanrfbciinkhgcumvous.supabase.co/auth/v1/authorize?provider=github&redirect_to=\'+encodeURIComponent(isLocal?window.location.origin+\'/index.html\':window.location.origin+\'/anqutuweiwuxian/index.html\');window.location.href=u;}';
  if(c.indexOf(old)>=0){
    c=c.replace(old, nuv2);
    require('fs').writeFileSync(fp,c);
    console.log(m+': loginGitHub updated');
  } else {
    // Try finding the pattern differently
    var idx=c.indexOf('loginGitHub');
    if(idx>=0){
      console.log(m+': loginGitHub found at', idx, '- different pattern');
      console.log('  ->', c.substring(idx, idx+220));
    } else {
      console.log(m+': loginGitHub NOT FOUND');
    }
  }
});
