var fs=require('fs');
var files = [
  {loc: 'pages', name: 'gear.html'},
  {loc: 'pages', name: 'strategy.html'},
  {loc: 'pages', name: 'weapons.html'},
  {loc: 'pages', name: 'maps.html'},
  {loc: '', name: 'search.html'}
];

files.forEach(function(f){
  var fp = 'F:/暗区突围网站/' + f.loc + '/' + f.name;
  var c = fs.readFileSync(fp, 'utf8');
  
  // Replace the single Authorization line: GET uses anon, write uses token
  var oldLine = "'Authorization':'Bearer '+(localStorage.getItem('abi_token')||SUPABASE_ANON)";
  var newLine = "'Authorization':'Bearer '+(method==='GET'?SUPABASE_ANON:localStorage.getItem('abi_token')||SUPABASE_ANON)";
  
  if(c.indexOf(oldLine)>=0){
    c = c.replace(oldLine, newLine);
    fs.writeFileSync(fp, c, 'utf8');
    
    // Verify
    var ms=c.match(/<script>[\s\S]*?<\/script>/g);
    if(ms&&ms[0]){
      try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(f.name+': OK');}
      catch(e){console.log(f.name+': FAIL - '+e.message);}
    }
  } else {
    console.log(f.name+': line not found');
    // Check current state
    var st = c.indexOf('Authorization');
    console.log('  Current:', c.substring(st, st+100));
  }
});
