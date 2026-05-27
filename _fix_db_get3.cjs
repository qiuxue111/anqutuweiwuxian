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
  
  // Fix the db function: GET with anon, write with token
  var oldToken = "var token=(method==='GET'||!body)?SUPABASE_ANON:(localStorage.getItem('abi_token')||SUPABASE_ANON);";
  var newToken = "var token=method==='GET'?SUPABASE_ANON:(localStorage.getItem('abi_token')||SUPABASE_ANON);";
  
  if(c.indexOf(oldToken)>=0){
    c = c.replace(oldToken, newToken);
    fs.writeFileSync(fp, c, 'utf8');
    console.log(f.name+': FIXED');
  } else {
    console.log(f.name+': pattern not found');
    // Check what's there
    var st = c.indexOf('function db(');
    if(st>=0){
      var end = c.indexOf('}', st) + 1;
      console.log('  db():', c.substring(st, end));
    }
  }
  
  // Verify
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log('  PARSE OK');}
    catch(e){console.log('  PARSE FAIL - '+e.message);}
  }
});
