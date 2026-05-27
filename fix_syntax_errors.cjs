const fs = require('fs');

['weapons', 'strategy', 'gear'].forEach(file => {
  let c = fs.readFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, 'utf8');
  
  // Fix 1: loginGitHub stray syntax
  c = c.replace('window.location.href=u;});}', 'window.location.href=u;}');
  
  // Fix 2: function init{ -> function init(){
  c = c.replace('function init{', 'function init(){');
  
  // Fix 3: Remove duplicate OAuth handler (the second inline one)
  // Keep only the IIFE wrapper-style one
  // Find the section between the IIFE and function init
  const iifeRegex = /\/\/ OAuth callback: grab token from URL hash[\s\S]*?\(function\(\)[\s\S]*?\}\n\})\(\);\n\nfunction init\(\)\{/;
  const afterIife = /\(function\(\)[\s\S]*?\n\})\(\);\n\nfunction init\(\)\{/;
  
  // Actually just remove the old inline handler completely
  // The handler between loginGitHub() and fabOpenPostForm
  c = c.replace(`  // OAuth callback handler
  var h=window.location.hash||window.location.search;
  if(h.includes('access_token=')){
    var params=new URLSearchParams(h.replace('#','').replace('?',''));
    var t=params.get('access_token');
    if(t){localStorage.setItem('abi_token',t);localStorage.setItem('abi_user',params.get('email')||params.get('user_name')||'');window.location.hash='';window.location.search='';}
  }`, '');
  
  // Remove the full IIFE duplicate OAuth handler
  // But keep the IIFE for initAuth
  // Actually let's just clean the entire area between fabOpenPostForm and function init
  c = c.replace(/\n\/\/ OAuth callback[\s\S]*?\n\})\(\);\n/, '\n');
  
  // Clean up any stray empty newlines
  c = c.replace(/\n\n\n/g, '\n\n');
  
  fs.writeFileSync(`F:\\暗区突围网站\\pages\\${file}.html`, c);
  console.log(`${file}: fixed`);
});
