const fs = require('fs');
const maps = ['map-farm','map-beishan','map-valley','map-armory','map-airport','map-tvstation'];
const mapNames = ['农场','北山','山谷','军械库','电视台','阿贾克斯港口'];
const mapEng = ['farm','beishan','valley','armory','airport','tvstation'];

// 直接读取 gen_v2_js.cjs 生成的 map_core_v2.js（已经包含数据+函数，无压缩处理）
var js = fs.readFileSync('F:\\暗区突围网站\\map_core_v2.js', 'utf8');

maps.forEach(function(name, i) {
  var fp = 'F:\\暗区突围网站\\pages\\' + name + '.html';
  var c = fs.readFileSync(fp, 'utf8');
  // 替换占位符
  var final = js
    .replace(/mapNameEng="MAP_ENG"/g, 'mapNameEng="' + mapEng[i] + '"')
    .replace(/mapNameCN="MAP_CN"/g, 'mapNameCN="' + mapNames[i] + '"');
  c = c.replace(/<script>[\s\S]*?<\/script>/, '<script>\n' + final + '\n</script>');
  fs.writeFileSync(fp, c);
  console.log(name + ': ' + (final.match(/\(/g)||[]).length + '=' + (final.match(/\)/g)||[]).length + ' ' + (final.match(/\{/g)||[]).length + '=' + (final.match(/\}/g)||[]).length + ' OK');
});
console.log('Done');
