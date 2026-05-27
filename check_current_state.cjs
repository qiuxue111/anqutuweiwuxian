const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
var m = s.match(/<script>([\s\S]*?)<\/script>/);
if (m) {
  var script = m[1];
  // Find zoom function
  var idx = script.indexOf('function zoom(f,cx,cy)');
  if (idx >= 0) console.log('Zoom:', script.substring(idx, idx+600));
  
  // Find showPicker / mode toggle
  var idx2 = script.indexOf('function toggleMode');
  if (idx2 >= 0) console.log('\nToggleMode:', script.substring(idx2, idx2+400));
  
  // Find layer data
  var idx3 = script.indexOf('var layerData');
  if (idx3 >= 0) console.log('\nLayerData:', script.substring(idx3, idx3+200));
  
  // Find renderLayers
  var idx4 = script.indexOf('function renderLayers');
  if (idx4 >= 0) console.log('\nRenderLayers:', script.substring(idx4, idx4+500));
  
  // Find the zoom buttons
  var plusIdx = script.indexOf('id=\"zp\"');
  var minusIdx = script.indexOf('id=\"zm\"');
  console.log('\nzp button at:', plusIdx >= 0 ? 'found' : 'not found');
  console.log('zm button at:', minusIdx >= 0 ? 'found' : 'not found');
  
  // Check zoom button handlers
  if (plusIdx >= 0) {
    var afterPlus = script.substring(plusIdx, plusIdx+200);
    console.log('Around zp:', afterPlus);
  }
}
