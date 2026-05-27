const fs = require('fs');
var c = fs.readFileSync('F:\\temp_check.html', 'utf8');
var idx = c.indexOf('chooseContainer');
if (idx >= 0) {
  console.log(c.substring(idx, idx + 2000));
} else {
  console.log('No chooseContainer in old version');
  // Try to find container type list
  var types = c.match(/普通物资箱|高级物资箱|子弹箱|医疗箱|工具箱|文件柜|大衣|抽屉|保险箱|旅行箱|运动包|专业军备箱|大型武器箱|手雷箱|战术配件箱/g);
  if (types) console.log('Found types:', [...new Set(types)]);
  // Try to find layer data
  var layerIdx = c.indexOf('Layers') >= 0 ? c.indexOf('Layers') : c.indexOf('layers');
  if (layerIdx >= 0) console.log(c.substring(layerIdx, layerIdx + 1000));
  else console.log('No layer data found');
}
