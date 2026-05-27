var fs=require('fs');
var files = ['maps.html','gear.html','strategy.html','weapons.html','search.html'];
var base = 'F:/暗区突围网站/';

// Check all files
var allOK = true;
files.forEach(function(f){
  var fp = base + (f==='search.html'?'':'pages/') + f;
  var c = fs.readFileSync(fp, 'utf8');
  var ms = c.match(/<script>[\s\S]*?<\/script>/g);
  if(!ms || !ms[0]) { console.log(f+': no script'); return; }
  try {
    new Function(ms[0].replace(/<\/?script>/g,''));
    console.log(f+': PARSE OK');
  } catch(e) {
    console.log(f+': PARSE FAIL -', e.message);
    allOK = false;
  }
  // Check: does the script contain ANY path that shows raw abi_user?
  var s = ms[0].replace(/<\/?script>/g,'');
  var bare = s.match(/textContent\s*=\s*(localStorage\.getItem\('abi_user'\)|getUserName\(\))/);
  if(bare) {
    if(bare[1].indexOf('getUserName')>=0) {
      console.log('  textContent: getUserName() ✓');
    } else {
      console.log('  textContent: localStorage raw ✗');
      allOK = false;
    }
  }
  // Check: does the IIFE call normalizeUser?
  if(s.indexOf('normalizeUser()')>=0) console.log('  normalizeUser(): called ✓');
  else console.log('  normalizeUser(): NOT called ✗');
});

// Also check index.html and map-farm.html
['index.html','pages/map-farm.html','pages/map-editor.html'].forEach(function(f){
  var fp = base + f;
  var c = fs.readFileSync(fp, 'utf8');
  var hasNU = c.indexOf('normalizeUser')>=0;
  var hasGU = c.indexOf('getUserName')>=0;
  var hasBare = c.indexOf('textContent=localStorage')>=0;
  var hasHref = c.indexOf("location.href=window.location.pathname")>=0 || c.indexOf("location.href=location.pathname")>=0;
  console.log(f+': normalizeUser='+hasNU+' getUserName='+hasGU+' bare='+hasBare+' href='+hasHref);
});

if(allOK) console.log('\nAll checks passed');
