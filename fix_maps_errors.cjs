const fs = require('fs');
let c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');

// Fix 1: loginGitHub syntax error
c = c.replace('window.location.href=u;});}', 'window.location.href=u;}');

// Fix 2: supa() should always use anon key (no token check)
c = c.replace(`function supa(method,table,body,q){
  var token=localStorage.getItem('abi_token');
  var anonKey=`,
  `function supa(method,table,body,q){
  var anonKey=`);

// Remove the token check code
c = c.replace(`
  var bearer=anonKey;
  if(token){try{var p=JSON.parse(atob(token.split('.')[1]));if(p.exp&&p.exp*1000>Date.now())bearer=token;}catch(e){}}`,
  `
  var bearer=anonKey;`);

// Also update the initAuth to use our unified OAuth handler
// (it already has one)

fs.writeFileSync('F:\\暗区突围网站\\pages\\maps.html', c);
console.log('maps.html fixed');
