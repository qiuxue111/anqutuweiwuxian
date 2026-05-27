var fs=require('fs');
var files = [
  {loc: 'pages', name: 'gear.html', fixed: false},
  {loc: 'pages', name: 'strategy.html', fixed: false},
  {loc: 'pages', name: 'weapons.html', fixed: false},
  {loc: 'pages', name: 'maps.html', fixed: false},
  {loc: '', name: 'search.html', fixed: false}
];

files.forEach(function(f){
  var fp = 'F:/暗区突围网站/' + f.loc + '/' + f.name;
  var c = fs.readFileSync(fp, 'utf8');
  
  // 1. Fix db() function: use auth token for Bearer
  var oldDb = "headers:{'Authorization':'Bearer '+SUPABASE_ANON,'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}";
  var newDb = "headers:{'Authorization':'Bearer '+(localStorage.getItem('abi_token')||SUPABASE_ANON),'apiKey':SUPABASE_ANON,'Content-Type':'application/json','Prefer':'return=minimal'}";
  if(c.indexOf(oldDb)>=0){
    c=c.replace(oldDb, newDb);
    f.fixed = true;
    console.log(f.name+': db() FIXED');
  } else {
    console.log(f.name+': db() not found - checking for existing fix');
    if(c.indexOf(newDb)>=0) console.log('  already fixed');
  }
  
  // 2. Fix author: use getUserName instead of raw localStorage
  var oldAuthor = "author:localStorage.getItem('abi_user')||'匿名'";
  var newAuthor = "author:getUserName()||'匿名'";
  if(c.indexOf(oldAuthor)>=0){
    c=c.replace(oldAuthor, newAuthor);
    f.fixed = true;
    console.log(f.name+': author FIXED');
  } else if(c.indexOf(newAuthor)>=0){
    console.log(f.name+': author already fixed');
  } else {
    console.log(f.name+': no author field found');
  }
  
  if(f.fixed){
    fs.writeFileSync(fp, c, 'utf8');
    // Verify JS
    var ms=c.match(/<script>[\s\S]*?<\/script>/g);
    if(ms&&ms[0]){
      try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(f.name+': PARSE OK');}
      catch(e){console.log(f.name+': PARSE FAIL - '+e.message);}
    }
  }
});
