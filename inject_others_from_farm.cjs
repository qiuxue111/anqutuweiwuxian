const fs = require('fs');
const root = 'F:\\暗区突围网站';
const maps = ['map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['beishan','valley','armory','airport','tvstation'];

// Read the core inject code from farm (which is valid)
var farmContent = fs.readFileSync(root + '\\pages\\map-farm.html', 'utf8');
var farmMatch = farmContent.match(/<script>([\s\S]*?)<\/script>/);
if (!farmMatch) { console.log('ERROR: cant read farm script'); process.exit(1); }
var farmScript = farmMatch[1];

// Find the injection section - everything after the original supabase/renderMarkers
var injectionStart = farmScript.indexOf('// ===== 地图核心交互 v2 =====');
if (injectionStart < 0) { console.log('ERROR: no injection marker in farm'); process.exit(1); }
var injectCode = farmScript.substring(injectionStart);

maps.forEach(function(name, i) {
  var fp = root + '\\pages\\' + name + '.html';
  if (!fs.existsSync(fp)) { console.log(name + ': not found'); return; }
  var c = fs.readFileSync(fp, 'utf8');
  
  var replaced = injectCode
    .replace(/mapNameEng='farm'/g, "mapNameEng='" + mapEng[i] + "'")
    .replace(/mapNameCN='农场'/g, "mapNameCN='" + mapNames[i] + "'");
  
  var scriptEnd = c.lastIndexOf('</script>');
  if (scriptEnd < 0) { console.log(name + ': no script'); return; }
  
  c = c.substring(0, scriptEnd) + '\n' + replaced + '\n' + c.substring(scriptEnd);
  fs.writeFileSync(fp, c);
  console.log(name + ': injected');
});

console.log('All done');
