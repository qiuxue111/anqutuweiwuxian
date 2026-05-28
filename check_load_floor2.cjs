const fs = require('fs');
['beishan','tvstation','armory','airport'].forEach(eng => {
  const c = fs.readFileSync(`F:\\暗区突围网站\\pages\\map-${eng}.html`, 'utf-8');
  const idx = c.indexOf('function loadCloudPins');
  if (idx < 0) { console.log(eng + ': no loadCloudPins'); return; }
  const end = c.indexOf('\nfunction', idx + 20);
  const fn = c.substring(idx, end > idx ? end : idx + 5000);
  console.log(`${eng} loadCloudPins:`);
  console.log(fn.substring(0, 2000));
  console.log('---');
});
