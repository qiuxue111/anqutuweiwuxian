const fs = require('fs');

const authPrefix = `
(function authCheck(){
  var h=window.location.hash;
  if(h&&h.includes('access_token=')){
    var p=new URLSearchParams(h.replace('#',''));
    var t=p.get('access_token');
    if(t){
      try{
        var payload=JSON.parse(atob(t.split('.')[1]));
        var user=payload.email||p.get('email')||'';
        localStorage.setItem('abi_token',t);
        localStorage.setItem('abi_user',user);
        history.replaceState(null,'',window.location.pathname);
        location.reload();
      }catch(err){}
    }
  }
  var token=localStorage.getItem('abi_token');
  if(token){
    var btns=document.querySelectorAll('#loginBtn');
    for(var i=0;i<btns.length;i++){btns[i].style.display='none';}
  }
})();
`;

const pages = [
  'F:\\暗区突围网站\\index.html',
  'F:\\暗区突围网站\\search.html',
  'F:\\暗区突围网站\\pages\\maps.html',
  'F:\\暗区突围网站\\pages\\weapons.html',
  'F:\\暗区突围网站\\pages\\strategy.html',
  'F:\\暗区突围网站\\pages\\gear.html',
  'F:\\暗区突围网站\\pages\\map-farm.html',
  'F:\\暗区突围网站\\pages\\map-beishan.html',
  'F:\\暗区突围网站\\pages\\map-valley.html',
  'F:\\暗区突围网站\\pages\\map-armory.html',
  'F:\\暗区突围网站\\pages\\map-airport.html',
  'F:\\暗区突围网站\\pages\\map-tvstation.html',
  'F:\\暗区突围网站\\pages\\map-editor.html',
];

pages.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  let c = fs.readFileSync(fp, 'utf8');
  
  // Remove any existing authCheck or IIFE handlers
  const lines = c.split('\n');
  const kept = [];
  let skipDepth = 0;
  let inAuthCheck = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip authCheck IIFE
    if (line.includes('function authCheck') || line.includes('// Check for OAuth') || line.includes('// OAuth callback')) {
      inAuthCheck = true;
      skipDepth = 1;
      continue;
    }
    if (inAuthCheck) {
      // Count braces to find end of IIFE
      for (let j = 0; j < line.length; j++) {
        if (line[j] === '{' || line[j] === '(') skipDepth++;
        if (line[j] === '}' || line[j] === ')') skipDepth--;
      }
      if (skipDepth <= 0) { inAuthCheck = false; }
      continue;
    }
    
    // Skip old access_token IIFEs (lines that start with (function() and contain access_token)
    if (line.includes('(function()') && 
        (lines[i+1] ? lines[i+1].includes('access_token') : false)) {
      let depth = 1;
      for (let k = i; k < lines.length; k++) {
        for (let j = 0; j < lines[k].length; j++) {
          if (lines[k][j] === '(') depth++;
          if (lines[k][j] === ')') depth--;
        }
        if (depth <= 0) { i = k; break; }
      }
      continue;
    }
    
    kept.push(line);
  }
  
  c = kept.join('\n');
  
  // Insert authPrefix right after <script>
  const scriptTag = '<script>';
  const idx = c.indexOf(scriptTag);
  if (idx >= 0) {
    c = c.substring(0, idx + scriptTag.length) + authPrefix + c.substring(idx + scriptTag.length);
  }
  
  // Remove duplicate loginGitHub if any
  const first = c.indexOf('function loginGitHub(');
  const second = c.indexOf('function loginGitHub(', first + 10);
  if (second > 0) {
    // Find end of first function (the one we keep)
    // Actually keep the first occurrence, remove the second
    const fnEnd = c.indexOf('\n', c.indexOf('}', second)) + 1;
    if (fnEnd > second) {
      c = c.substring(0, second) + c.substring(fnEnd);
    }
  }
  
  fs.writeFileSync(fp, c);
  console.log(fp.replace('F:\\暗区突围网站\\', ''));
});

// Validate
console.log('\nValidating...');
pages.forEach(fp => {
  if (!fs.existsSync(fp)) return;
  const c = fs.readFileSync(fp, 'utf8');
  const scripts = c.match(/<script>([\s\S]*?)<\/script>/g) || [];
  scripts.forEach(s => {
    try { new Function(s.replace('<script>','').replace('</script>','')); }
    catch(e) { console.log(fp.replace('F:\\暗区突围网站\\', '') + ': ' + e.message.substring(0,60)); }
  });
});

console.log('\nDone');
