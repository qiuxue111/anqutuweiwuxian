const fs = require('fs');
var s = fs.readFileSync('F:\\暗区突围网站\\pages\\map-farm.html', 'utf8');
// Find map container structure
var lines = s.split('\n');
var inMap = false;
for (var i = 0; i < lines.length; i++) {
  if (lines[i].includes('map-wrap') || lines[i].includes('class="mv"') || lines[i].includes('id="mv"') || 
      lines[i].includes('mapImg') || lines[i].includes('img-container') || lines[i].includes('map-container')) {
    console.log('Line', (i+1) + ':', lines[i].trim());
  }
  if (lines[i].includes('mapImg') || lines[i].includes('mapBackground') || lines[i].includes('map_bg')) {
    console.log('Line', (i+1) + ':', lines[i].trim());
  }
}
