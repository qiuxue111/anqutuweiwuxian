const fs = require('fs');
['beishan','armory','airport','tvstation'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf('var cf=');
  if (idx >= 0) console.log(eng, ':', c.substring(idx, idx + 80));
  // 找 placePin 中的 cf
  const pIdx = c.indexOf('function placePin');
  const pEnd = c.indexOf('\nfunction', pIdx + 20);
  const fn = c.substring(pIdx, pEnd > pIdx ? pEnd : pIdx + 4000);
  const cfIdx = fn.indexOf('var cf=');
  if (cfIdx >= 0) console.log(eng, 'placePin cf:', fn.substring(cfIdx, cfIdx + 80));
  else {
    // 也许直接用了 currentFloor 或 cf 来自别处
    const flIdx = fn.indexOf('floor:cf');
    if (flIdx >= 0) {
      console.log(eng, 'placePin floor:cf附近:', fn.substring(Math.max(0, flIdx-40), flIdx + 30));
    }
  }
});
