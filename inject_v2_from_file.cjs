const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

var jsPath = 'F:\\暗区突围网站\\map_core_v2.js';
var v2block = fs.readFileSync(jsPath, 'utf8');

function validate(code) {
  // Check bracket balance
  var op = (code.match(/\(/g)||[]).length;
  var cp = (code.match(/\)/g)||[]).length;
  var ob = (code.match(/\{/g)||[]).length;
  var cb = (code.match(/\}/g)||[]).length;
  var os = (code.match(/\[/g)||[]).length;
  var cs = (code.match(/\]/g)||[]).length;
  if (op !== cp) return false;
  if (ob !== cb) return false;
  if (os !== cs) return false;
  return true;
}

maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  var final = v2block
    .replace(/mapNameEng="MAP_ENG"/g, 'mapNameEng="' + mapEng[i] + '"')
    .replace(/mapNameCN="MAP_CN"/g, 'mapNameCN="' + mapNames[i] + '"');
  c = c.replace(/<script>([\s\S]*?)<\/script>/, '<script>\n' + final + '\n</script>');
  fs.writeFileSync(fp, c);
  if (validate(final)) { console.log(name + ': VALID'); }
  else { console.log(name + ': BRACKET MISMATCH'); }
});
console.log('Done');
