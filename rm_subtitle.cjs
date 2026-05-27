const fs = require('fs');
let c = fs.readFileSync('F:\\\u6697\u533a\u7a81\u56f4\u7f51\u7ad9\\pages\\maps.html', 'utf8');
// Remove the subtitle paragraph  
c = c.replace(/\n      <p>[^<]*<\/p>\n    <div class="map-detail"/, '\n    <div class="map-detail"');
// Remove empty lines produced
c = c.replace(/\n{3,}/g, '\n\n');
fs.writeFileSync('F:\\\u6697\u533a\u7a81\u56f4\u7f51\u7ad9\\pages\\maps.html', c);
console.log('Done');
