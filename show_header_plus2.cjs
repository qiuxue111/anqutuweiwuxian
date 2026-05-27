const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
// Find the HTML tag with class="map-header" (not CSS)
const htmlHeaderStart = c.indexOf('map-header">');  // This is in the actual HTML, not CSS class definition
const h1End = c.indexOf('</h1>', htmlHeaderStart);
const firstDetail = c.indexOf('class="map-detail"', htmlHeaderStart);
console.log('HTML between map-header </h1> and first map-detail:');
console.log(c.substring(h1End + 5, firstDetail).trim());
