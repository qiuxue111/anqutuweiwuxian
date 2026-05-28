const fs = require('fs');
['beishan','tvstation','armory','airport'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf('function loadCloudMarkers');
  const nextFn = c.indexOf('\nfunction', idx + 20);
  const fn = c.substring(idx, nextFn > idx ? nextFn : idx + 3000);
  console.log(eng);
  // 找 cp.x!==void 0 附近的完整 push
  const pushEnd = fn.indexOf('});');
  if (pushEnd >= 0) {
    const pushStart = fn.indexOf('.push({');
    console.log(fn.substring(pushStart, pushEnd + 3));
  }
  console.log('---');
});
