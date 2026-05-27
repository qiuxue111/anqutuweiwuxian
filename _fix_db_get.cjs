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
  
  // Find the db function and replace it with conditional auth
  var st = c.indexOf('function db(');
  if(st<0){ console.log(f.name+': no db()'); return; }
  var end = c.indexOf('}', st) + 1;
  var oldDb = c.substring(st, end);
  
  // Build new db function: GET uses anon, POST/PATCH uses token
  var newDb = 'function db(method,table,body,query){\n' +
    '  var token=(method===\'GET\'||!body)?SUPABASE_ANON:(localStorage.getItem(\'abi_token\')||SUPABASE_ANON);\n' +
    '  return fetch(SUPABASE_URL+\'/rest/v1/\'+table+(query?\'?\'+query:\'\'),{\n' +
    '    method:method,\n' +
    '    headers:{\'Authorization\':\'Bearer \'+token,\'apiKey\':SUPABASE_ANON,\'Content-Type\':\'application/json\',\'Prefer\':\'return=minimal\'},\n' +
    '    body:body?JSON.stringify(body):null\n' +
    '  });\n' +
    '}';
  
  c = c.replace(oldDb, newDb);
  fs.writeFileSync(fp, c, 'utf8');
  
  // Verify
  var ms=c.match(/<script>[\s\S]*?<\/script>/g);
  if(ms&&ms[0]){
    try{new Function(ms[0].replace(/<\/?script>/g,''));console.log(f.name+': OK');}
    catch(e){console.log(f.name+': FAIL - '+e.message);}
  }
});
