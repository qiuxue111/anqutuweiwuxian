const fs = require('fs');
const c = fs.readFileSync('F:\\暗区突围网站\\pages\\maps.html', 'utf8');
['beishan','valley','farm'].forEach(id => {
  const start = c.indexOf('id="' + id + '"');
  const aStart = c.indexOf('查看交互地图', start);
  const aEnd = c.indexOf('</a>', aStart);
  console.log(id + ': ', JSON.stringify(c.substring(aEnd - 10, aEnd + 10)));
  // Check what's at the original insertion point
  const section = c.substring(start, start + 400);
  const videoDiv = section.indexOf('videos-');
  if (videoDiv >= 0) {
    console.log('  Contains videos container');
  }
  const closeDivIdx = section.lastIndexOf('</div>');
  console.log('  Section ends with:', JSON.stringify(section.substring(closeDivIdx - 20)));
});
