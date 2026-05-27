const fs = require('fs');
const exec = require('child_process').execSync;
const root = 'F:\\暗区突围网站';

const scripts = {};

// Extract supa function from git history for each map page
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];

maps.forEach(function(name) {
  var cmd = 'git -C "' + root + '" show HEAD~5:pages/' + name + '.html';
  try {
    var content = exec(cmd, {encoding:'utf8', shell:'cmd.exe'});
    var sIdx = content.indexOf('function');
    // Find the start of the map-specific code (after auth/before closing)
    // Look for functions like supabase, supabase2, loadPins, addPin etc
    var startMarkers = ['function supabase', 'function supabase2', 'function loadPins', 'function refreshPins', 'function loadComments'];
    var startIdx = -1;
    startMarkers.forEach(function(m) {
      var i = content.indexOf(m);
      if (i >= 0 && (startIdx < 0 || i < startIdx)) startIdx = i;
    });
    
    if (startIdx < 0) {
      // Fallback: find all functions between auth code and closing script
      var authEnd = content.indexOf('})();', content.indexOf('function loginGitHub'));
      if (authEnd < 0) authEnd = content.indexOf('})();', content.indexOf('initAuth'));
      if (authEnd < 0) authEnd = content.indexOf('<script>') + 8;
      startIdx = content.indexOf('\nfunction', authEnd + 10);
    }
    
    if (startIdx < 0) {
      console.log(name + ': could not find supabase functions');
      return;
    }
    
    // Find the closing script tag
    var endIdx = content.indexOf('</script>', startIdx);
    if (endIdx < 0) {
      console.log(name + ': could not find script end');
      return;
    }
    
    var mapFunctions = content.substring(startIdx, endIdx).trim();
    scripts[name] = mapFunctions;
    console.log(name + ': extracted ' + mapFunctions.length + ' bytes');
    
  } catch(e) {
    console.log(name + ': git error - ' + e.message.substring(0,60));
  }
});

// Now inject back into current files
maps.forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) { console.log(name + ': file not found'); return; }
  var c = fs.readFileSync(fp, 'utf8');
  
  // Find the script and append mapFunctions before closing tag
  if (!scripts[name]) return;
  
  var scriptEnd = c.indexOf('</script>');
  if (scriptEnd >= 0) {
    c = c.substring(0, scriptEnd) + '\n' + scripts[name] + '\n' + c.substring(scriptEnd);
  }
  
  // Also need to fix: functions that reference old global vars like currentUser, currentToken
  // They should use localStorage directly or the supa function should call initAuth
  
  fs.writeFileSync(fp, c);
  console.log(name + ': injected');
});

// Validate
console.log('\nValidating...');
maps.forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var scriptsTag = c.match(/<script>([\s\S]*?)<\/script>/g);
  if (scriptsTag) scriptsTag.forEach(function(s) {
    try { new Function(s.replace('<script>','').replace('<\/script>','')); }
    catch(e) { console.log(name + ': ERROR - ' + e.message.substring(0,80)); }
  });
});

console.log('\nDone');
