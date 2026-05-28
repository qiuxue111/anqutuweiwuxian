const fs = require('fs');
['tvstation','beishan','armory','airport'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  
  // 查看 switchFloor
  const sfIdx = c.indexOf('function switchFloor');
  const nfIdx = c.indexOf('\nfunction', sfIdx + 20);
  console.log(eng, 'switchFloor:');
  console.log(c.substring(sfIdx, nfIdx > sfIdx ? nfIdx : sfIdx + 2000));
  console.log('---');
});
