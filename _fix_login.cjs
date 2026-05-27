var fs=require('fs');

// Fix review.html loginGit
var rev=fs.readFileSync('F:/暗区突围网站/pages/review.html','utf8');
var idx=rev.indexOf('function loginGit');
if(idx>=0){
  var end=rev.indexOf('}',idx)+1;
  var old=rev.substring(idx,end);
  var newLogin='function loginGit(){var p=window.location.pathname;var i=p.lastIndexOf("/pages/");var cb=window.location.origin+(i>=0?p.substring(0,i+1)+"index.html":p.replace(/index\\.html$/,"")+"index.html");window.location.href=SUPABASE_URL+"/auth/v1/authorize?provider=github&redirect_to="+encodeURIComponent(cb);}';
  rev=rev.replace(old,newLogin);
  fs.writeFileSync('F:/暗区突围网站/pages/review.html',rev,'utf8');
  console.log('review.html: loginGit FIXED');
} else {
  console.log('review.html: loginGit NOT FOUND');
}

// Fix index.html abi_user storage to be compatible
var idx=fs.readFileSync('F:/暗区突围网站/index.html','utf8');
// Check abi_user storage format
if(idx.indexOf("localStorage.setItem('abi_user',JSON.stringify(JSON.parse(atob(b64)))")>=0){
  console.log('index.html: abi_user format looks OK (JSON encode)');
}

// Verify all 3 places have consistent loginGitHub redirect logic
var sites=[{f:'/pages/map-farm.html',l:'_mod01_basics.cjs'},{f:'/index.html',l:'index.html'},{f:'/pages/review.html',l:'review.html'}];
sites.forEach(function(site){
  var c=fs.readFileSync('F:/暗区突围网站'+site.f,'utf8');
  var idx=site.l==='_mod01_basics.cjs'?c.indexOf('function loginGitHub'):c.indexOf('function loginGit');
  if(idx>=0){
    var end=c.indexOf('}',idx)+1;
    console.log(site.l+': login function found at', idx);
  } else {
    console.log(site.l+': NOT FOUND');
  }
});

console.log('DONE');
