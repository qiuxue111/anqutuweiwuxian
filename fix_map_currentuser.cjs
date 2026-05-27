const fs = require('fs');
const root = 'F:\\暗区突围网站';

['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'].forEach(function(name) {
  var fp = root + '\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  
  // Replace currentUser check with localStorage check
  c = c.replace(/if\(!currentUser\)\{login\(\);return;\}/g, "if(!localStorage.getItem('abi_token')){loginGitHub();return;}");
  c = c.replace(/if\(!currentUser\)return;/g, "if(!localStorage.getItem('abi_token'))return;");
  
  // Also add a var currentUser = localStorage.getItem('abi_user') for any remaining references
  // Find the first function that uses currentUser and add the declaration above it
  var lines = c.split('\n');
  for (var i = 0; i < lines.length; i++) {
    if (lines[i].indexOf('currentUser') >= 0 && lines[i].indexOf('function') < 0) {
      // Check if there's a var declaration for currentUser anywhere
      if (c.indexOf('var currentUser') < 0 && c.indexOf('localStorage') < 0) {
        // Add var currentUser = localStorage... before this line
        c = c.replace(lines[i], "  var currentUser = localStorage.getItem('abi_user')||null;\n" + lines[i]);
      }
      break;
    }
  }
  
  // Remove the old var currentUser=null, currentToken=null from the script
  c = c.replace(/var currentUser=null, currentToken=null;/g, '');
  c = c.replace(/var currentUser=null;/g, '');
  c = c.replace(/var currentToken=null;/g, '');
  
  fs.writeFileSync(fp, c);
  console.log(name + ': fixed currentUser refs');
});
