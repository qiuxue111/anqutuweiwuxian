const fs = require('fs');
['beishan','tvstation','armory','airport'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf('function loadCloudMarkers');
  const nextFn = c.indexOf('\nfunction', idx + 20);
  const fn = c.substring(idx, nextFn > idx ? nextFn : idx + 3000);
  console.log(eng, 'loadCloudMarkers:');
  // 看它怎么合并 cloudPins 和本地 pins
  const pushIdx = fn.indexOf('.push(');
  if (pushIdx >= 0) {
    // 看看 push 前是否处理了 floor
    const before = fn.substring(Math.max(0, pushIdx - 200), pushIdx + 100);
    console.log('  push block:', before);
  }
});
