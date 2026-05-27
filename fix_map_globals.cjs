const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];

var fixed = 0;
maps.forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  
  // Find the supabase() function definition and add SUPABASE_URL/KEY as global before it
  var supIdx = c.indexOf('function supabase(');
  if (supIdx < 0) {
    console.log(name + ': no supabase func?');
    return;
  }
  
  // Check if SUPABASE_URL is already global (not inside a block)
  var beforeSup = c.substring(0, supIdx);
  var lastIIFE = beforeSup.lastIndexOf('(function(){');
  
  // Find the place right before supabase function
  var insertAt = supIdx;
  
  // Check if there's a var/const/let SUPABASE_URL already before it
  var hasGlobalUrl = beforeSup.indexOf('var SUPABASE_URL') >= 0 || beforeSup.indexOf('const SUPABASE_URL') >= 0;
  
  if (!hasGlobalUrl) {
    // Find the nearest line break before function supabase to insert globals
    var lineStart = c.lastIndexOf('\n', supIdx - 2);
    if (lineStart < 0) lineStart = 0;
    
    var globals = 'var SUPABASE_URL="https://hanrfbciinkhgcumvous.supabase.co";\nvar SUPABASE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhbnJmYmNpaW5raGdjdW12b3VzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk4MTA4ODAsImV4cCI6MjA5NTM4Njg4MH0.Q7JBpwAqpYbEpwLq7werjtAtgjU4pIcHg4JbwFZ2vok";\n';
    c = c.substring(0, lineStart + 1) + globals + c.substring(lineStart + 1);
    console.log(name + ': added globals');
    fixed++;
  } else {
    console.log(name + ': already has globals');
  }
  
  fs.writeFileSync(fp, c);
});

console.log('Fixed ' + fixed + ' pages');
