var c=require('fs').readFileSync('F:\\暗区突围网站\\pages\\map-farm.html','utf8');
console.log('ly-pop:', c.indexOf('ly-pop')>=0?'FOUND':'NOT FOUND');
console.log('renderLayers:', c.indexOf('renderLayers')>=0?'FOUND':'NOT FOUND');
console.log('toggleAllLayers:', c.indexOf('toggleAllLayers')>=0?'FOUND':'NOT FOUND');
console.log('toggleLayer:', c.indexOf('toggleLayer')>=0?'FOUND':'NOT FOUND');
console.log('lp):', c.indexOf('lp)')>=0?'FOUND':'NOT FOUND');
