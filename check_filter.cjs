const fs = require('fs');
['beishan','tvstation','armory','airport'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  
  // 看 filterPinsByFloor
  const fi = c.indexOf('function filterPinsByFloor');
  const fe = c.indexOf('\nfunction', fi + 20);
  console.log(`${eng} filterPinsByFloor:`, c.substring(fi, fe > fi ? fe : fi + 1000));
  console.log('---');
});
